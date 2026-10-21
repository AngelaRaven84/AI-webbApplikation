# PixelForge AI-assistent – status och plan

Senast uppdaterad: **21 oktober 2026**.

Det här är vår gemensamma plats för beslut, tankar, verifierad status och nästa steg. Bocka bara av arbete som faktiskt är gjort och ange vad som har testats. Planering är inte färdig funktionalitet.

## Nuläge

- Sara har lagt startprojektet i `projekt/examinationer/AI-webbApplikation`.
- Rotens README, frontendens README och package.json samt backendens README-backend.md och package.json är lästa.
- Backendens `src/routes/chat.route.js` har en tom POST-handler. Grundchatten återstår.
- Enligt startdokumentationen finns produktvisning, supportsidor, kundvagn med Zustand, TanStack Query och npm workspaces i frontend. Backend har Express, Ollama-/Supabase-konfiguration och ett PDF-seed-script. Funktionerna har inte körtestats i detta pass.
- Installationsstatus, lokala modeller, miljövariabler, Supabase, start av apparna och lint/build är ännu inte verifierade för det här projektet.
- Instruktionsvideons ljud har transkriberats och jämförts med kursens uppdaterade README. Kursunderlag är inte en instruktion att automatiskt implementera allt.
- Den lokala rot-README:n saknar ännu den uppdaterade kursversionens produkt-API, videolänk och rättade länk till backendens README. Originalinstruktionerna har inte ändrats i detta pass.
- Git vid dokumentationsstart: branch `main`, spårar `origin/main`. README är redan ändrad; `.DS_Store` och båda projektmapparna är ospårade. Befintligt arbete bevaras. Ingen commit eller push har gjorts.

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

Vi börjar utan en separat klassificeringsrouter. Verktygsnamnen är arbetsnamn; exakta filnamn, paketgränser och kontrakt bestäms när vi har gått igenom koden.

Varför vi väljer detta:

- Produktdata och supportdokument får tydliga, separata ansvarsområden.
- Dokumenthämtningen kan verifieras innan den kopplas till modellens verktygsval.
- En fråga kan behöva både produktinformation och supportvillkor.
- Källmetadata från början gör det enklare att senare visa dokumentlänkar för VG.

Att verifiera: den valda Ollama-modellen måste kunna välja och anropa rätt verktyg. Följdfrågor måste ge tydliga sökfrågor, exempelvis att ”gäller det även den?” kopplas till tidigare samtal. Vi väljer senare om detta löses via verktygsargument eller en separat omskrivning till en fristående fråga.

### 4. Följ startkodens arkitektur

- Behåll root `src` för appstart och global CSS.
- Använd `base`, `shared`, `pages` och `core` efter ansvar och följ befintliga namngivna workspace-paket där de behövs.
- Använd TanStack Query för nya API-anrop i frontend, enligt Jespers förtydligande.
- Håll CSS nära sin komponent eller sida.
- Återanvänd befintlig kundvagnsstore när kundvagnsverktygen byggs.
- Sara skriver implementationskoden i små, förklarade och testbara steg. Vi tar ett steg i taget och inväntar hennes resultat.

## Krav att täcka

### G – grundfunktion

- [ ] Chatten är integrerad i befintlig PixelForge-frontend och kommunicerar med en språkmodell.
- [ ] Supportfrågor besvaras med RAG utifrån de tillhandahållna dokumenten.
- [ ] Produktfrågor besvaras genom tools som använder kursens produkt-API.
- [ ] Historik gör att relevanta följdfrågor fungerar för både produkter och support.
- [ ] Lösningen använder React, Node.js/Express, LangChain.js, Ollama och Supabase.

### VG – tillägg efter fungerande G-flöde

Dessa punkter ingår som planeringsunderlag; G-flödet byggs först.

- [ ] Lägg till produkter genom chatten, även genom följdfrågor.
- [ ] Ta bort produkter genom chatten, även genom följdfrågor.
- [ ] Kundvagnsändringar syns i webbshoppens befintliga kundvagn.
- [ ] Dokumentbaserade svar länkar till rätt dokuments egen sida i PixelForge.
- [ ] Modulär och skalbar kod följer startkodens arkitektur och ansvarsfördelning.

## Arbetsplan – underlag till GitHub Project

Varje rad nedan kan senare bli ett kort eller en issue med en tydlig beskrivning och ett klart-kriterium. Förslag på kolumner: **Att göra → Pågår → Att verifiera → Klart**. Inget board eller några issues har skapats av agenten. Sara skapar boardet; vi hjälper till att bryta ned och lägga in arbetet när hon ber om det.

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
- [Produkt-API](https://santosnr6.github.io/Data/pixelforgeproducts.json). Verkliga fält behöver kontrolleras; lagerstatus anges som exempel och ska inte hittas på om fältet saknas.
- Inspelning: `261021, Genomgång av examination.mp4` (21 oktober). Jesper rekommenderar frontend först och en fungerande grundchatt före påbyggnad. Val av RAG/tools-kombination är fritt.
- Jesper avser publicera ett ytterligare kodexempel för RAG + tools senast fredag morgon den 23 oktober. Publiceringen är inte verifierad här.
- **Skriftlig deadline: 29 oktober 2026 kl. 23:59.**
- **Examinerande Code Review: 30 oktober 2026**, personligt schema återstår att kontrollera.

## Verifiering av detta dokumentationspass

21 oktober: lokala instruktioner, README-filer, package.json, tom chat-route och Git-status kontrollerade. STATUS.md skapad som dokumentation. Ingen installation, seed, appstart, implementation, lint eller build utförd. Backendens befintliga testscript är en placeholder som avslutas med fel och utgör ingen fungerande testsvit.

## Nästa steg

**Gå igenom frontendens appstart och gemensamma layout och bestäm var den första chattkomponenten ska anslutas.** Därefter tar Sara det första lilla kodsteget. GitHub-boardet bryter vi ned tillsammans när hon har skapat det.
