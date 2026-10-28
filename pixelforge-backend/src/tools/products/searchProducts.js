import { fetchProducts } from './fetchProducts.js';

const categoryAliases = {
	mus: 'mice',
	musen: 'mice',
	möss: 'mice',
	datormus: 'mice',
	datormöss: 'mice',
	tangentbord: 'keyboard',
	skärm: 'monitors',
	skärmar: 'monitors',
	headset: 'headsets',
	hörlurar: 'headsets',
};

export const searchProducts = async ({
	query = '',
	maxPrice,
	inStockOnly = false,
} = {}) => {
	const products = await fetchProducts();
	const normalizedQuery = query.trim().toLowerCase();
	const searchText = categoryAliases[normalizedQuery] ?? normalizedQuery;

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
