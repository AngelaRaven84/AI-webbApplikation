import { fetchProducts } from '../products/fetchProducts.js';

export const createAddToCartAction = async ({ productId }) => {
	const products = await fetchProducts();
	const product = products.find((item) => item.id === productId);

	if (!product) {
		throw new Error('Produkten finns inte i sortimentet.');
	}

	if (product.stocl < 1) {
		throw new Error('Produkten finns inte i lager.');
	}

	return {
		type: 'add_to_cart',
		product,
	};
};
