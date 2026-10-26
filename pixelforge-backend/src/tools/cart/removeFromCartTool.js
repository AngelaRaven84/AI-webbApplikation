import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { createRemoveFromCartAction } from './createRemoveFromCartAction.js';

export const createRemoveFromCartTool = (cart) =>
	tool(
		async ({ productName }) => {
			const action = createRemoveFromCartAction({
				productName,
				cart,
			});

			return JSON.stringify({
				status: 'prepared',
				action,
			});
		},
		{
			name: 'remove_from_cart',
			description: `Förbered borttagning av ett exemplar ur aktuell kundvagn. Ange produktens exakta namn. Åtgärden är förberedd men ännu inte utförd.`,
			schema: z.object({
				productName: z
					.string()
					.trim()
					.min(1)
					.describe('Produktens exakta namn i kundvagnen.'),
			}),
		},
	);
