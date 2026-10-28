import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { embeddingModel } from '../config/ollama.config.js';
import { supabase } from '../config/supabase.config.js';

const vectorStore = new SupabaseVectorStore(embeddingModel, {
	client: supabase,
	tableName: 'documents',
	queryName: 'match_documents',
});

export const searchSupport = async (query) => {
	return vectorStore.similaritySearch(query, 4);
};
