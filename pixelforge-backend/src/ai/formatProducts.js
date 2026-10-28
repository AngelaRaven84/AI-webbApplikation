export const formatProducts = (products) =>
	products.length === 0
		? 'Inga produkter matchade sökvillkoren.'
		: products
				.map(
					(product) =>
						`${product.name}\nMärke: ${product.brand}\nPris: ${product.price} kr\nI lager: ${product.stock} st`,
				)
				.join('\n\n');
