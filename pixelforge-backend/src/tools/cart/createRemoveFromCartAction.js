export const createRemoveFromCartAction = ({ productName, cart }) => {
	const name = productName.trim().toLowerCase();

	const matches = cart.filter(
		(item) => item.name.trim().toLowerCase() === name,
	);

	if (matches.length === 0) {
		throw new Error('Produkten finns inte i kundvagnen.');
	}

	if (matches.length > 1) {
		throw new Error(
			'Flera kundvagnsrader matchar. Produkten behöver preciseras.',
		);
	}

	const item = matches[0];

	return {
		type: 'remove_from_cart',
		productId: item.productId,
		name: item.name,
	};
};
