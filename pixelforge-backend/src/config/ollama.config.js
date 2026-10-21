import { ChatOllama, OllamaEmbeddings } from '@langchain/ollama';
import 'dotenv/config';

export const llm = new ChatOllama({
    model: process.env.OLLAMA_LLM,
    temperature: 0.2
});

export const embeddingModel = new OllamaEmbeddings({
    model: process.env.OLLAMA_EMBEDDING_MODEL,
    baseUrl: "http://localhost:11434",
});