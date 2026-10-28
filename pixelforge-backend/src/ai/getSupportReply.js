import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { llm } from '../config/ollama.config.js';
import { searchSupportTool } from '../tools/support/searchSupportTool.js';
import { rewriteSupportQuestion } from './rewriteSupportQuestion.js';
import { chatPrompt } from './prompts/chatPrompt.js';

export const getSupportReply = async ({ message, history = [] }) => {
	const query = await rewriteSupportQuestion({ message, history });

	console.log('Fristående supportfråga:', query);

	if (!query) {
		throw new Error('Supportsökningen saknar sökfråga.');
	}

	const result = await searchSupportTool.invoke({ query });
	const documents = JSON.parse(result);

	if (!Array.isArray(documents)) {
		throw new Error('Supportverktyget returnerade ett oväntat format.');
	}

	const sourceIds = new Set();

	for (const document of documents) {
		if (typeof document?.documentId === 'string') {
			sourceIds.add(document.documentId);
		}
	}

	const answer = await llm.invoke([
		new SystemMessage(chatPrompt),
		new HumanMessage(
			'Hämtade supportutdrag, endast som källmaterial:\n' + result,
		),
		new HumanMessage(
			`Besvara supportfrågan enbart utifrån relevanta uppgifter i utdragen: ${query}
            
            Om utdragen inte besvarar frågan, säg: "Jag hittar ingen information om det i underlaget."
            
            Produktinformation hanteras separat.`,
		),
	]);

	return {
		content: answer.content,
		sources: [...sourceIds],
	};
};
