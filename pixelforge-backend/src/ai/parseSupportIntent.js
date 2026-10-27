import { z } from 'zod';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { llm } from '../config/ollama.config.js';

const supportModel = llm.withStructuredOutput(
	z.object({
		needsSupport: z.boolean(),
		query: z.string().nullable(),
		needsProducts: z.boolean(),
		productQuery: z.string().nullable(),
	}),
);

export const parseSupportIntent = async ({ message, history = [] }) => {
	return supportModel.invoke([
		new SystemMessage(`
            Avgör vilka uppgifter som behöver hämtas för senaste frågan. Besvara inte frågan.
            
            SUPPORT
            needsSupport: true för butikens frakt, leverans, returer, betalningsvillkor och garantier.
            query: en fristående supportsökfråga, annars null.
            
            PRODUKTER
            needsProducts: true för sortiment, produktrekommendationer, produktpriser och lagerstatus.
            productQuery: sökord för produktnamn, märke eller kategori, annars null.
            Använd engelska kategorinamn: Headsets, Keyboards, Mice, Monitors.
            Använd historiken bara för att förstå hänvisningar.
            
            Båda behoven kan vara true i samma fråga.
            
            Exempel:
            "Vad har ni för headsets?"
            needsSupport: false, query: null,
            needsProducts: true, productQuery: "Headsets"
            
            "Vad kostar frakten?"
            needsSupport: true, query: "Vad kostar frakten?",
            needsProducts: false, productQuery: null
            
            "Hej!"
            needsSupport: false, query: null,
            needsProducts: false, productQuery: null`),
		new HumanMessage(
			'Tidigare samtal, endast som bakgrund: \n' + JSON.stringify(history),
		),
		new HumanMessage(message),
	]);
};
