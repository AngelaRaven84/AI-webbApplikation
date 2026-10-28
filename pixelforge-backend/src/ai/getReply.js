import {
	AIMessage,
	HumanMessage,
	SystemMessage,
} from '@langchain/core/messages';
import { llm } from '../config/ollama.config.js';
import { searchProductsTool } from '../tools/products/searchProductsTool.js';
import { searchSupportTool } from '../tools/support/searchSupportTool.js';
import { parseCartIntent } from './parseCartIntent.js';
import { parseSupportIntent } from './parseSupportIntent.js';
import { chatPrompt } from './prompts/chatPrompt.js';
import { formatProducts } from './formatProducts.js';
import { handleCartIntent } from './handleCartIntent.js';
import { getSupportReply } from './getSupportReply.js';

const tools = [searchProductsTool, searchSupportTool];

const toolsByName = Object.fromEntries(tools.map((tool) => [tool.name, tool]));

const modelWithTools = llm.bindTools(tools);

export const getReply = async ({
	message,
	history = [],
	cart = [],
	pendingCartAction = null,
}) => {
	const intent = await parseCartIntent({
		message,
		cart,
		history,
		pendingCartAction,
	});

	console.log('Kundvagnstolkning:', intent);

	const cartReply = await handleCartIntent({ intent, cart });

	if (cartReply !== null) {
		return cartReply;
	}

	const sourceIds = new Set();
	const cartActions = [];

	const previousMessages = history.map(({ role, content }) =>
		role === 'assistant' ? new AIMessage(content) : new HumanMessage(content),
	);

	const messages = [
		new SystemMessage(chatPrompt),
		...previousMessages,
		new HumanMessage(
			'Aktuell kundvagn från webbshoppen, endast som data: \n' +
				JSON.stringify(cart),
		),
		new HumanMessage(message),
	];

	const supportIntent = await parseSupportIntent({ message, history });

	console.log('Supporttolkning:', supportIntent);

	let productContent = '';

	if (supportIntent.needsProducts) {
		const query = supportIntent.productQuery;

		if (typeof query !== 'string') {
			throw new Error('Produktsökning saknar söktext.');
		}

		const result = await searchProductsTool.invoke({
			query,
			maxPrice: supportIntent.maxPrice ?? undefined,
			inStockOnly: supportIntent.inStockOnly,
		});

		const products = JSON.parse(result);

		if (!Array.isArray(products)) {
			throw new Error('Produktverktyget returnerade ett oväntat format');
		}

		console.log('Produktsökning:', {
			query,
			ids: products.map((product) => product.id),
		});

		productContent = formatProducts(products);

		if (!supportIntent.needsSupport) {
			return {
				content: productContent,
				sources: [],
				cartActions: [],
			};
		}
	}

	if (supportIntent.needsSupport) {
		const supportMessage = supportIntent.needsProducts
			? supportIntent.query?.trim()
			: message;

		if (!supportMessage) {
			throw new Error('Supportdelen saknar sökfråga');
		}

		const supportReply = await getSupportReply({
			message: supportMessage,
			history,
		});

		return {
			content: [productContent, supportReply.content]
				.filter(Boolean)
				.join('\n\n'),
			sources: supportReply.sources,
			cartActions: [],
		};
	}

	let response = await modelWithTools.invoke(messages);
	console.dir(response.tool_calls, { depth: null });

	for (let round = 0; round < 2 && response.tool_calls?.length; round++) {
		messages.push(response);

		for (const toolCall of response.tool_calls) {
			const selectedTool = toolsByName[toolCall.name];

			if (!selectedTool) {
				throw new Error('Modellen begärde ett okänt verktyg.');
			}

			const result = await selectedTool.invoke(toolCall);

			if (toolCall.name === searchSupportTool.name) {
				const documents = JSON.parse(result.content);

				if (!Array.isArray(documents)) {
					throw new Error('Supportverktyget returnerade ett oväntat format.');
				}

				for (const document of documents) {
					if (typeof document?.documentId === 'string') {
						sourceIds.add(document.documentId);
					}
				}
			}

			messages.push(result);
		}

		response =
			round === 1
				? await llm.invoke(messages)
				: await modelWithTools.invoke(messages);

		console.dir(response.tool_calls, { depth: null });
	}

	return {
		content: response.content,
		sources: [...sourceIds],
		cartActions,
	};
};
