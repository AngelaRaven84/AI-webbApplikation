# PixelForge – Backend

Det här är backendprojektet för **PixelForge**, en fiktiv webbshop. Startkoden innehåller en Express-server, konfiguration för **Ollama** och **Supabase**, samt ett färdigt script som läser in supportdokument och sparar dem som embeddings i en vektordatabas.

**Din uppgift är inte färdigimplementerad i startkoden.** Chat-endpointen och AI-logiken ska du själv bygga. Se projektets övergripande README för examinationskraven.

## 1. Kom igång

Du behöver:

- Node.js och npm
- [Ollama](https://ollama.com/) installerat och igång lokalt
- Ett eget Supabase-projekt med stöd för vektorsökning

Öppna terminalen i **backend-mappen** och installera beroendena:

```bash
npm install
```

Starta utvecklingsservern:

```bash
npm run dev
```

Servern lyssnar som standard på `http://localhost:8080`. Den befintliga routen är `POST /api/chat`, men den innehåller ännu ingen implementerad logik och ger därför inte ett fungerande chatsvar.

Övriga kommandon:

```bash
npm start       # Starta servern utan nodemon
npm run seed    # Läs in PDF-dokument och spara embeddings i Supabase
```

> Kör kommandona från backend-mappen, där `package.json` finns. Frontend startas separat enligt `frontend/README.md`.

## 2. Miljövariabler (.env)

Skapa en fil som heter `.env` i backend-mappen. Lägg in följande variabler och ersätt exempelvärdena med dina egna:

```dotenv
SUPABASE_URL=https://ditt-projekt.supabase.co
SUPABASE_KEY=din-supabase-nyckel
OLLAMA_LLM=namnet-pa-din-chattmodell
OLLAMA_EMBEDDING_MODEL=namnet-pa-din-embeddingmodell
PORT=din-valda-port
```

| Variabel | Vad den används till |
| --- | --- |
| `SUPABASE_URL` | Projektets URL i Supabase. |
| `SUPABASE_KEY` | Nyckeln som backend använder för att ansluta till Supabase. |
| `OLLAMA_LLM` | Namnet på den lokala språkmodell som ska generera chattsvar. |
| `OLLAMA_EMBEDDING_MODEL` | Namnet på modellen som skapar embeddings för dokument och sökfrågor. |
| `PORT` | Den port på localhost som kommer serva din backend. |

Du hittar URL och API-nycklar i ditt Supabase-projekts inställningar. Använd en nyckel som har den åtkomst din lösning behöver, och **förvara den endast i backendens `.env`**. En hemlig/service-role-nyckel får aldrig användas i frontend eller publiceras på GitHub.

`.env` är ignorerad via `.gitignore`.

**Viktigt:** De två Ollama-variablerna ska innehålla modellnamn som faktiskt finns nedladdade på din dator. De behöver inte vara samma modell. Embeddingmodellen som används vid sökning måste vara densamma som användes när dokumenten laddades upp.

### Installera Ollama-modeller

Välj de modeller ni använder under kursen och ladda ned dem, exempelvis:

```bash
ollama pull qwen3:4b
ollama pull nomic-embed-text
```

Då kan motsvarande `.env`-värden vara:

```dotenv
OLLAMA_LLM=qwen3:4b
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
```

Kontrollera dina installerade modeller med:

```bash
ollama list
```

Ollama behöver vara igång när du kör seed-scriptet och när backend ska använda modellerna. Den befintliga konfigurationen använder Ollamas standardadress `http://localhost:11434`.

## 3. Projektstruktur

```text
backend/
├── documents/                  # 20 supportdokument i PDF-format
├── scripts/
│   └── seed.js                 # Läser in dokument och skapar embeddings
├── src/
│   ├── ai/                     # Här kan du organisera din AI-logik
│   ├── config/
│   │   ├── ollama.config.js    # Språkmodell och embeddingmodell
│   │   └── supabase.config.js  # Supabase-klient
│   ├── routes/
│   │   └── chat.route.js       # POST /api/chat – ska implementeras
│   └── utils/
│       └── combineDocuments.js # Hjälpfunktion för dokumenttext
├── .env                        # Dina egna inställningar (ska inte committas)
├── package.json
└── server.js                   # Express-servern
```

**`src/ai/`** är avsiktligt tom. Du kan själv välja hur du organiserar prompts, retriever, tools, chains och övrig AI-logik. Det finns ingen bestämd filstruktur som du måste följa där.

**`src/routes/chat.route.js`** innehåller en förberedd `POST /`-route som monteras under `/api/chat` i `server.js`. Du implementerar själv hur ett meddelande tas emot, behandlas och skickas tillbaka till frontend. Bestäm ett tydligt request- och response-format som frontend och backend använder gemensamt.

## 4. Förbered Supabase

Du behöver en vektordatabas för supportdokumenten.

1. Skapa ett eget projekt i Supabase.
2. Skapa en tabell som heter **`documents`** för dokumenttext, metadata och embeddings.
3. Skapa en sökfunktion som heter **`match_documents`**, så att LangChains `SupabaseVectorStore` kan göra likhetssökningar.
4. Se till att embeddingkolumnens dimension matchar **den embeddingmodell du valt**. Dimensionen skiljer sig mellan modeller.
5. Kontrollera att nyckeln i `.env` har nödvändiga rättigheter för att skriva och söka i tabellen.

Använd gärna SQL-instruktionerna från kursens tidigare RAG-övning. Tabellens och funktionens namn behöver överensstämma med startkoden. Kontrollera också att SQL-funktionens parametrar och returkolumner passar LangChains `SupabaseVectorStore`.

> Använder du en annan embeddingmodell än i tidigare övningar kan du behöva ändra dimensionen i SQL-koden. Blanda inte embeddings från olika modeller i samma vektorsökning.

## 5. Ladda upp dokumenten med seed

I `documents/` ligger **20 PDF-filer** med information om bland annat leveranser, returer, reklamationer, garantier, betalningar och teknisk support.

Seed-scriptet i `scripts/seed.js` gör följande:

1. Läser alla PDF-filer i `documents/` med `PDFLoader`.
2. Lägger till PDF-filens namn i dokumentens metadata (`source`).
3. Delar upp texten i mindre delar med `RecursiveCharacterTextSplitter` (`chunkSize: 1000`, `chunkOverlap: 200`).
4. Skapar embeddings med modellen i `OLLAMA_EMBEDDING_MODEL`.
5. Sparar text, metadata och embeddings i Supabase-tabellen `documents`.

När Supabase och Ollama är redo kör du:

```bash
npm run seed
```

Öppna sedan **Supabase → Table Editor → documents** och kontrollera att tabellen innehåller rader.

**Obs!** Seed-scriptet rensar inte tidigare data. Kör du det flera gånger kan samma dokument läggas in flera gånger. Töm relevanta rader innan du seedar på nytt om du vill undvika dubbletter.


## 6. Använd den förberedda konfigurationen

I `src/config/ollama.config.js` exporteras:

- `llm` – en `ChatOllama`-instans som använder `OLLAMA_LLM`.
- `embeddingModel` – en `OllamaEmbeddings`-instans som använder `OLLAMA_EMBEDDING_MODEL`.

I `src/config/supabase.config.js` exporteras:

- `supabase` – en färdig Supabase-klient.

Du kan importera dessa i din egen AI-logik i stället för att skapa nya instanser överallt.

`src/utils/combineDocuments.js` är tänkt att slå samman text från hämtade LangChain-dokument. Observera att LangChains dokumenttext ligger i **`pageContent`**. Om startfilen använder `document.content` behöver det ändras till `document.pageContent`.

## 7. Anslut frontend till backend

Frontend och backend körs som två separata utvecklingsservrar. Backendens route börjar på:

```text
http://localhost:8080/api/chat
```

Frontend behöver skicka användarens meddelanden till den endpoint du implementerar och visa svaret i chatten. Om du väljer ett annat portnummer eller request-format behöver du anpassa frontend därefter.

CORS och JSON-parsning är redan aktiverade i Express. Om du vill ändra serverns port: startkoden använder för närvarande `process.env.POSRT`; rätta detta till `process.env.PORT` och lägg vid behov till `PORT=8080` i `.env`.

## 8. Vanliga problem

| Problem | Kontrollera |
| --- | --- |
| Backend startar inte | Att du står i backend-mappen och har kört `npm install`. |
| Ollama-anrop misslyckas | Att Ollama körs och att modellnamnen i `.env` finns i `ollama list`. |
| Supabase-anslutning misslyckas | `SUPABASE_URL`, `SUPABASE_KEY` och databasbehörigheter. |
| Fel dimension på embeddings | Att vektorkolumnens dimension matchar vald embeddingmodell. |
| `match_documents` saknas | Att SQL-funktionen har skapats med rätt namn och signatur. |
| Dokument finns flera gånger | Att seed-scriptet inte körts upprepade gånger utan rensning. |
| Chatten ger inget svar | Att `POST /api/chat` ännu är en tom route tills du implementerat den. |

## 9. Vad är färdigt och vad ska du bygga?

**Färdigt i startprojektet:** Express-server, grundläggande middleware, förberedd chat-route, konfiguration för Ollama/Supabase, PDF-dokument och seed-script.

**Du bygger själv:** chatlogik, prompts, konversationshistorik, RAG-hämtning, tools och kopplingen mellan backendens svar och frontendens chatbot. Se den övergripande README-filen för vad som krävs för G och VG.

Målet är att du ska kunna fokusera på AI-funktionaliteten utan att behöva bygga all grundläggande infrastruktur från början.
