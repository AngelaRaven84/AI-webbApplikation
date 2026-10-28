# PixelForge AI-assistent

Det här är mitt examinationsprojekt i kursen Utveckling av AI-drivna applikationer. Jag har byggt vidare på PixelForges befintliga webbshop och lagt till en AI-assistent som hjälper kunden att hitta produkter, få svar på supportfrågor och hantera sin kundvagn.

Jag började med en enkel chatt i frontend och kopplade sedan på backend, produktverktyg och RAG. Därefter byggde jag vidare med dokumentlänkar och möjligheten att lägga till och ta bort produkter genom chatten. Planering och anteckningar från arbetet finns i [STATUS.md](STATUS.md). Där har jag också sparat examinationsuppgiften.

## Vad chatten kan göra

- Söka efter produkter utifrån namn, märke, kategori, pris och lagerstatus.
- Svara på frågor om till exempel frakt, returer och betalning med hjälp av butikens supportdokument.
- Förstå följdfrågor utifrån samtalet.
- Lägga till och ta bort ett exemplar åt gången i webbshoppens kundvagn.
- Be om ett förtydligande när det är oklart vilken produkt som ska tas bort.
- Visa länkar till de hämtade supportdokumentens sidor i webbshoppen.

Det går också att fråga om både produkter och support i samma meddelande.

## Tekniker jag har använt

Frontend är byggd med React och Vite. Jag använder TanStack Query för anrop, React Router för navigering och den befintliga Zustand-storen för kundvagnen.

I backend använder jag Node.js, Express och LangChain.js. Språkmodellen körs lokalt med Ollama och supportdokumentens embeddings lagras i Supabase.

Jag har använt modellerna:

- `qwen3:4b-instruct` för chatten och tolkning av frågor.
- `qwen3-embedding:0.6b` för embeddings, med 1024 dimensioner.

## Starta projektet

För att köra projektet behövs Node.js och npm, Ollama och ett Supabase-projekt. Jag har arbetat med Node.js 24. Internetanslutning behövs för Supabase och produkt- och dokument-API:erna.

Börja med [backendens README](pixelforge-backend/README-backend.md). Där beskriver jag miljövariablerna, modellerna och hur databasen förbereds. Vid en ny installation behöver dokumenten läsas in en gång innan supportfrågorna fungerar.

Starta Ollama om det inte redan körs:

```powershell
ollama serve
```

Öppna en terminal i projektets rot och starta backend:

```powershell
cd pixelforge-backend
npm install
npm run dev
```

Öppna sedan en ny terminal i projektets rot och starta frontend:

```powershell
cd pixelforge-frontend
npm install
npm run dev
```

Öppna adressen som Vite visar, vanligtvis http://localhost:5173. Backend körs på http://localhost:8080 och chatten anropar `POST /api/chat`.

Om backendporten ändras behöver adressen i frontendens API-funktion också ändras. Mer information om frontendens befintliga paketstruktur finns i [frontendens README](pixelforge-frontend/README.md).

## Hur jag har byggt lösningen

Jag har behållit startkodens struktur med `base`, `shared`, `pages` och `core`. Chattkomponenten ligger i shared, medan hooken, API-anropen och kundvagnens state ligger i core.

När kunden skickar ett meddelande skickar frontend även tidigare meddelanden, aktuell kundvagn och eventuell väntande precisering till backend. Där tolkas vad kunden vill göra innan rätt funktion anropas.

### Produkter

Produktverktyget hämtar riktiga produkter från kursens API. Filtreringen görs i JavaScript och produkttexten byggs från resultatet, så modellen inte själv behöver hitta på namn, priser eller lagerantal. Jag har också lagt till svenska kategoriord, till exempel att ”möss” matchas mot API:ets kategori Mice.

### Support och RAG

Jag läser in supportdokumenten från PDF-filer, delar upp texten i chunks och lagrar embeddings i Supabase. Vid en supportfråga skrivs frågan först om så att den går att förstå utan resten av samtalet. Sedan hämtas fyra dokumentutdrag genom vektorsökning.

Supportsvaret får den fristående frågan och dokumentutdragen. Jag skickar inte med gamla assistentsvar i det steget, eftersom felaktiga tidigare svar annars kan följa med och upprepas.

Dokumentens id:n skickas tillbaka separat från svarstexten. Frontend kopplar dem till rätt titel och slug och visar länkar till dokumentens egna supportsidor.

### Kundvagnen

Jag har separerat tolkningen av kundens önskemål från själva kundvagnsåtgärden. Verktygen kontrollerar produktnamnet mot produkt-API:et eller aktuell kundvagn och förbereder en åtgärd med rätt produkt-id. När svaret kommer tillbaka utför frontend åtgärden i den befintliga storen.

Vid en otydlig borttagning sparas en väntande åtgärd. Kunden kan då svara med produktnamnet eller avbryta utan att något tas bort.

## Exempel att testa

- ”Hitta tangentbord under 1500 kronor som finns i lager.” → ”Och möss under 800 kronor?”
- ”Lägg till den musen i kundvagnen.” → ”Lägg till en till av samma.”
- ”Vad ligger i min kundvagn?” → ”Ta bort en av mössen.” → ”Ta bort den sista också.”
- Med två olika produkter: ”Ta bort en av produkterna.” → exakt produktnamn eller ”Nej, ta inte bort något.”
- ”Vad kostar standardfrakten inom Sverige och när blir den gratis?”
- ”Vem betalar returfrakten när jag returnerar en vara?” → ”Gäller det även om varan är trasig?”
- ”Erbjuder PixelForge livstids fri frakt för studenter?”

## Tester och sådant som finns kvar

Jag har testat produktfrågor, supportfrågor, följdfrågor, blandade frågor, dokumentlänkar och kundvagnens tillägg, borttagning och avbrytande. Jag har även testat att stoppa backend och starta den igen. Chatten fungerar då igen utan att sidan behöver laddas om.

Den 28 oktober gick frontendens lint och build igenom. Vite visar en varning om en chunk större än 500 kB, men bygget slutförs.

Kör kontrollerna från frontend-mappen:

```powershell
npm run lint
npm run build
```

Det finns fortfarande begränsningar som jag vill vara tydlig med:

- AI:n kan misstolka frågor, förenkla villkor eller uttrycka sig konstigt. Dokumentlänkarna gör att kunden kan läsa de fullständiga villkoren.
- Länklistan visar alla hämtade underlag, även när någon träff är mindre relevant.
- Historik och kundvagn ligger i minnet och försvinner vid omladdning eller i en ny flik.
- Kundvagnsåtgärderna gäller ett exemplar åt gången. Vid vissa borttagningar med flera produkter behövs hela produktnamnet.
- Lagerkontrollen tar inte hänsyn till hur många exemplar som redan ligger i kundvagnen. Jag har inte byggt generellt skydd mot upprepade åtgärder.
- Vissa verktygsfel visas fortfarande som ett generellt chattfel.
- Backendens `npm test` är kvar från startkoden och innehåller ingen fungerande testsvit.
- Chattens design är fortfarande under arbete.
- Innan en ny seed behöver paketimporten i seed-scriptet rättas enligt backendens README. Befintliga dokument ska inte läsas in igen bara för att starta appen.

Mer detaljerade testresultat och nästa steg finns i [STATUS.md](STATUS.md).
