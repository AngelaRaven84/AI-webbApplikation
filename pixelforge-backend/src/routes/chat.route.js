import { Router } from 'express';
import { getReply } from '../ai/getReply.js';

const router = Router();

router.post('/', async (req, res) => {
	const { message, history = [] } = req.body ?? {};

	const validHistory =
		Array.isArray(history) &&
		history.every(
			(item) =>
				item !== null &&
				typeof item === 'object' &&
				['user', 'assistant'].includes(item.role) &&
				typeof item.content === 'string',
		);

	if (typeof message !== 'string' || !message.trim() || !validHistory) {
		return res.status(400).json({
			error: 'En fråga och giltig historik behövs.',
		});
	}

	try {
		const reply = await getReply({
			message: message.trim(),
			history,
		});

		return res.json(reply);
	} catch {
		return res.status(500).json({
			error: 'Det gick inte att hämta ett svar från modellen.',
		});
	}
});

export default router;
