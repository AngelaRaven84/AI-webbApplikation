# PixelForge AI-assistent – status och plan

Senast uppdaterad: **28 oktober 2026**.

Det här är vår gemensamma plats för beslut, tankar, verifierad status och nästa steg. Bocka bara av arbete som faktiskt är gjort och ange vad som har testats. Planering är inte färdig funktionalitet.

## Nuläge – 28 oktober

- Jag har gått igenom centrala G- och VG-scenarier i webbchatten: produktfilter, produktföljdfrågor, inga träffar, support, supportföljdfrågor, saknat underlag, blandade frågor, dokumentlänkar och synliga kundvagnsåtgärder.
- Kundvagnens tillägg, ”en till”, borttagning 2 → 1 → 0, innehållsfråga utan ändring, otydligt val, precisering och avbrytande är manuellt testade. Väntande remove rensas efter avbrytande.
- Chatten har nu en mörk panel med lila accent, öppna/stänga, intern meddelandescroll, autoscroll och fokus tillbaka till input efter svar. Historiken bevaras när panelen döljs och när dokumentlänkar öppnas i samma flik.
- Koduppdelningen omfattar chatPrompt, formatProducts, handleCartIntent, getSupportReply och den lokala barnkomponenten ChatSources. Ingen ny parallell kundvagn eller extra npm-paket har skapats.
- Produktkategorier kan normaliseras med svenska alias. En begränsad kodregel säkerställer lagerkravet för frasen ”som finns i lager” utan orden ”inte”/”oavsett”; andra formuleringar och ärvda filter är fortfarande modellberoende.
- Supportfrågor skrivs om av rewriteSupportQuestion med tidigare kundfrågor som sammanhang. Själva supportsvaret får nya dokumentutdrag och frågan utan gamla assistentsvar.
- Blandfrågor skickar den utplockade supportdelen till getSupportReply. Produkttext och supporttext kombineras i getReply; ren support och följdfrågor behåller originalmeddelandet till omskrivningen.
- Jag har efter sista komponentflytten kört frontendens lint och build med godkänt resultat. Tidigare Vite-varning om chunk över 500 kB är känd. Agenten har separat kontrollerat berörda komponenter med ESLint och laddat backendmoduler utan modell-/databasanrop.
- README är skriven i jag-form med installation, arkitektur, tester, UI och kända begränsningar. Ursprunglig examinationsuppgift finns längst ner i denna statusfil.
- AI-svar kan fortfarande förenkla villkor och källistan kan innehålla svagt relevanta utdrag. Jag har valt att behålla detta inom projektets nuvarande omfattning; det är inte en garanti för alla frågor.
- Nästa steg är en avgränsad slutkontroll före inlämning. Ingen ny funktion eller större refaktorering är planerad.

## Beslut vi har tagit

### 1. Börja med frontend och en fungerande grundchatt

Vi följer Jespers rekommendation: få först upp en enkel chatt i webbshoppen och koppla den till ett minimalt backendflöde som ger ett riktigt modellsvar. Frontend skickar fråga och tidigare meddelanden så att följdfrågor går att prova direkt i gränssnittet. Därefter lägger vi till produktverktyg och dokumenthämtning.

Första milstolpen är alltså en fungerande chatt hela vägen genom frontend → backend → Ollama → frontend. RAG och tools behöver inte vara klara för att nå den.

### 2. AI-logik i backend

Frontend ansvarar för presentation, inmatning och konversationshistorik som skickas till backend. Backend ansvarar för modellkommunikation, verktyg och Supabase. Hemliga nycklar stannar i backend.

### 3. Separat dokumenthämtning, tillgänglig som ett tool

Vi bygger dokumenthämtningen som en egen del som går att prova separat. Ett tool, tills vidare kallat `searchSupport`, anropar den delen och returnerar relevanta dokumentutdrag med källmetadata. Chattmodellen använder resultatet för att formulera ett dokumentbaserat svar. Tillsammans utgör hämtningen och svaret RAG-flödet.

Produktverktyget, tills vidare kallat `searchProducts`, ligger bredvid och hämtar/filtrerar riktiga produkter från kursens produkt-API. Modellen får välja rätt verktyg och vid behov använda båda för samma fråga.

| Del | Ansvar |
| --- | --- |
| Chattgränssnitt | Visa meddelanden, ta emot frågor och visa vänteläge/fel. |
| Chattlogik i frontend | Hålla historik och skicka fråga + tidigare meddelanden via TanStack Query. |
| Chattflöde i backend | Ge modellen historik, utföra begärda verktygsanrop och generera slutsvar. |
| Produktfunktion + produkt-tool | Hämta, validera och filtrera produktdata från API:et. |
| Dokumentfunktion + support-tool | Söka relevanta chunks i Supabase och returnera text samt källmetadata. |
| PDF-seed | Förbereda dokument, metadata och embeddings inför sökning. Körs separat från vanliga chattfrågor. |

Historiskt beslut (ersatt i delar 26–27 oktober): vi började utan separat klassificeringsrouter. Nu används parseCartIntent och parseSupportIntent för kodstyrda flöden, med en allmän verktygsloop som reserv. Ursprungliga verktygsnamn är `search_products` och `search_support`, med funktionerna searchProducts och searchSupport bakom. Modellen väljer verktyg; backend utför dem.

Varför vi väljer detta:

- Produktdata och supportdokument får tydliga, separata ansvarsområden.
- Dokumenthämtningen kan verifieras innan den kopplas till modellens verktygsval.
- En fråga kan behöva både produktinformation och supportvillkor.
- Källmetadata från början gör det enklare att senare visa dokumentlänkar för VG.

Verifierat i Saras prov: Qwen väljer båda verktygen och formulerar en fristående supportfråga utifrån historiken. Ingen separat omskrivningskedja finns. Modellens val och svar är fortfarande inte garanterade; felaktiga kategorier, belopp och obestyrkta svar observerades under utvecklingen. Se pauspunkt 22 oktober för begränsningar.

### 4. Följ startkodens arkitektur

- Behåll root `src` för appstart och global CSS.
- Använd `base`, `shared`, `pages` och `core` efter ansvar och följ befintliga namngivna workspace-paket där de behövs.
- Använd TanStack Query för nya API-anrop i frontend, enligt Jespers förtydligande.
- Håll CSS nära sin komponent eller sida.
- Återanvänd befintlig kundvagnsstore när kundvagnsverktygen byggs.
- Sara skriver implementationskoden i små, förklarade och testbara steg. Vi tar ett steg i taget och inväntar hennes resultat.

## Krav att täcka

### G – grundfunktion

- [x] Chatten är integrerad i befintlig PixelForge-frontend och kommunicerar med en språkmodell.
- [x] Supportfrågor besvaras med RAG utifrån de tillhandahållna dokumenten.
- [x] Produktfrågor besvaras genom tools som använder kursens produkt-API.
- [x] Historik gör att relevanta följdfrågor fungerar för både produkter och support.
- [x] Lösningen använder React, Node.js/Express, LangChain.js, Ollama och Supabase.

Avbockningen ovan avser implementerat grundflöde och de manuella scenarier Sara verifierat. Den är inte en slutlig betygsbedömning eller en garanti för alla frågor. Slutkontroll och inlämningsdokumentation återstår.

### VG – tillägg efter fungerande G-flöde

Avbockningarna avser byggda delar och verifierade scenarier. De ersätter inte examinerande bedömning; begränsningar och slutkontroll finns i nuläget för 28 oktober.

