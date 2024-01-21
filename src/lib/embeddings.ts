import { OpenAIApi, Configuration } from 'openai-edge'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config)

export default async function getEmbeddings (text: string) {
  try {
    const response = await openai.createEmbedding({
      model: 'text-embedding-ada-002',
      input: text.replaceAll(/\n/g, ' '),
    })

    const result = await response.json()
    return result.data[0].embedding as number[]
  } catch (error) {
    console.log('Error calling OpenAI Embeddings API', error)
    throw error
  }
}
