# PixelForge AI-assistent – status och plan

Senast uppdaterad: **23 oktober 2026**.

Det här är vår gemensamma plats för beslut, tankar, verifierad status och nästa steg. Bocka bara av arbete som faktiskt är gjort och ange vad som har testats. Planering är inte färdig funktionalitet.

## Nuläge – 23 oktober

- Grundchatten fungerar genom frontend → Express → Ollama, inklusive historik och relevanta följdfrågor enligt Saras tester.
- Backend använder produkt-API:et via `fetchProducts` → `searchProducts` → `search_products`. Sökning efter namn/märke/kategori, maxpris och lager finns.
- RAG är inkopplad som `search_support`: fråga → embedding → Supabase `match_documents` → fyra dokumentutdrag med källmetadata → dokumentbaserat svar.
- Sara har skapat ett eget PixelForge-projekt i Supabase, laddat in dokumenten och verifierat sökning från backend. Nycklar hålls i backendens lokala .env; inga hemligheter återges här.
- Lokalt PDF-test: 20 PDF-filer → 54 sidbaserade dokumentdelar → 161 chunks. Två databasrader visar text, source, documentId och 1024-dimensionella embeddings. Totalt radantal i databasen har inte visats i samtalet.
- Modell: `qwen3:4b-instruct`; embeddingmodell: `qwen3-embedding:0.6b`, verifierad dimension 1024. Backend/API använder port 8080, Ollama 11434.
- Produktfråga, inga träffar, kategoribyte med historik, supportfråga, supportföljdfråga, blandad fråga och saknat dokumentunderlag har provats av Sara. Frontend-lint/build passerade efter senaste ändringen enligt Sara.
- Dokumentlänkar (VG) fungerar: strukturerade käll-id:n matchas mot frontendens befintliga dokumentlista och länkar till rätt supportsida. Sara har verifierat klick och att chatten finns kvar.
- Kundvagn: aktuell snapshot skickas med varje fråga. Ett första tillägg via följdfråga är verifierat hela vägen till synlig kundvagn, men ”ett exemplar till av samma” misslyckas fortfarande: modellen svarar som om den ändrat kundvagnen utan verktygsanrop. Kundvagnsdelen är därför pågående, inte klar. Borttagning via chatten saknas.
- UI är fortfarande enkelt; öppna/stänga, hörnplacering och styling återstår. Se dagens pauspunkt för exakt status och återstart.
- Ingen ny implementation vid dagens paus. Sara uppdaterar själv GitHub och sitt Project-board.

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

Vi använder ingen separat klassificeringsrouter. Implementerade verktygsnamn är `search_products` och `search_support`, med funktionerna searchProducts och searchSupport bakom. Modellen väljer verktyg; backend utför dem.

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

Dessa punkter ingår som planeringsunderlag; G-flödet byggs först.

- [ ] Lägg till produkter genom chatten, även genom följdfrågor.
- [ ] Ta bort produkter genom chatten, även genom följdfrågor.
- [ ] Kundvagnsändringar syns i webbshoppens befintliga kundvagn.
- [x] Dokumentbaserade svar länkar till rätt dokuments egen sida i PixelForge.
- [ ] Modulär och skalbar kod följer startkodens arkitektur och ansvarsfördelning.

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

## Pauspunkt – 23 oktober 2026, dokumentlänkar klara och kundvagn pågår

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

## Nästa steg

**Återuppta det misslyckade ”ett exemplar till”-fallet.** Läs dagens pauspunkt, getReply.js, addToCartTool.js och createAddToCartAction.js före kodförslag. Första föreslagna lilla experiment är separat strukturerad tolkning i parseCartIntent.js (filen finns ännu inte), testad utan kundvagnsändring mot tydlig add-begäran, vanlig fråga och oklart produktval. Bedöm utfallet innan integration och undvik dubbel exekvering. Det synliga godkännandekriteriet är ett verkligt nytt tillägg som ökar rätt produkt från 1 till 2, med en bekräftelse som motsvarar faktisk åtgärd. Därefter byggs borttagning. Sara skriver implementationen själv i små steg; ingen mer kod vid dagens paus.
