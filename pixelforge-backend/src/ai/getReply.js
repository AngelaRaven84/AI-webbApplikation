import {
	AIMessage,
	HumanMessage,
	SystemMessage,
} from '@langchain/core/messages';
import { llm } from '../config/ollama.config.js';

export const getReply = async ({ message, history = [] }) => {
	const previousMessages = history.map(({ role, content }) =>
		role === 'assistant' ? new AIMessage(content) : new HumanMessage(content),
	);

	const response = await llm.invoke([
		new SystemMessage(
			'Du är PixelForges hjälpsamma assistent. Svara på svenska. ' +
				'Du har ännu inte tillgång till butikens produkter eller ' +
				'supportdokument. Hitta inte på priser eller butiksvillkor.',
		),
		...previousMessages,
		new HumanMessage(message),
	]);

	return response.content;
};
