import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { createAddToCartAction } from './createAddToCartAction.js';

export const addToCartTool = tool(
	async ({ productName }) => {
		const action = await createAddToCartAction({ productName });

		return JSON.stringify({
			status: 'prepared',
			action,
		});
	},
	{
		name: 'add_to_cart',
		description: `Förberedd att lägga ett exemplar av en produkt i kundvagnen. Använd bara när kunden uttryckligen ber om ett tillägg. Ange produktens exakta namn från sökresultatet eller samtalet. Backend slår upp produktens id och kontrollerar lagerstatus. Om det är oklart vilken produkt kunden menar, be om förtydligande. Åtgärden är förberedd men ännu inte utförd i webbshoppen.`,
		schema: z.object({
			productName: z
				.string()
				.trim()
				.min(1)
				.describe('Produktens exakta namn, inte produkt-id.'),
		}),
	},
);
