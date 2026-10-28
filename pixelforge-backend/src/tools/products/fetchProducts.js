export const fetchProducts = async () => {
	const response = await fetch(
		'https://santosnr6.github.io/Data/pixelforgeproducts.json',
	);

	if (!response.ok) {
		throw new Error('Det gick inte att hämta produkterna.');
	}

	const products = await response.json();

	if (!Array.isArray(products)) {
		throw new Error('Produkt-API:et returnerade ett oväntat format.');
	}

	return products;
};
