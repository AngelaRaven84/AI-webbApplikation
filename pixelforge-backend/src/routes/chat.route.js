import { Router } from 'express';
import { getReply } from '../ai/getReply.js';

const router = Router();

router.post('/', async (req, res) => {
	const { message, history = [], cart = [] } = req.body ?? {};

	const validHistory =
		Array.isArray(history) &&
		history.every(
			(item) =>
				item !== null &&
				typeof item === 'object' &&
				['user', 'assistant'].includes(item.role) &&
				typeof item.content === 'string',
		);

	const validCart =
		Array.isArray(cart) &&
		cart.every(
			(item) =>
				item !== null &&
				typeof item === 'object' &&
				typeof item.productId === 'string' &&
				item.productId.trim().length > 0 &&
				typeof item.name === 'string' &&
				Number.isSafeInteger(item.qty) &&
				item.qty > 0,
		);

	if (!validCart) {
		return res.status(400).json({
			error: 'Kundvagnen har ett ogiltigt format.',
		});
	}

	if (typeof message !== 'string' || !message.trim() || !validHistory) {
		return res.status(400).json({
			error: 'En fråga och giltig historik behövs.',
		});
	}

	try {
		const reply = await getReply({
			message: message.trim(),
			history,
			cart,
		});

		return res.json(reply);
	} catch {
		return res.status(500).json({
			error: 'Det gick inte att hämta ett svar från modellen.',
		});
	}
});

export default router;
