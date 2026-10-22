import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { searchSupport } from '../../ai/searchSupport.js';

export const searchSupportTool = tool(
	async ({ query }) => {
		const documents = await searchSupport(query);

		return JSON.stringify(
			documents.map(({ pageContent, metadata }) => ({
				text: pageContent,
				documentId: metadata.documentId,
				source: metadata.source,
			})),
		);
	},
	{
		name: 'search_support',
		description: `Sök i PixelForges supportdokument efter butikens villkor om exempelvis frakt, leverans, returer och betalning. Ange en tydlig, fristående sökfråga. Vid följdfrågor ska relevant sammanhang från samtalet tas med i sökfrågan.`,
		schema: z.object({
			query: z
				.string()
				.trim()
				.min(1)
				.describe('En fristående fråga om butikens support eller villkor.'),
		}),
	},
);
