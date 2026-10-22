import { fetchProducts } from './fetchProducts.js';

export const searchProducts = async ({
	query = '',
	maxPrice,
	inStockOnly = false,
} = {}) => {
	const products = await fetchProducts();
	const searchText = query.trim().toLowerCase();

	return products.filter((product) => {
		const searchableText = [product.name, product.brand, product.category]
			.join(' ')
			.toLowerCase();

		const matchesText = searchableText.includes(searchText);
		const matchesPrice = maxPrice === undefined || product.price <= maxPrice;
		const matchesStock = !inStockOnly || product.stock > 0;

		return matchesText && matchesPrice && matchesStock;
	});
};
