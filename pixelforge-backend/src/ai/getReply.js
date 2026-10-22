import {
	AIMessage,
	HumanMessage,
	SystemMessage,
} from '@langchain/core/messages';
import { llm } from '../config/ollama.config.js';
import { searchProductsTool } from '../tools/products/searchProductsTool.js';

const modelWithTools = llm.bindTools([searchProductsTool]);

export const getReply = async ({ message, history = [] }) => {
	const previousMessages = history.map(({ role, content }) =>
		role === 'assistant' ? new AIMessage(content) : new HumanMessage(content),
	);

	const messages = [
		new SystemMessage(
			`Du är PixelForges hjälpsamma assistent. Svara på svenska. Använd alltid search_products för frågor om produkter, priser och lager. Vid följdfrågor ska du använda historiken för att förstå frågan, men göra en ny sökning med de aktuella villkoren. Påstå aldrig att produkter sakna utan att först ha sökt. Ange bara produktegenskaper som uttryckligen finns i verktygets resultat. Gör inga egna rabattberäkningar. Du får visa price och originalPrice. Förklara inte förkortningar och lägg inte till tekniska egenskaper eller kvalitetsomdömen som saknas i underlaget. Säg tydligt när sökningen saknar träffar. Du har ännu inte tillgång till supportdokument. Hitta inte på priser eller
			butiksvillkor.`,
		),
		...previousMessages,
		new HumanMessage(message),
	];

	let response = await modelWithTools.invoke(messages);
	console.dir(response.tool_calls, { depth: null });

	if (response.tool_calls?.length) {
		messages.push(response);

		for (const toolCall of response.tool_calls) {
			if (toolCall.name !== searchProductsTool.name) {
				throw new Error('Modellen begärde ett okänt verktyg.');
			}

			const result = await searchProductsTool.invoke(toolCall);
			messages.push(result);
		}

		response = await llm.invoke(messages);
	}

	return response.content;
};
