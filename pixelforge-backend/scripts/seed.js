import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textSplitters';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { embeddingModel } from '../src/config/ollama.config.js';
import { supabase } from '../src/config/supabase.config.js';

// 1. Hämta alla PDF-filer
const documentsPath = path.resolve('documents');
const files = await fs.readdir(documentsPath);

const pdfFiles = files.filter((file) => file.endsWith('.pdf'));

const documents = [];

for (const file of pdfFiles) {
	const loader = new PDFLoader(path.join(documentsPath, file));

	const pages = await loader.load();

	// Spara ursprungsfilens namn i metadata
	for (const page of pages) {
		page.metadata.source = file;
		page.metadata.documentId = file.split('_')[0];
	}

	documents.push(...pages);
}

// 2. Dela upp texten i mindre chunks
const splitter = new RecursiveCharacterTextSplitter({
	chunkSize: 1000,
	chunkOverlap: 200,
});

const chunks = await splitter.splitDocuments(documents);

// for(let i = 0; i < 5; i++) {
//     console.log(chunks[i]);
// }

// 3. Skapa embeddings och lagra i supabase
await SupabaseVectorStore.fromDocuments(chunks, embeddingModel, {
	client: supabase,
	tableName: 'documents',
	queryName: 'match_documents',
});
console.log('Alla dokument har lagrats i supabase');
