import { addToCartTool } from '../tools/cart/addToCartTool.js';
import { createRemoveFromCartTool } from '../tools/cart/removeFromCartTool.js';

export const handleCartIntent = async ({ intent, cart }) => {
	if (
		intent.action === 'clarify' ||
		(['add', 'remove'].includes(intent.action) && !intent.productName?.trim())
	) {
		return {
			content: 'Vilken produkt menar du?',
			sources: [],
			cartActions: [],
			pendingCartAction: intent.pendingAction ?? null,
		};
	}
	if (intent.action === 'add') {
		const result = await addToCartTool.invoke({
			productName: intent.productName,
		});

		const prepared = JSON.parse(result);

		if (
			prepared.status !== 'prepared' ||
			prepared.action?.type !== 'add_to_cart' ||
			typeof prepared.action.product?.id !== 'string'
		) {
			throw new Error('Ogiltig kundvagnsåtgärd');
		}

		return {
			content: `${prepared.action.product.name} har lagts till i kundvagnen.`,
			sources: [],
			cartActions: [prepared.action],
		};
	}

	if (intent.action === 'remove') {
		const removeTool = createRemoveFromCartTool(cart);

		const result = await removeTool.invoke({
			productName: intent.productName,
		});

		const prepared = JSON.parse(result);

		if (
			prepared.status !== 'prepared' ||
			prepared.action?.type !== 'remove_from_cart' ||
			typeof prepared.action.productId !== 'string'
		) {
			throw new Error('Ogiltig borttagningsåtgärd.');
		}

		return {
			content: `Ett exemplar av ${prepared.action.name} har tagits bort från kundvagnen`,
			sources: [],
			cartActions: [prepared.action],
		};
	}

	return null;
};
