import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { searchProducts } from './searchProducts.js';

export const searchProductsTool = tool(
	async (input) => {
		const products = await searchProducts(input);

		return JSON.stringify(products);
	},
	{
		name: 'search_products',
		description:
			'Sök produkter i PixelForges sortiment. ' +
			'Använd engelska sökord för kategorier, exempelvis ' +
			'Keyboards för tangentbord. Sökningen matchar text i ' +
			'produktnamn, märke eller kategori. ' +
			'Använd tom query för att söka i hela sortimentet.',
		schema: z.object({
			query: z.string().describe('Söktext eller tom sträng.'),
			maxPrice: z
				.number()
				.nonnegative()
				.optional()
				.describe('Högsta pris i kronor. Utelämna utan prisgräns.'),
			inStockOnly: z
				.boolean()
				.describe('True om endast produkter i lager ska visas.'),
		}),
	},
);
