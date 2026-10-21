# Examination – PixelForge AI-assistent

## Projektbeskrivning

PixelForge är en e-handelsplattform för teknikprodukter som vill förbättra sin kundservice med hjälp av en AI-driven chatbot. Du har fått en befintlig frontend och en förberedd backend som utgångspunkt. Din uppgift är att utveckla och integrera en chatbot som hjälper kunder att hitta produkter och få svar på frågor om butikens villkor och support.

**Syftet** är att tillämpa kursens tekniker i en fungerande fullstackapplikation. **Målet** är en chatbot som kan använda både butikens dokumentation och aktuell produktinformation för att ge relevanta svar samt förstå följdfrågor.

## Kravspecifikation

Chatbotten ska:

- Vara integrerad i PixelForges befintliga frontend och kommunicera med en språkmodell.
- Kunna besvara frågor om exempelvis leverans, retur och reklamation utifrån de tillhandahållna supportdokumenten.
- Kunna söka fram och ge information om produkter, exempelvis pris, kategori och lagerstatus.
- Hantera konversationshistorik så att användaren kan ställa följdfrågor.
- Använda **RAG** för supportdokument och **tools** för produktinformation. Du väljer själv hur dessa tekniker kombineras; någon särskild orkestreringslösning krävs inte.

## Teknik och projektstruktur

Utgå från de tillhandahållna projekten:

- [pixelforge-frontend](./pixelforge-frontend/README.md) – installation, komponenter, package-arkitektur och frontendens funktioner.
- [pixelforge-backend](./pixelforge-backend/README.md) – installation, miljövariabler, Ollama, Supabase och seed-script.

Använd **React**, **Node.js/Express**, **LangChain.js**, **Ollama**, **Supabase** och kursens tekniker för **RAG och tools**.

Du får själv välja om du bygger chatbotens AI-logik i frontend eller backend, men **backend rekommenderas**. All kommunikation med Supabase som kräver hemliga nycklar ska ske i backend. Lägg aldrig Supabase-nycklar eller andra hemligheter i frontendkod eller i ett publikt GitHub-repository.

## Betygskriterier

### Godkänt (G)

För G ska samtliga krav i kravspecifikationen vara uppfyllda. Chatbotten ska fungera i den befintliga applikationen och använda både RAG och tools för sina respektive uppgifter. Den ska också kunna förstå och besvara relevanta följdfrågor.

### Väl godkänt (VG)

För VG ska samtliga G-krav vara uppfyllda. Dessutom ska:

- **Kundvagnen kunna hanteras via chatbotten:** Användaren ska kunna lägga till och ta bort produkter med naturligt språk, även genom följdfrågor. Ändringarna ska synas i webbshoppens kundvagn.
- **Relevanta dokument länkas i chatten:** När chatbotten besvarar en fråga med hjälp av ett supportdokument ska användaren kunna öppna dokumentets egen sida i PixelForge via en klickbar länk.
- **Koden vara skalbar och modulär:** Lösningen ska följa de arkitektoniska principerna i den tillhandahållna koden på ett genomtänkt sätt, med tydlig ansvarsfördelning och återanvändbara delar.

## Inlämning och examination

**Deadline: 29 oktober 2026 kl. 23:59.**

Lämna in en länk till ditt GitHub-repository enligt instruktionerna på kursplattformen. Se till att projektet innehåller en README med information om hur lösningen installeras och startas samt vilka miljövariabler som behöver konfigureras. Lämna inte in hemliga nycklar eller `.env`-filer.

**Examinerande Code Review: 30 oktober 2026.** Schema publiceras senare. Du ska kunna demonstrera chatbotten och förklara hur du har implementerat RAG, tools, konversationshistorik och eventuell VG-funktionalitet.
