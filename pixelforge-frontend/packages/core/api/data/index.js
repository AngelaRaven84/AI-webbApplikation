export const fetchProducts = async () => {
	const response = await fetch(
		'https://santosnr6.github.io/Data/pixelforgeproducts.json',
	);

	if (!response.ok) {
		throw new Error('Något gick fel vid API-anropet');
	}

	const data = await response.json();

	return data;
};

export const fetchDocuments = async () => {
	const response = await fetch(
		'https://santosnr6.github.io/Data/pixelforgedocuments.json',
	);

	if (!response.ok) {
		throw new Error('Något gick fel vid API-anropet');
	}

	const data = await response.json();

	return data;
};

export const sendChatMessage = async ({
	message,
	history,
	cart,
	pendingCartAction,
}) => {
	const response = await fetch('http://localhost:8080/api/chat', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ message, history, cart, pendingCartAction }),
	});

	if (!response.ok) {
		throw new Error('Det gick inte att hämta ett chattsvar.');
	}

	return response.json();
};
