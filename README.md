# PixelForge AI-assistent

En AI-assistent integrerad i PixelForges befintliga React-webbshop. Assistenten söker produkter i kursens produkt-API, besvarar supportfrågor med Supabase-RAG och kan lägga till och ta bort ett exemplar åt gången i den befintliga kundvagnen.

## Starta lokalt

Du behöver Node.js/npm (projektet har körts med Node.js 24), Ollama och ett Supabase-projekt. Internetanslutning behövs för Supabase och kursens produkt-/dokument-API.

1. Installera och konfigurera backend enligt [backendens guide](pixelforge-backend/README-backend.md), inklusive modeller, lokala miljövariabler och databas. Dokumenten behöver indexeras en gång i en tom databas.
2. Starta Ollama om det inte redan körs:

   ```powershell
   ollama serve
   ```

3. Starta backend i en egen terminal från projektets rot:

   ```powershell
   cd pixelforge-backend
   npm install
   npm run dev
   ```

4. Starta frontend i en annan terminal från projektets rot:

   ```powershell
   cd pixelforge-frontend
   npm install
   npm run dev
   ```

Öppna adressen som Vite visar, normalt http://localhost:5173. Frontend anropar http://localhost:8080/api/chat. Om backendporten ändras behöver även frontendens API-adress ändras.

[Frontendens guide](pixelforge-frontend/README.md) beskriver workspaces, komponentstruktur och webbshoppen.

## Lösningens ansvar och dataflöde

- **Frontend:** Chat visar meddelanden och dokumentlänkar. useChat håller historik och väntande precisering i React-state, skickar aktuell kundvagn och utför returnerade cartActions via den befintliga Zustand-storen.
- **Backend:** Express validerar anropet. getReply använder strukturerad modellbaserad tolkning för att styra kundvagn, produkt- och supportflöden. Modellval är inte en garanti för korrekt avsikt.
- **Produkter:** searchProductsTool hämtar produkt-API:et och filtrerar namn/märke/kategori, maxpris och lager. Svenska kategorialias hanteras i kod och formatProducts bygger produkttexten från resultatet.
- **Support/RAG:** rewriteSupportQuestion gör en fristående fråga utifrån senaste meddelandet och tidigare kundfrågor. Samma embeddingmodell används för dokument och frågor. Supabase match_documents hämtar fyra utdrag; supportsvaret genereras från frågan och dessa utdrag utan gamla assistentsvar.
- **Blandade frågor:** produkt- och supportunderlag hämtas i samma request och svarstexterna kombineras.
- **Kundvagn:** parseCartIntent tolkar begäran, handleCartIntent anropar befintliga verktyg som kontrollerar produktnamn mot API eller aktuell cart. Frontend utför åtgärden vid lyckat svar.
- **Dokumentlänkar:** source-id:n från hämtningen kopplas till id/title/slug i frontendens befintliga dokument-API. React Router öppnar /support/:slug i samma flik med chatten kvar.

Frontend följer startkodens base/shared/pages/core-struktur med namngivna npm-workspaces. Backend skiljer konfiguration, route, tolkning, prompt, formatering och tools åt.

## Exempel att prova

- ”Hitta tangentbord under 1500 kronor som finns i lager.” → ”Och möss under 800 kronor?”
- ”Lägg till den musen i kundvagnen.” → ”Lägg till en till av samma.”
- ”Vad ligger i min kundvagn?” → ”Ta bort en av mössen.” → ”Ta bort den sista också.”
- Med två olika produkter: ”Ta bort en av produkterna.” → exakt produktnamn, eller ”Nej, ta inte bort något.”
- ”Vad kostar standardfrakten inom Sverige och när blir den gratis?”
- ”Vem betalar returfrakten när jag returnerar en vara?” → ”Gäller det även om varan är trasig?”
- ”Erbjuder PixelForge livstids fri frakt för studenter?”

## Kontroller och kända begränsningar

Centrala produkt-, support-, kundvagns- och dokumentlänksflöden har manuellt provats under utvecklingen. Frontendens lint och build passerade enligt Saras test 28 oktober 2026; Vite varnade för en chunk större än 500 kB. Återhämtning efter avstängd/återstartad backend fungerade utan sidomladdning. Se [STATUS.md](STATUS.md) för daterade kontroller och pauslägen.

Kör från frontend-mappen:

```powershell
npm run lint
npm run build
```

- Backendens npm test är fortfarande ett placeholder-script, inte en automatisk testsvit.
- Svar och tolkningar kan vara felaktiga. Supporttext kan förenkla villkor eller ha språkfel; läs de länkade dokumenten för fullständiga villkor.
- ”Hämtade underlag” visar alla hämtade dokument, även mindre relevanta träffar. Listan bevisar inte att varje dokument stöder svaret.
- Historik och kundvagn lagras i minnet och återställs vid omladdning/ny flik.
- Kundvagnsåtgärder gäller ett exemplar per request. Flera produktrader kräver i vissa borttagningsfall exakt produktnamn; väntande precisering finns för borttagning.
- Lagerkontrollen säkerställer stock > 0 men räknar inte av redan valda exemplar. Full kvantitetshantering och idempotensskydd är inte implementerade.
- Förväntade verktygsfel kan visas som ett generellt chattfel.
- UI/design är vid denna uppdatering fortfarande under arbete.
- Seed-scriptets paketimport behöver rättas före ny indexering; se backendguiden. Kör inte seed mot befintliga dokument bara för att testa starten.

## Examinationsunderlag

Ursprungliga krav och inlämningsinstruktioner följer nedan. De är kravunderlag, inte en deklaration om slutligt betyg.

---


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
- [pixelforge-backend](./pixelforge-backend/README-backend.md) – installation, miljövariabler, Ollama, Supabase och seed-script.

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
