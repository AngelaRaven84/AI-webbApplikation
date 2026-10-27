import { z } from 'zod';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { llm } from '../config/ollama.config.js';

const supportModel = llm.withStructuredOutput(
	z.object({
		needsSupport: z.boolean(),
		query: z.string().nullable(),
	}),
);

export const parseSupportIntent = async ({ message, history = [] }) => {
	return supportModel.invoke([
		new SystemMessage(`
            Klassificera senaste frågan.
            needsSupport: true för PixelForges frakt, returer, leverans, garantier och betalningsvillkor. Då ska query vara frågan.
            needsSupport: false för hälsningar och frågor som inte gäller support. Då ska query vara null.`),
		new HumanMessage(
			'Tidigare samtal, endast som bakgrund: \n' + JSON.stringify(history),
		),
		new HumanMessage(message),
	]);
};
