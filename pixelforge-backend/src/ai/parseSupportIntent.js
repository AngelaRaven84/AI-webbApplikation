import { z } from 'zod';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { llm } from '../config/ollama.config.js';

const supportModel = llm.withStructuredOutput(
	z.object({
		needsSupport: z.boolean(),
		query: z.string().nullable(),
		needsProducts: z.boolean(),
		productQuery: z.string().nullable(),
		maxPrice: z.number().nonnegative().nullable(),
		inStockOnly: z.boolean(),
	}),
);

export const parseSupportIntent = async ({ message, history = [] }) => {
	return supportModel.invoke([
		new SystemMessage(`
            Avgör vilka uppgifter som behöver hämtas för senaste frågan. Besvara inte frågan.
            
            SUPPORT
            needsSupport: true för butikens frakt, leverans, returer, betalningsvillkor och garantier.
            query: en fristående supportsökfråga, annars null. Ersätt hänvisningar som "då", "den" och "det" med vad kunden syftar på enligt historiken. Sökfrågan måste kunna förstås utan tillgång till samtalet. Bevara kundens fråga och lägg inte till villkor som kunden inte har angett.

            Exempel:
            Tidigare fråga: "Hur gör jag för att returnera en vara?"
            Senaste fråga: "Vem betalar frakten då?"
            query: "Vem betalar returfrakten när kunden returnerar en vara?"

            AKTUELL KUNDVAGN
            Frågor om vad som redan ligger i kundvagnen kräver ingen sökning i sortimentet eller supportdokumenten. Den aktuella kundvagnen tillhandahålls separat i chattflödet.

            Exempel:
            "Vad ligger i min kundvagn?"
            needsSupport: false, query: null,
            needsProducts: false, productQuery: null,
            maxPrice: null, inStockOnly; false
            
            PRODUKTER
            needsProducts: true för sortiment, produktrekommendationer, produktpriser och lagerstatus.
            productQuery: sökord för produktnamn, märke eller kategori, annars null.
            maxPrice: Kundens högsta pris i kronor, annars null.
            inStockOnly: true om kunden uttryckligen efterfrågar produkter i lager, annars false.
            Söktexten ska inte innehålla pris- eller lagerkrav; de anges i de separata fälten.
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
