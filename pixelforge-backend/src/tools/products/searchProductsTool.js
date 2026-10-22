import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { searchProducts } from './searchProducts.js';

export const searchProductsTool = tool(
	async (input) => {
		const products = await searchProducts(input);

		return JSON.stringify(
			products.map(({ id, name, brand, category, price, stock }) => ({
				id,
				name,
				brand,
				category,
				price,
				stock,
			})),
		);
	},
	{
		name: 'search_products',
		description: `Sök produkter i PixelForges teknikbutik. Sökningen matchar text i produktnamn, märke eller kategori. Använd API:ets engelska kategorinamn: Keyboards för tangentbord, Mice för datormöss, Monitors för bildskärmar och Headsets för headset. I denna butik betyder möss datormöss, alltså Mice. Använd tom query för att söka i hela sortimentet.`,
		schema: z.object({
			query: z.string().describe('Söktext eller tom sträng.'),
			maxPrice: z
				.number()
				.nonnegative()
				.optional()
				.describe(
					'Högsta pris i svenska kronor, exakt som kunden anger. 800 kronor ska anges som 800. Gör ingen valutaomvandling och ändra inte beloppets storlek. Utelämna utan prisgräns.',
				),
			inStockOnly: z
				.boolean()
				.describe('True om endast produkter i lager ska visas.'),
		}),
	},
);