- [x] Lägg till produkter genom chatten, även genom följdfrågor (testade scenarier).
- [x] Ta bort produkter genom chatten, även genom följdfrågor (testade scenarier; se begränsningar 27 oktober).
- [x] Kundvagnsändringar syns i webbshoppens befintliga kundvagn.
- [x] Dokumentbaserade svar länkar till rätt dokuments egen sida i PixelForge.
- [x] Kodens ansvar är uppdelat enligt startkodens struktur, granskat efter refaktorering 28 oktober. Slutlig helhetsbedömning görs vid examination.

## Arbetsplan – underlag till GitHub Project

Varje rad nedan kan senare bli ett kort eller en issue med en tydlig beskrivning och ett klart-kriterium. Förslag på kolumner: **Att göra → Pågår → Att verifiera → Klart**. Sara har skapat sitt GitHub Project-board utifrån punkterna här och använder separata brancher för delarna. Boardet är bekräftat av Sara, inte inspekterat av agenten.

| Ordning | Uppgift | Klart när |
| --- | --- | --- |
| 1 | Kartlägg startkod och kontrollera lokal start | Vi vet hur frontend/backend startas, var chatten ansluts och hur API/router/store hänger ihop. |
| 2 | Bygg chattens UI i frontend | Frågor kan skrivas och meddelanden visas, med öppna/stänga, vänteläge och felmeddelande. Global placering i hörnet är en rekommendation; exakt UI bestäms i detta steg. |
| 3 | Bygg chattlogik och anslut frontend till backend | Fråga och tidigare meddelanden skickas enligt ett tydligt kontrakt med TanStack Query. |
| 4 | Bygg minimalt modellsvar i backend | Ett riktigt Ollama-svar visas i frontend och en enkel följdfråga förstås. |
| 5 | Bygg produktfunktion och produkt-tool | API-data valideras/filtreras och modellen använder den för produktfrågor. Inga träffar och API-fel hanteras. |
| 6 | Förbered Supabase och indexera supportdokument | Embeddingmodell/dimensioner och databas matchar; PDF-chunks har metadata som kan kopplas till rätt supportsida. |
| 7 | Bygg dokumenthämtning separat | Relevanta chunks och källor returneras för en supportfråga; saknat underlag hanteras. |
| 8 | Koppla dokumenthämtningen till support-tool | Modellen väljer supportverktyget och ger ett svar grundat i hämtad dokumenttext. |
| 9 | Verifiera samlat G-flöde | Produktfrågor, supportfrågor, blandade frågor och följdfrågor fungerar från UI:t. |
| 10 | Visa dokumentlänkar i chatten (VG) | Källor öppnar rätt intern dokumentsida; länkar hittas inte på av modellen. |
| 11 | Koppla kundvagnsverktyg (VG) | Lägg till/ta bort samt följdfrågor uppdaterar befintlig store och synlig kundvagn med riktiga produkt-id:n. |
| 12 | Slutkontroll och README | Relevanta manuella scenarier, frontend-lint/build och tillgängliga relevanta backendkontroller är dokumenterade; installation/start/miljövariabler beskrivs utan hemligheter. |
| 13 | Förbered inlämning och Code Review | Repo-länk kan lämnas in och Sara kan demonstrera och förklara RAG, tools, historik och genomförda VG-delar. |

## Scenarier att använda när delarna finns

- Produktfråga med exempelvis kategori och maxpris; följdfråga som syftar på en tidigare produkt.
- Supportfråga om retur eller leverans; relevant följdfråga med historik.
- En fråga som behöver både produktdata och supportvillkor.
- Inga produktträffar respektive inget relevant dokumentunderlag: tydligt besked utan påhittad information.
- Fel från backend/modell/verktyg: begripligt fel och möjlighet att försöka igen.
- VG: rätt dokumentlänk samt lägga till/ta bort rätt produkt med synlig ändring i kundvagnen.

## Underlag och datum

