import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone"
import { PDFLoader } from "langchain/document_loaders/fs/pdf"
import { Document, RecursiveCharacterTextSplitter } from "@pinecone-database/doc-splitter"
import md5 from "md5"

import getEmbeddings from "./embeddings";
import { downloadFromS3 } from "./s3-server";
import { convertToAscii } from "./utils";

let pinecone: Pinecone | null = null;

export const getPinecone = async () => {
  if (pinecone) {
    return pinecone;
  }

  pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: process.env.PINECONE_ENVIRONMENT!
  });

  return pinecone;
}

type PDFPage = {
  pageContent: string
  metadata: {
    loc: { pageNumber: number }
  }
}

export async function loadS3InToPinecone (file_key: string) {
  // 1. Obtain the PDF -> download & read from the PDF

  console.log("Obtaining the PDF from S3");
  const file_name = await downloadFromS3(file_key);

  if (!file_name) {
    throw new Error("Error getting file from Amazon S3");
  }

  const loader = new PDFLoader(file_name as string);
  const pages = (await loader.load()) as PDFPage[];

  // 2. Split & segment the PDF -> split into small pages
  const documents = await Promise.all(pages.map(prepareDocument));

  // 3. Vectorize and embed individual documents -> using OpenAI's API
  const embeddings = await Promise.all(documents.flat().map(embedDocument));

  // 4. Insert into Pinecone -> upload the embeddings to Pinecone

  const client = await getPinecone();
  const pineconeIndex = client.Index('contextpdf')
  const namespace = pineconeIndex.namespace(convertToAscii(file_key))

  console.log("Upserting embeddings to Pinecone");
  await namespace.upsert(embeddings);

  return documents[0];
}

async function embedDocument (doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber
      }
    } as PineconeRecord
  } catch (error) {
    console.log("Error embedding document", error);
    throw error
  }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder('utf-8').decode(enc.encode(str).slice(0, bytes));
}

async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page
  pageContent = pageContent.replace(/\n/g, " ")

  // Split the document into smaller ones

  const splitter = new RecursiveCharacterTextSplitter()
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000)
      }
    })
  ])

  return docs
}
