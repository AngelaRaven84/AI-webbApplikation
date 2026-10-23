import { fetchProducts } from '../products/fetchProducts.js';

export const createAddToCartAction = async ({ productName }) => {
	const products = await fetchProducts();
	const name = productName.trim().toLowerCase();

	const matches = products.filter(
		(product) => product.name.trim().toLowerCase() === name,
	);

	if (matches.length === 0) {
		throw new Error('Produkten finns inte i sortimentet.');
	}

	if (matches.length > 1) {
		throw new Error(
			'Flera produkter har samma namn. Produkten behöver preciseras.',
		);
	}

	const product = matches[0];

	if (product.stock < 1) {
		throw new Error('Produkten finns inte i lager.');
	}

	return {
		type: 'add_to_cart',
		product,
	};
};
