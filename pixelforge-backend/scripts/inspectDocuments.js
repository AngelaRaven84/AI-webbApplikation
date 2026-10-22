import fs from 'node:fs/promises';
import path from 'node:path';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textSplitters';

const documentsPath = path.resolve('documents');
const files = await fs.readdir(documentsPath);
const pdfFiles = files.filter((file) => file.endsWith('.pdf'));

const documents = [];

for (const file of pdfFiles) {
	const loader = new PDFLoader(path.join(documentsPath, file));
	const pages = await loader.load();

	for (const page of pages) {
		page.metadata.source = file;
		page.metadata.documentId = file.split('_')[0];
	}

	documents.push(...pages);
}

const splitter = new RecursiveCharacterTextSplitter({
	chunkSize: 1000,
	chunkOverlap: 200,
});

const chunks = await splitter.splitDocuments(documents);

console.log('PDF-filer:', pdfFiles.length);
console.log('Inlästa dokumentdelar:', documents.length);
console.log('Chunks:', chunks.length);

console.dir(
	chunks.slice(0, 2).map((chunk) => ({
		text: chunk.pageContent,
		source: chunk.metadata.source,
		page: chunk.metadata.loc?.pageNumber,
		documentId: chunk.metadata.documentId,
	})),
	{ depth: null },
);
