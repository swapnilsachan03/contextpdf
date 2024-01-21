import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import getEmbeddings from "./embeddings";

export async function getMatchesWithEmbeddings (embeddings: number[], fileKey: string) {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: process.env.PINECONE_ENVIRONMENT!
  });

  const index = await pinecone.Index('contextpdf');

  try {
    const namespace = convertToAscii(fileKey);
    const queryResult = await index.query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
      filter: {
        namespace
      }
    })

    return queryResult.matches || []
  } catch (error) {
    console.log('Error querying embeddings', error);
    throw error
  }
}

export async function getContext (query: string, fileKey: string) {
  const queryEmbeddings = await getEmbeddings(query);
  const matches = await getMatchesWithEmbeddings(queryEmbeddings, fileKey);

  const qualifyingDocs = matches.filter (
    match => match.score && match.score > 0.7
  );

  type Metadata = {
    text: string,
    pageNumber: number
  }

  let docs = qualifyingDocs.map(match => (match.metadata as Metadata).text);
  return docs.join('\n').substring(0, 3000);
}
