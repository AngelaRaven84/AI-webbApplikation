import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { createAddToCartAction } from './createAddToCartAction.js';

export const addToCartTool = tool(
	async ({ productId }) => {
		const action = await createAddToCartAction({ productId });

		return JSON.stringify({
			status: 'prepared',
			action,
		});
	},
	{
		name: 'add_to_cart',
		description: `Förbered att lägga ett exemplar av en produkt i kundvagnen. Använd bara när kunden ber att lägga till produkten. Använd ett riktigt produkt-id från en produktsökning eller en tydlig hänvisning till dess resultat i historiken. Åtgärden är förberedd men ännu inte utförd i webbshoppen.`,
		schema: z.object({
			productId: z
				.string()
				.trim()
				.min(1)
				.describe('Produktens id i PixelForges sortiment.'),
		}),
	},
);