- [Aktuell examinationsbeskrivning](https://github.com/fu-ai-webb25/exam-individuell/blob/main/README.md).
- [Frontendens lokala README](pixelforge-frontend/README.md).
- [Backendens lokala README](pixelforge-backend/README-backend.md).
- [Produkt-API](https://santosnr6.github.io/Data/pixelforgeproducts.json). Fälten id, name, brand, category, price och stock är använda och provade. Stock finns i API:et.
- Inspelning: `261021, Genomgång av examination.mp4` (21 oktober). Jesper rekommenderar frontend först och en fungerande grundchatt före påbyggnad. Val av RAG/tools-kombination är fritt.
- Jesper avser publicera ett ytterligare kodexempel för RAG + tools senast fredag morgon den 23 oktober. Publiceringen är inte verifierad här.
- **Skriftlig deadline: 29 oktober 2026 kl. 23:59.**
- **Examinerande Code Review: 30 oktober 2026**, personligt schema återstår att kontrollera.

## Tidigare verifiering – första dokumentationspasset

21 oktober: lokala instruktioner, README-filer, package.json, tom chat-route och Git-status kontrollerade. STATUS.md skapad som dokumentation. Ingen installation, seed, appstart, implementation, lint eller build utförd. Backendens befintliga testscript är en placeholder som avslutas med fel och utgör ingen fungerande testsvit.

## Historisk pauspunkt – 21 oktober 2026, frontendens grundchatt

Sara avslutar för dagen och vill fortsätta med backend nästa arbetspass. Ingen ytterligare implementation ska göras vid denna paus.

### Klart i koden

- `@pixelforge/chat` i `packages/shared/chat` renderas efter Footer i gemensam Layout och följer därmed sidornas gemensamma struktur.
- Formulär med label, input och Skicka-knapp. Submit hindrar sidomladdning, läser text med FormData och tömmer fältet.
- `@pixelforge/usechat` i `packages/core/hooks/usechat` håller meddelanden i React-state. Användarens text trimmas; tomma frågor ignoreras. Meddelanden har id, role och content.
- `sendChatMessage` i `packages/core/api/data/index.js` gör POST till `http://localhost:8080/api/chat` med `{ message, history }`.
- `useMutation` från TanStack Query anropar API-funktionen. Tidigare meddelandens role/content skickas som history; den aktuella frågan skickas separat som message.
- onSuccess är förberedd för att lägga till `{ role: 'assistant', content: data.content }` i meddelandelistan. Framgångsvägen har ännu inte körtestats mot backend.
- Hooken returnerar messages, sendMessage, isPending och error. Komponenten visar vänteläge med role="status" och fel med role="alert" samt inaktiverar input/knapp medan anropet väntar.
- sendMessage stoppar nya skickningar när isPending är sant. Detta är ett UI-skydd, inte testad backend-idempotens.

### Testat enligt Sara

Sara svarade klar efter respektive steg och bekräftade:

- Chattens hälsning visas i gemensam layout på startsida, produktsida och supportsida.
- Formuläret laddar inte om sidan vid Enter eller knapptryck.
- Två användarmeddelanden visas i ordning, input töms och enbart mellanslag skapar inget meddelande.
- Beteendet fungerar efter flytten till useChat och länkningen av workspace-paketet.
- Frontend-lint passerar efter API-funktionen, mutationen och vänteläge/felvisning.
- Med backend avstängd visas användarens fråga och därefter ett fel; input/knapp går att använda igen.

Agenten har läst aktuella sparade filer och verifierat att ovanstående delar finns i koden. Agenten har inte kört om lint eller manuella UI-tester vid dokumentationsuppdateringen. Ingen produktionsbuild har rapporterats idag. Ett längre vänteläge mot en svarande server är ännu inte testat separat.

### Kvar och inte verifierat

- POST-handlern i backend är fortfarande tom. Chatten har ännu inte fått ett riktigt assistentsvar.
- Frontend förväntar sig JSON med `{ content: 'svarets text' }`. Backend behöver uppfylla kontraktet och hantera fel/ogiltiga indata.
- En lyckad fråga följd av en historikberoende följdfråga ska provas genom frontend när backend fungerar.
- Öppna/stänga chatten, hörnplacering och styling återstår; nuvarande UI är ett enkelt synligt grundformulär. Arbetsplanens UI-kort är alltså inte helt färdigt.
- RAG, produkt-tools, dokumentlänkar och kundvagnsverktyg är fortfarande planerade.
- Anslutningsfel tömmer idag input men lämnar användarmeddelandet i historiken. Återförsök/drafthantering är inte implementerad; ta hänsyn till detta när historik och felbeteende provas.

### Board och Git

- Sara har skapat boardet och gått igenom startkodens struktur.
- Vid pausuppdateringen: branch `7-chattens-ui`, spårar `origin/7-chattens-ui`, fyra lokala commits före remote. Arbetsytan var ren före uppdateringen av denna fil.
- Agenten har endast uppdaterat STATUS.md i detta pass; ingen kod, commit, push eller boardändring utförd.

## Historisk pauspunkt – 22 oktober 2026, produkt-tools och RAG fungerar

Sara pausar för dagen. Nästa implementation tas i små steg nästa arbetspass.

### Implementerat och granskat i sparade filer

- `src/routes/chat.route.js` validerar message/history, anropar getReply och returnerar `{ content }`. Fel ger generellt HTTP 500-svar. Historiken accepterar user/assistant med textinnehåll.
- `src/ai/getReply.js` omvandlar historik till LangChain-meddelanden, använder systemprompt och binder två tools. `toolsByName` väljer rätt verktyg, varje ToolCall skickas till verktygets invoke och resultaten läggs till innan slutsvaret.
- **Faktisk körstruktur vid pausen:** en verktygsrunda med en for-loop över samtliga anrop i samma modellsvar, därefter `llm.invoke(messages)` utan tools. Två efterföljande verktygsrundor diskuterades men finns inte i den sparade filen. Blandtestet bevisar två verktyg i samma runda, inte sekventiellt beroende anrop.
- `src/tools/products/fetchProducts.js` hämtar kursens API, kontrollerar HTTP-status och att svaret är en array. Enskilda produktobjekt valideras inte fullständigt.
- `searchProducts.js` filtrerar med delsträng i namn/märke/kategori, högsta pris (inklusive gränsen) och valfri stock > 0. Ingen separat sortering eller begränsning av antal resultat finns.
- `searchProductsTool.js` definierar `search_products` med Zod-schema. Beskrivningen förtydligar engelska kategorier och prisbelopp i SEK. Resultatet begränsas till id, name, brand, category, price och stock för att minska obestyrkta tillägg.
- `scripts/inspectDocuments.js` används för lokal PDF-inläsning/chunkinspektion utan Supabase. Chunks har source och documentId från filnamnet.
- `scripts/seed.js` sparar också source och documentId, delar med chunkSize 1000/chunkOverlap 200 och lagrar embeddings i documents. Scriptet lägger till rader utan automatisk dubblettkontroll; kör inte om det slentrianmässigt.
- `src/ai/searchSupport.js` använder SupabaseVectorStore och similaritySearch(query, 4), utan poängtröskel eller separat relevanskontroll.
- `src/tools/support/searchSupportTool.js` definierar `search_support` med en fristående query och returnerar JSON med text, documentId och source.
- Systemprompten skiljer saknad information från uttryckligt nej, begär dokumentgrundade svar och förbjuder obestyrkta villkor. Detta är instruktioner till modellen, inte deterministisk svarskontroll.

### Verifierat av Sara under dagen

- Backendens npm-installation, konfiguration och grundchatt. Modellen minns namnet Sara i en följdfråga.
- Ollama startade manuellt med `ollama serve` efter timeout; server och RTX 4050 upptäcktes. Avstängd Ollama gav frontendfel; efter omstart fungerade en ny fråga utan omstart av backend.
- Produktfunktion och tool provade direkt: Keyboards, maxpris 1500, i lager → Alloy Origins Core TKL, 999 kr, 32 i lager. Okänd söktext → tom lista.
- Modellen begärde ett riktigt search_products-anrop. Möss under 800 → DeathAdder V3 HyperSpeed, 699 kr, 31 i lager. Kategoribyte mellan tangentbord och möss i samma samtal gav rätt argument och svar efter förtydliganden.
- För låg tangentbordsbudget gav tydligt besked om inga träffar.
- Lokal embedding skapades och hade 1024 värden. Supabase-anslutning kontrollerades mot tom documents-tabell innan seed. Seed avslutades med ”Alla dokument har lagrats i supabase”.
- SQL-utskrift verifierade text, source, documentId och dimension 1024 i två lagrade rader.
- Fel PGRST202 felsöktes: match_documents saknades. Funktionen skapades i public, cacheuppdatering begärdes och parametrarna query_embedding, match_count och filter verifierades med SQL. Därefter fungerade sökningen.
- Svensk fraktfråga gav relevant doc-001-utdrag med 69 SEK under 1500 SEK och fri standardfrakt från 1500 SEK.
- Support-tool provades direkt och sedan via webbchatten; riktig search_support-logg och dokumentbaserat fraktsvar visades.
- Följdfrågan om exakt 1500 kr gav ny fristående supportsökning och rätt gränsvärde.
- Kombinerad fråga gav search_products och search_support i samma runda samt rätt produkt- och fraktuppgifter i senaste provet.
- Fråga om livstids fri studentfrakt gav först för säkert nej. Efter promptförtydligande och ny chatt blev svaret: ”Jag hittar ingen information om livstids fri frakt för studenter i underlaget.”
- Frontendens `npm run lint` och `npm run build` passerade enligt Sara efter produktdelen och åter efter RAG-delens sista ändring.

Agenten har granskat sparade filer vid pausuppdateringen, men har inte kört om frontend-lint/build, modellsvar, seed eller databassökning. Databasens SQL och innehåll är verifierade genom Saras delade resultat, inte en ny direkt databasinspektion. Backendens befintliga testscript är fortfarande en placeholder; ingen fullständig automatisk backendtestsvit är verifierad.

### Kvarvarande begränsningar och punkter att ta med framåt

- Riktiga VG-dokumentlänkar återstår. Modellen har ibland skrivit en PDF-länk med bara filnamnet; detta räknas inte som länk till dokumentets egen sida i PixelForge. Mappa documentId mot verkliga frontenddokument/routes i kod och rendera betrodda länkar i React.
- API-svaret till frontend är fortfarande bara `{ content }`; strukturerade källor skickas inte separat. UI visar message.content i en p-tagg; Markdown-formatering/länkar renderas inte som sådan.
- Kundvagnsverktyg för lägga till/ta bort, följdfrågor och synlig uppdatering återstår helt.
- Öppna/stänga, hörnplacering och chattstyling återstår. Kortet för hela UI:t bör inte markeras helt klart ännu.
- Modellen har tidigare hoppat över verktyg, tolkat möss som hats, skickat 80 i stället för 800 och hittat på rabattbelopp. Bättre beskrivningar, smalare resultat och promptregler förbättrade de verifierade fallen; detta är inga garantier. Felaktiga gamla assistentsvar kan påverka fortsatta svar via historiken.
- Språkputs återstår (exempelvis brand som ”Marknad”); belopp och villkorsgränser behöver fortsatt hållas exakta. Frakt beror på hela beställningens kvalificerande produktvärde, inte bara priset på en föreslagen produkt.
- Fyra närmaste chunks kan innehålla mindre relevanta träffar även när information saknas. Ingen generell relevanströskel eller svarsfaktakontroll finns. Saknad-info-provet gäller det verifierade studentscenariot.
- Flera sekventiella verktygsrundor, verktygs-/Supabasefel och routens negativa indatatester är inte verifierade. Grundmodellens avstängning/återhämtning är provad.
- Seed-importen är vid granskningen skriven `@langchain/textSplitters` (stort S); paketnamnet är `@langchain/textsplitters`. Seed fungerade enligt Sara på Windows, men stavningen bör rättas i ett senare kodsteg för portabilitet. Ingen ändring gjordes vid pausen.
- README/startinstruktioner och miljövariabelexempel behöver slutlig genomgång. Exakta interna dokument-id/routes återstår att jämföra innan länkar byggs. Jespers kompletterande exempel/publicering har inte kontrollerats.

### Underlag till Saras boarduppdatering

- Grundchatt/backend/historik: implementerat och manuellt provat.
- Produktfunktion och produkt-tool: implementerat och kärnscenarier provade; separat produkt-API-feltest återstår om kortets klart-kriterium omfattar det.
- PDF-inläsning, chunkning, Supabase-konfiguration och seed: genomfört; totalt databasradantal återstår att kontrollera vid behov, utan omseed.
- Dokumenthämtning och support-tool i chatten: implementerat och manuellt provat.
- Samlat G-grundflöde: angivna manuella scenarier genomförda; slutlig inlämningskontroll återstår.
- Dokumentlänkar (VG), kundvagn (VG), kvarvarande UI och slutdokumentation: att göra.

### Git och omfattning av pausuppdateringen

Vid kontrollen: branch `12-dokumenthämtning`, spårar `origin/12-dokumenthämtning`, ren arbetsyta före denna uppdatering. Historiska branchuppgifter ovan avser 21 oktober. Endast STATUS.md uppdateras av agenten; Sara sköter GitHub, commits/push och Project-board själv.

## Historisk pauspunkt – 23 oktober 2026, dokumentlänkar klara och kundvagn pågår

Sara pausar för dagen och vill återuppta med ett tydligt litet steg imorgon. Ingen ytterligare implementationskod ändras vid denna paus. Historiska avsnitt ovan beskriver tidigare lägen; detta avsnitt gäller nu.

### Arkitekturbeslut och jämförelse med Jespers exempel

- Jespers exempel `week-43-lecture-23-okt` lästes vid revision f1423e2ae1d2373a51c62a6e0ee0507817ad1eff. Det använder en modellrouter som väljer rag eller tools, separat standalone-question-kedja och separata promptfiler.
- Vi behåller vår gemensamma verktygsväg: search_products och search_support, med kundvagnsverktyg bredvid. Sara vill inspireras av uppdelningen av prompter/ansvar. Prompten ligger ännu i getReply.js; utflyttning till egen fil är planerad, inte gjord.
- Läs alltid aktuell kod före nästa kodinstruktion och återanvänd befintliga funktioner. Ingen ny fetchDocuments behövdes i backend: frontend har redan API-hämtningen för id/title/slug, backend har RAG-sökningen i Supabase.

### Dokumentlänkar – implementerat och verifierat av Sara

- getReply samlar unika documentId från verkliga supportverktygsresultat i ett Set, separat från modellens fritext. sources innehåller dokument-id:n som strängar.
- API-svaret har content och sources direkt på översta nivån; routen använder res.json(reply), inte res.json({ reply }). Nu finns också cartActions, se nedan.
- useChat sparar sources på assistentmeddelandet, med tom lista som standard.
- Chat återanvänder fetchDocuments med TanStack Query, queryKey ['documents'], aktiverad när meddelanden har källor. Ingen extra backendhämtning infördes.
- Länkar renderas med React Routers Link: matcha source-id mot dokumentets id, använd title som text och /support/ + encodeURIComponent(slug) som destination.
- Verifierad koppling: doc-001 → shipping-information → Shipping Information. Sara klickade länkar och fick rätt supportsida med chatten kvar.
- Rubriken är ”Hämtade underlag”: alla hämtade dokument visas, inte bara dokument som bevisligen användes i slutsvaret. Fyra träffar kan inkludera mindre relevanta dokument.
- Frontend-lint och build passerade enligt Sara efter denna del. Ett JSX-fel rättades: messages.map behöver returnera JSX via parenteser eller explicit return.
- Modelltext visas fortfarande i p-tagg; Markdown i fritexten renderas inte. Dokumentlänkarna fungerar som separata React-element och är inte beroende av modellens egna URL:er.

### Kundvagn – vad som finns nu

- Befintlig Zustand-store används. addToCart(product) ökar ett exemplar; removeFromCart(productId) minskar ett och tar bort raden när qty blir noll. Ingen ny parallell kundvagn har skapats.
- useChat läser useCartStore.getState().cart vid varje skickning och skickar productId, name och qty till backend. Backend validerar listans format och positiva heltalsantal och för den till getReply.
- Aktuell kundvagn läggs som ett datameddelande EFTER tidigare historik och före senaste frågan. Placeringen och regeln om att [] betyder tom kundvagn förbättrade det tidigare felaktiga svaret från gammal historik.
- Sara verifierade att en produkt nämns, att tömd kundvagn beskrivs som tom och att en ny produkt efteråt syns i svaret, i samma samtal.
- `src/tools/cart/createAddToCartAction.js` hämtar produkter från befintliga fetchProducts och matchar produktnamnet exakt efter trim/lowercase. Noll träffar och flera träffar stoppas, liksom stock < 1. Det riktiga id:t, priset och hela produktobjektet hämtas från API:et.
- Funktionen tar numera productName, inte productId. Orsak: modellen hittade på id:n som HB-1024 och KB-HX-ORIG-01. Dessa stoppades korrekt av API-kontrollen men gav generellt 500-fel till UI.
- `src/tools/cart/addToCartTool.js` definierar add_to_cart med productName i Zod-schema. Returnerar JSON med status: prepared och action: { type: add_to_cart, product }.
- getReply registrerar verktyget och samlar dess kontrollerade åtgärd i cartActions. Slutligt API-kontrakt: { content, sources, cartActions }.
- Frontendens useChat.onSuccess utför varje add_to_cart i cartActions via befintlig stores addToCart(action.product), före meddelandet läggs till. Det görs inte vid rendering av gamla meddelanden.
- getReply har nu högst TVÅ verktygsrundor. Efter första rundan anropas modelWithTools igen; efter andra används llm utan tools för slutsvar. Detta finns nu i sparad kod, till skillnad från pauspunkten 22 oktober. Sekventiell sökning → tillägg i samma request har inte visats i lyckad testlogg; tillägget lyckades direkt med produktnamn efter tidigare produktfråga.
- Routen loggar nu verkliga fel med console.error('Chatfel:', error), men returnerar fortfarande generellt 500-meddelande till UI.

### Testat och kvarvarande fel

Verifierat av Sara:

- Direkt produktuppslag med productName: Alloy Origins Core TKL → add_to_cart, pf-063, rätt produkt.
- addToCartTool direkt → prepared-action med rätt produkt.
- Chattens produktsökning → följdfrågan ”Lägg till det tangentbordet i kundvagnen” gav add_to_cart med productName: Alloy Origins Core TKL.
- API-svaret innehöll en add_to_cart-action med pf-063 och frontend visade ett rätt tangentbord i webbshoppens kundvagn. Detta bevisar ett första tillägg hela vägen, inte samtliga mängd-/följdfrågefall.
- Frontend-lint rapporterades godkänd under kundvagnsförberedelsen. Ingen slutlig lint/build efter alla kundvagnsändringar har rapporterats; senaste godkända build avser dokumentlänksdelen.

**Aktivt fel vid paus:** ”Lägg till ett exemplar till av samma tangentbord” ger ett textsvar som påstår att tillägget sker men inget add_to_cart-anrop och ingen ändring i kundvagnen. Extra promptregler finns sparade men löste inte problemet. Inget godkänt 1 → 2-test ännu. Gör inte fler liknande prompttillägg utan att kontrollera faktisk verktygs-/åtgärdskedja.

### Föreslaget nästa spår – INTE implementerat

- Agenten föreslog `src/ai/parseCartIntent.js`: separat strukturerad tolkning med action: add | none | clarify och productName: string | null.
- **Filen finns inte vid pauskontrollen. Inget direktprov eller integration är gjort.** Förslaget är ett experiment för kundvagnsföljdfrågor, inte ett verifierat byte av arkitektur eller en färdig garanti.
- Tanken är att skilja modellens tolkning från kodens exekvering: om en tydlig tilläggsbegäran identifierats och produktkontrollen lyckas ska kod anropa befintligt verktyg. Ett vanligt modellsvar ska inte kunna ersätta en kundvagnsåtgärd.
- Strukturerat svar garanterar format, inte korrekt förståelse eller användaravsikt. Prova först separat med en tilläggsbegäran, en fråga utan ändringsbegäran och ett oklart val mellan flera produkter innan något kopplas in.
- Tänk igenom integrationen före aktivering: samma begäran får inte utföras både via separat tolkning och via den befintliga toollopen. Bekräftelse i UI bör bygga på utförd store-ändring, inte enbart modelltext.

### Återstår efter det aktiva felet

- Stabilt öka samma produkt från 1 till 2 via naturlig följdfråga; säkerställ även att produktfrågor inte ändrar kundvagnen.
- Ta bort via chatt med aktuell kundvagn som grund, inklusive antal och följdfrågor. Inget remove-tool är byggt.
- Hantera förväntade fel (saknad/oklar/slut produkt) begripligt utan att hela anropet bara blir ett generellt modellfel.
- Lagerkontrollen gäller idag stock > 0, inte sammanlagt antal i befintlig kundvagn. Inga idempotensnycklar eller skydd mot upprepade likadana cartActions finns. Två modellrundor kan därför också behöva skydd mot oavsiktlig dubbel åtgärd.
- Fullständig validering av produktfält saknas; ett större verktygsschema ersätter inte API-/affärskontroller.
- UI, språk/Markdown, promptuppdelning och inlämningsdokumentation återstår enligt planen. Slutlig frontend-lint/build och relevanta backendkontroller görs efter nästa stabila ändring.

### Git och verifieringsgräns för pausuppdateringen

- Dokumentlänksarbetet råkade först ligga på den gamla lokala 12-dokumenthämtning efter att PR:n mergats. Det räddades till feature/dokumentlankar från origin/dev med tre cherry-pickade commits; identiskt filinnehåll verifierades. Sara uppgav därefter att det publicerats/mergats till dev och att hon bytt till kundvagnsbranch.
- Aktuell branch vid pauskontroll: `15-koppla-kundvagn`, spårar `origin/15-koppla-kundvagn`. Arbetsytan var ren före denna STATUS-uppdatering.
- Agenten har läst aktuella sparade filer men inte kört om UI/modelltester, lint eller build. Manuella resultat ovan kommer från Saras tester och loggar. Endast STATUS.md ändras vid denna paus; inga commits, pushar eller boardändringar görs.

## Historisk pauspunkt – måndag 26 oktober 2026, tillägg fungerar och borttagning förberedd

Sara avslutar för dagen och vill fortsätta tisdag 27 oktober. Ingen ytterligare implementationskod ändras vid denna paus. Detta avsnitt och Nuläge gäller framför historiska felbeskrivningar från 23 oktober.

### Dagens ändrade flöde

- `src/ai/parseCartIntent.js` är nu byggd och inkopplad i början av getReply. Det tidigare förslaget från fredag är alltså inte längre bara planerat.
- Kundvagnsändringar går en separat kodväg. getReply binder endast searchProductsTool och searchSupportTool till den allmänna chattmodellen. addToCartTool anropas direkt av kod vid intent.action === add och kan därför inte dessutom köras i den vanliga toollopen.
- Vid add kontrollerar befintligt tool produktnamnet mot produkt-API:et och returnerar prepared-action. getReply returnerar { content, sources: [], cartActions: [action] }. Frontend utför via useCartStore i onSuccess.
- API-fältet är cartActions (plural). Felstavningen cartAction rättades; annars ignorerade frontend åtgärdslistan.
- Systemprompten i getReply har nu tydliga avsnitt för produkter, support, aktuell kundvagn och underlag/historik. Gamla instruktioner om att den allmänna modellen ska anropa add_to_cart är borttagna. Prompten ligger fortfarande i getReply.js, inte separat fil.
- Bekräftelsetext från backend säger att tillägget är förberett. Separat UI-bekräftelse grundad i utförd storeändring är fortfarande inte byggd.

### Varför tvåstegstolkning behövdes

- Första versionen tolkade senaste fråga, historik och cart tillsammans. Den svarade ibland clarify/none även vid explicit produktnamn. Promptförtydligande med exempel förbättrade add-tolkningen.
- Ett kritiskt motprov visade sedan att ”Vad ligger i min kundvagn?” med gamla tillägg i historiken felklassificerades och faktiskt lade till ytterligare ett tangentbord.
- Därför kör parseCartIntent nu först actionModel med ENDAST senaste message: klassificera add/remove/none, utan historiken. none returnerar direkt { action: none, productName: null }.
- Endast vid ändringsbegäran körs intentModel med message, cart och history för att identifiera produktnamn och eventuellt clarify.
- Första schemas action är nu add/remove/none; det andra har add/remove/none/clarify. Produktvalets andra modellreturn kan fortfarande innehålla en annan action än första beslutet: koden låser ännu inte operationen till första stegets beslut. Detta är en kvarvarande gräns att känna till, inte en garanti för alla formuleringar.
- All tolkning är fortfarande modellbaserad. Strukturerat format är inte bevis på korrekt användaravsikt. Bevara de negativa testen vid framtida ändringar.

### Verifierat av Sara idag

- Direkt tolkning: ”Lägg till ett exemplar till av samma tangentbord” med en entydig kundvagn → add och Alloy Origins Core TKL.
- Direkt tolkning: ”Vad ligger i min kundvagn?” och ”Lägg inte till något” → none/null i första isolerade provet.
- Explicit tillägg med tom cart/history → add och Alloy Origins Core TKL efter promptförtydligandet.
- Webbchatt: explicit första tillägg och följdfrågan om ett exemplar till gav båda add med rätt namn. Sara såg två tangentbord på samma produktrad, alltså 1 → 2.
- Efter att tvåstegstolkningen införts: isolerat innehållsfrågeprov med gammalt tillägg i history → none/null.
- Därefter i samma webbchatt: innehållsfrågan beskrev kundvagnen, terminal visade none och antalet ändrades inte.
- ”Lägg inte till något” gav none, ingen ändring och ett svar om innehållet. Beteendet är verifierat; exakt formulering kan putsas senare.
- Dagens borttagningsfunktion och tool direktprovades enligt Saras klar. Direkt tolkning: ”Ta bort ett av tangentborden” → remove och Alloy Origins Core TKL; ”Ta inte bort något” → none/null.

Agenten har läst aktuella filer vid pausen men inte kört om modellanrop, manuella UI-tester, lint eller build. Ingen ny slutlig frontend-lint/build eller komplett regression efter dagens ändringar har rapporterats. Äldre godkända kontroller gäller respektive tidigare kodläge.

### Borttagning – exakt sparat läge vid pausen

Byggt och granskat:

- `src/tools/cart/createRemoveFromCartAction.js`: matchar produktnamn exakt efter trim/lowercase i aktuell cart, stoppar noll eller flera matchningar och returnerar { type: remove_from_cart, productId, name }.
- Borttagningen använder cart-radens riktiga produktId; inget produkt-API behövs för att ta bort en produkt som redan ligger i vagnen.
- `src/tools/cart/removeFromCartTool.js`: exporterar createRemoveFromCartTool(cart), en factory för requestens aktuella kundvagn. Verktygets productName kommer från tolkningen; cart hämtas inte från modellargument/global backendstate. Returnerar JSON med status: prepared och action.
- parseCartIntent har utökats för remove enligt ovan. Direktprov av remove och dess nekande lyckades.

**Ännu INTE inkopplat i sparad kod:**

- getReply importerar createRemoveFromCartTool men har ingen if (intent.action === remove)-gren som utför det eller returnerar en remove-action.
- Kontroll för saknat produktnamn gäller bara add; den behöver omfatta både add och remove.
- Förtydligandetexten är fortfarande ”Vilken produkt vill du lägga till”; byt till exempelvis ”Vilken produkt menar du?” så det passar båda operationerna.
- Frontendens useChat.onSuccess hanterar bara add_to_cart, inte remove_from_cart.
- Sista instruktionen i chatten beskrev dessa tre kopplingar, men de finns inte i sparade filer vid paus. Sara har inte rapporterat något webbtest av borttagning. Återanvänd befintliga removeFromCart(productId) i storen: den minskar ETT exemplar och tar bort raden vid noll.

### Första steg vid återstart

Koppla borttagningen utan att ändra produkt-/supportverktygen:

1. Utöka namnkontrollen i getReply till add/remove och gör förtydligandefrågan generell.
2. Lägg en remove-gren efter add-grenen: skapa tool med aktuell cart, invoke({ productName }), JSON.parse(result), validera status/type/productId och returnera { content, sources: [], cartActions: [prepared.action] }. Ingen ny kundvagnsstore.
3. Lägg else if (action.type === remove_from_cart) i frontendens åtgärdsloop och anropa useCartStore.getState().removeFromCart(action.productId).
4. Verifiera i samma webbchatt med två tangentbord: ”Ta bort ett av tangentborden” → 2 till 1; ”Ta bort ett exemplar till av samma tangentbord” → 1 till 0 och raden försvinner; fråga innehåll → tom cart utan ändring. Negativt prov ”Ta inte bort något” ska ge none och oförändrad cart.

Gör ett litet kodsteg i taget och kontrollera filerna före instruktioner så att samma kod inte byggs igen.

### Återstår efter borttagningskopplingen

- Både add/remove inklusive relevanta följdfrågor och nekanden behöver en samlad kontroll efter integrationen. Testa oklart produktval utan att välja godtyckligt.
- Förväntade fel (produkten saknas i cart/sortiment, flera namnträffar, slut i lager) leder fortfarande till generellt 500 via routens catch. Begripligt fel-/förtydligandeflöde återstår.
- Första actionModel täcker bara add/remove/none, inte mer omfattande kombinerade operationer. Flera produkter/antal eller ”ta bort allt” är inte implementerade som särskilda operationer; våra actions gäller ett exemplar per request.
- Lagerkontroll tar inte hänsyn till befintligt cart-antal; replay/idempotensskydd och fullständiga produktfältkontroller är inte byggda. Detta ska inte beskrivas som verifierat.
- Regressionsprov av vanlig produktfråga samt RAG-svar med klickbar dokumentlänk behövs efter kundvagnsändringarna, följt av frontend-lint/build och relevanta backendkontroller.
- UI/styling/öppna-stänga, språk/Markdown, eventuell separat promptfil och slutlig README/inlämningsförberedelse återstår. Dokumentlänkarna är tidigare verifierade; inga ändringar gjorda i dem i detta pauspass.

### Git och pausens omfattning

Kontrollerat 26 oktober: branch `15-koppla-kundvagn`, spårar `origin/15-koppla-kundvagn`, ren arbetsyta före denna dokumentationsuppdatering. Endast STATUS.md uppdateras av agenten. Ingen implementation, commit, push eller boardändring görs vid pausen. Sara återupptar arbetet 27 oktober.

## Historisk pauspunkt – tisdag 27 oktober 2026

Detta avsnitt och Nuläge ovan gäller framför äldre pausbeskrivningar. Sara vill fortsätta onsdag 28 oktober; funktionalitet och slutkontroller kommer före design.

### Genomfört idag

- Kopplat removeFromCartTool hela vägen genom getReply och cartActions till befintlig Zustand-store. Ett exemplar minskas per åtgärd och raden tas bort vid noll.
- Åtgärderna add/remove går separat från den allmänna modellens verktygsloop. Produktnamn kontrolleras mot API eller aktuell kundvagn; verkliga produkt-id:n används av frontend.
- Efter regressioner med påhittade supportvillkor och produkter infördes explicit strukturerad behovstolkning i parseSupportIntent: needsSupport/query, needsProducts/productQuery, maxPrice och inStockOnly. Den används för kodstyrd hämtning av underlag.
- Ren produktfråga hämtas via befintligt searchProductsTool och visas med namn, märke, pris och lager direkt från resultatet. Detta ersätter modellens fria produktsammanställning i den grenen.
- Ren supportfråga hämtar searchSupportTool före llm-svaret, med source-id:n separat från modelltexten.
- Blandade produkt-/supportfrågor rättades: produktgrenen körs före supportgrenen och returnerar bara direkt när support inte behövs. Vid båda behoven kombineras productContent med supportsvaret och dokumentkällor.
- Supportmodellens senaste fråga begränsas till den fristående supportfrågan; den ska inte försöka hitta produkter i dokumentutdragen.
- parseCartIntent begränsar modellens borttagningsval till id:n i aktuell kundvagn. Detta räckte inte för att förhindra godtyckliga val mellan flera produkter; därför kräver flerproduktsfallet ett entydigt fullständigt produktnamn i meddelandet.
- Förtydligandeflöde för remove: parseCartIntent returnerar pendingAction: remove internt; getReply skickar pendingCartAction: remove externt. useChat sparar värdet och API-funktionen skickar det med nästa begäran. Routen validerar null/remove och för det vidare.
- Vid väntande remove matchas ett svar med bara exakt produktnamn mot aktuell cart innan modellklassificering. En enda match ger remove. Andra meddelanden går vidare till befintlig tolkning.
- Frontend sätter pendingCartAction till svarsvärdet eller null vid onSuccess. Payload för själva avbrytandet kan därför fortfarande ha remove; först nästa anrop visar att vänteläget rensats.
- Skrivfel i content/response och sammanfogningen av dokumenttext rättades. Syntaxkontroll av sparad getReply.js passerade.

### Manuellt verifierat av Sara

- Tangentbordssökning → tillägg → ”en till” → borttagning → ”ta bort ett till” → tom kundvagn; synligt innehåll följde varje åtgärd.
- Fraktfråga återgav 69 kr med klickbara dokumentlänkar efter tidigare regression där ingen dokumentsökning gjordes.
- Headsetsökningen listade riktiga API-produkter. G Pro X 2 Lightspeed lades till med rätt produkt och togs bort efter produktidentifiering.
- Två olika headset + otydlig borttagning gav clarify, följdfråga och ingen ändring.
- Efter pendingCartAction-kopplingen räckte exakt produktnamn som svar på preciseringen för rätt borttagning på första försöket.
- ”Nej, ta inte bort något” ändrade inget och bekräftades i chatten. Nästa anrops payload visade att pendingCartAction rensats.
- Blandfrågan om tangentbord under 1 500 kr i lager samt standardfrakt gav Alloy Origins Core TKL, HyperX, 999 kr, 32 i lager samt 69 SEK och dokumentlänkar.
- Direkt följdfråga om gratisfrakt vid exakt 1 500 kr efter rabatter gav ja.

Detta är verifierade scenarier, inte garanti för alla formuleringar. Ingen ny fullständig G/VG-genomgång genomförd efter sista ändringen.

### Kända begränsningar och dokumentationsrättelse

- Fraktens gränsvärde formulerades fel i blandfrågans svar: ”över 1 500” trots inkluderande gräns i underlaget. En korrekt följdfråga löser inte ursprungstextens fel.
- Flera produkter i cart kräver idag fullständigt produktnamn vid borttagning; naturliga kortnamn som ”Logitech-headsetet” är då inte generellt lösta.
- Väntande precisering implementeras för remove, inte generellt för add. Felaktigt/okänt svar hanteras inte som en fullständig dialogmaskin.
- Alla hämtade dokument-id:n länkas, inte en verifierad lista över bara källor som bidragit till svaret.
- getReply.js samlar många ansvar och den långa systemprompten ligger kvar där. Planerad mindre uppdelning är inte gjord.
- Förväntade produkt-/kundvagnsfel kan fortfarande ge generellt HTTP 500. Antal/flera produkter per request, lager relativt cart-antal, full produktvalidering och idempotens är inte generellt implementerade.
- Backendens README finns som pixelforge-backend/README-backend.md. Tidigare påstående att backenddokumentation saknas var fel. Rotens README länkar till README.md i backend, vilket behöver rättas; backendtexten beskriver fortfarande startkod och gamla modellexempel.
- Design, öppna/stänga och språk/Markdown-puts är inte färdiga och har uttryckligen skjutits till nästa arbetspass.

### Kravgranskning och verifieringsgränser

- G-grundens tekniker och dataflöden finns; följdfrågor och saknat underlag har testats under arbetet. En samlad kontroll av slutläget återstår.
- VG-kundvagnens centrala flöden och interna dokumentlänkar har manuellt verifierats. Modulär struktur har god grund men behöver putsas; källrelevans och namnhantering har begränsningar ovan.
- Frontend-ESLint passerade vid agentens kontroll idag. Node --check av slutlig getReply.js passerade. Ingen produktionsbuild, ny seed, automatisk testsvit eller full live-regression kördes av agenten.
- Agenten gör endast denna dokumentationsändring vid pausen. Sara hanterar GitHub och Project-board själv. Git-status kontrolleras separat före ändringen.

## Lägesnotering – onsdag 28 oktober 2026, inför slutkontroll

Detta avsnitt och Nuläge gäller framför äldre pausbeskrivningar. Här skiljer jag på vad jag har testat manuellt, vad agenten kontrollerat och vad som fortfarande återstår.

### Koduppdelning

- Systemprompten är flyttad till src/ai/prompts/chatPrompt.js. getReply bygger fortfarande meddelandelistan.
- formatProducts.js ansvarar för produkttext. Produkt och tom lista har direktprovats av agenten.
- handleCartIntent.js hanterar clarify/add/remove och returnerar null när vanliga chatten ska fortsätta. Befintliga verktyg och Zustand-store återanvänds.
- getSupportReply.js ansvarar för fristående supportfråga, dokumenthämtning, unika käll-id:n och supportsvaret.
- Efter flytten upptäckte jag att en blandad fråga kunde skickas oförändrad till supportsökningen och ge saknat svar. getReply skickar nu supportIntent.query vid blandade frågor, originalmeddelandet vid rena supportfrågor. Blandfrågan gav därefter rätt tangentbord, 69 kr och gratis standardfrakt vid 1 500 kr eller mer.
- ChatSources är en lokal barnkomponent under shared/chat/children/chatsources med ui/index.jsx och en exportfil. Chat äger fortfarande dokumenthämtningen, så befintlig cache och autoscroll behålls.
- Den tidigare felstavade paketimporten i scripts/seed.js är rättad till @langchain/textsplitters. Ingen ny seed kördes och ingen fullständig nyinstallation har verifierats.
- parseSupportIntent heter fortfarande så trots att den också tolkar produktbehov. Den allmänna verktygsloopen är kvar. Det finns kvarvarande överlapp i klassificering/omskrivning; en större arkitekturändring har medvetet skjutits upp.

### Produkt- och supportkontroller

- Produkt utan träffar: tangentbord under 100 kr → tydligt tomt resultat.
- Produktföljdfråga: tangentbord under 1 500 kr i lager → möss under 800 kr. Slutliga loggar visade Keyboards/1500/true med pf-063 och Mice/800/true med pf-012.
- Svenska ”möss” gav först tomt resultat. Sökfunktionen har nu en kontrollerad mappning för svenska kategoriord till API-kategorier.
- Modellen tappade uttryckligt lagerkrav även efter promptändring. En kodregel infördes för just den tydliga frasen ovan; isolerat prov med simulerat modellresultat och mitt webbtest passerade.
- Kundvagnsfråga felklassificerades först som produktsökning med null söktext. Efter promptavgränsning besvarades tom och fylld kundvagn korrekt utan åtgärd. Klassificeringen är fortfarande modellberoende.
- Returfråga + ”Vem betalar frakten då?” tappade sammanhang. Separat rewriteSupportQuestion gav sedan fråga om returfrakt.
- ”Gäller det även om varan är trasig?” gav efter ändringen en fristående fråga om returfrakt för trasig vara och ett svar om accepterad reklamation med returdokument.
- Jag jämförde med Return Policy och noterade villkor om rimliga kostnader och stora/tunga produkter. Svaren kan utelämna sådana nyanser; jag har accepterat det som känd begränsning, inte som fullständigt precist stöd för alla villkor.
- Saknat underlag: livstids fri frakt för studenter → ”Jag hittar ingen information om det i underlaget.” Inget påhittat erbjudande eller säkert nej.
- Frakt: 69 kr under 1 500 kr och fri standardfrakt vid 1 500 kr eller mer återgavs korrekt i senare tester, även efter supportflytten. Historiskt fel ”över 1 500” finns dokumenterat; dagens rätta svar är inte en generell garanti.
- Jag har verifierat klickbara dokumentlänkar till rätt supportsida i samma flik med chatthistoriken kvar.

### VG-kundvagn – manuellt testat

- DeathAdder V3 HyperSpeed lades till efter produktsökning. ”En till” gav två exemplar i synlig cart.
- ”Ta bort en av mössen” och ”Ta bort den sista också” minskade 2 → 1 → 0.
- Innehållsfråga gav aktuell cart utan att gamla historiska åtgärder kördes igen.
- Två olika produkter + otydlig borttagning gav följdfråga och ingen godtycklig borttagning. Exakt namn slutförde rätt åtgärd.
- Avbrytande lämnade produkterna kvar och nästa request hade pendingCartAction: null.
- Routen för nu pendingCartAction vidare till getReply efter att en saknad vidarebefordran upptäckts.

### UI och UX – implementerat och provat

- Panel nere till höger med PixelForges befintliga färgvariabler, mörka ytor och lila accent.
- Nestad CSS i komponentens ordning med BEM-klasser: header → meddelanden/källor → status/fel → formulär.
- Öppningsknapp och stängkryss. Panelen döljs med hidden medan komponenten och useChat finns kvar.
- Fast, fönsteranpassad panelhöjd. Bara meddelandedelen scrollar; header och formulär är synliga. Panelens z-index höjdes över webbplatsens header.
- Användar- och assistentmeddelanden har olika placering/färg. Radbrytningar visas med pre-wrap.
- Dokumentlänkar har avdelare, länkstil och focus-visible. Input/knappar har fokus- och disabled-stilar.
- Autoscroll flyttar meddelandebehållaren vid nya meddelanden, dokumentladdning och öppning.
- Input får fokus vid öppning och när pågående anrop är klart. Enter och Skicka fungerar.
- Ingen animation lades till; jag behåller den enkla utformningen.
- Escape och explicit fokus tillbaka till öppningsknappen är inte implementerade. Autoscroll tar inte hänsyn till om jag medvetet läser äldre meddelanden. Dessa är förbättringsmöjligheter, inte genomförda funktioner.
- Ingen separat fullständig tillgänglighetsgranskning eller ny systematisk mobiltestomgång efter alla sista ändringar har dokumenterats.

### Verifiering och dokumentation

- Jag har rapporterat godkänd full frontend-lint och build efter den sista ChatSources-rättningen. Vites tidigare storleksvarning är känd.
- Agentens riktade ESLint av Chat och ChatSources passerade efter rättning av ref-/variabelnamn.
- Agenten körde syntaxkontroller under refaktoreringen och laddade getReply/getSupportReply med korrekta importer utan live-anrop. Ingen backendtestsvit finns; npm test är en placeholder.
- Jag provade backend avstängd → fel i chatten → återstart → ny fråga fungerar utan omladdning.
- README-filerna är uppdaterade i jag-form. Examinationskrav finns bevarade separat längst ner i STATUS.
- Dagens senaste dokumentationspass ändrar bara README/STATUS, inga körbara filer. Ingen commit, push eller Project-board-ändring utförs av agenten.

### Kvar inför inlämning

- En sista kort kontroll av slutligt kodläge och demo efter samtliga refaktoreringar: produktföljdfråga, blandfråga, kundvagn och dokumentlänk. Tidigare godkända manuella prov ska inte beskrivas som en ny automatisk regression.
- Kontrollera mobilvy, lågt fönster, tangentbordsnavigering och att chatten kan stängas med synligt kryss.
- Kontrollera inlämningsrepo, aktuell branch/arbetsstatus och att lokala ändringar finns med i avsedd inlämningsbranch.
- Kontrollera att inga .env-filer eller hemligheter är spårade. Inga hemliga värden ska återges i chatt eller dokumentation.
- Jag sköter commit, push, GitHub-board och själva inlämningen om jag inte uttryckligen ber om annat.
- Förbered en kort Code Review-demo av RAG, tools, historik, kundvagn och ansvarsfördelning. Deadline enligt uppgiften är 29 oktober 23:59; Code Review 30 oktober.

## Nästa steg

**Gör den avgränsade slutkontrollen före inlämning.** Börja med repo-/inlämningsläget och kontrollera därefter en kort demo på aktuellt kodläge. Läs kvarvarande begränsningar ovan och gör inga nya funktioner eller större omskrivningar under slutkontrollen om inget konkret fel motiverar det.


## Ursprunglig examinationsuppgift

Flyttad från README den 28 oktober 2026. Texten nedan är lärarens uppgiftsbeskrivning, inte instruktioner för nya kodändringar eller ett intyg om uppnått betyg. README beskriver projektet och hur det körs.

### Examination – PixelForge AI-assistent

#### Projektbeskrivning

PixelForge är en e-handelsplattform för teknikprodukter som vill förbättra sin kundservice med hjälp av en AI-driven chatbot. Du har fått en befintlig frontend och en förberedd backend som utgångspunkt. Din uppgift är att utveckla och integrera en chatbot som hjälper kunder att hitta produkter och få svar på frågor om butikens villkor och support.

**Syftet** är att tillämpa kursens tekniker i en fungerande fullstackapplikation. **Målet** är en chatbot som kan använda både butikens dokumentation och aktuell produktinformation för att ge relevanta svar samt förstå följdfrågor.

#### Kravspecifikation

Chatbotten ska:

- Vara integrerad i PixelForges befintliga frontend och kommunicera med en språkmodell.
- Kunna besvara frågor om exempelvis leverans, retur och reklamation utifrån de tillhandahållna supportdokumenten.
- Kunna söka fram och ge information om produkter, exempelvis pris, kategori och lagerstatus.
- Hantera konversationshistorik så att användaren kan ställa följdfrågor.
- Använda **RAG** för supportdokument och **tools** för produktinformation. Du väljer själv hur dessa tekniker kombineras; någon särskild orkestreringslösning krävs inte.

#### Teknik och projektstruktur

Utgå från de tillhandahållna projekten:

- [pixelforge-frontend](./pixelforge-frontend/README.md) – installation, komponenter, package-arkitektur och frontendens funktioner.
- [pixelforge-backend](./pixelforge-backend/README-backend.md) – installation, miljövariabler, Ollama, Supabase och seed-script.

Använd **React**, **Node.js/Express**, **LangChain.js**, **Ollama**, **Supabase** och kursens tekniker för **RAG och tools**.

Du får själv välja om du bygger chatbotens AI-logik i frontend eller backend, men **backend rekommenderas**. All kommunikation med Supabase som kräver hemliga nycklar ska ske i backend. Lägg aldrig Supabase-nycklar eller andra hemligheter i frontendkod eller i ett publikt GitHub-repository.

#### Betygskriterier

##### Godkänt (G)

För G ska samtliga krav i kravspecifikationen vara uppfyllda. Chatbotten ska fungera i den befintliga applikationen och använda både RAG och tools för sina respektive uppgifter. Den ska också kunna förstå och besvara relevanta följdfrågor.

##### Väl godkänt (VG)

För VG ska samtliga G-krav vara uppfyllda. Dessutom ska:

- **Kundvagnen kunna hanteras via chatbotten:** Användaren ska kunna lägga till och ta bort produkter med naturligt språk, även genom följdfrågor. Ändringarna ska synas i webbshoppens kundvagn.
- **Relevanta dokument länkas i chatten:** När chatbotten besvarar en fråga med hjälp av ett supportdokument ska användaren kunna öppna dokumentets egen sida i PixelForge via en klickbar länk.
- **Koden vara skalbar och modulär:** Lösningen ska följa de arkitektoniska principerna i den tillhandahållna koden på ett genomtänkt sätt, med tydlig ansvarsfördelning och återanvändbara delar.

#### Inlämning och examination

**Deadline: 29 oktober 2026 kl. 23:59.**

Lämna in en länk till ditt GitHub-repository enligt instruktionerna på kursplattformen. Se till att projektet innehåller en README med information om hur lösningen installeras och startas samt vilka miljövariabler som behöver konfigureras. Lämna inte in hemliga nycklar eller `.env`-filer.

**Examinerande Code Review: 30 oktober 2026.** Schema publiceras senare. Du ska kunna demonstrera chatbotten och förklara hur du har implementerat RAG, tools, konversationshistorik och eventuell VG-funktionalitet.
