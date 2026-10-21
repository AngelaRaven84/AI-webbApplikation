# PixelForge – Frontend

Det här är frontendprojektet för **PixelForge**, en fiktiv e-handelsplattform. Applikationen är byggd med React och Vite och innehåller bland annat produktvisning, kategorier, supportdokument och en kundvagn.

Frontendprojektet är färdigt att bygga vidare på. Läs den övergripande README-filen i projektets rot för själva examinationsuppgiften.

## Kom igång

Du behöver Node.js och npm installerat.

Öppna terminalen i **frontend-mappen** och kör:

```bash
npm install
npm run dev
```

Öppna adressen som Vite visar i terminalen (vanligtvis `http://localhost:5173`).

Andra användbara kommandon:

```bash
npm run build    # Skapa en produktionsbuild
npm run preview  # Förhandsgranska produktionsbuilden
npm run lint     # Kör ESLint
```

Alla npm-kommandon ovan körs från frontendprojektets rot, där dess `package.json` finns.

## Tekniker

- **React** – komponenter och användargränssnitt.
- **Vite** – utvecklingsserver och byggverktyg.
- **React Router** – navigering mellan sidor.
- **TanStack Query** – hämtning och cachelagring av extern data.
- **Zustand** – global state, bland annat kundvagnen.
- **Lucide React** – ikoner.
- **React Markdown** – visning av Markdown-innehåll.
- **npm workspaces** – hantering av projektets lokala paket.

## Projektets arkitektur

Projektet använder en **package-baserad arkitektur**. Funktionalitet och komponenter är organiserade i separata mappar under `packages/`. Många av dessa mappar är egna lokala npm-paket och kan importeras via `@pixelforge/...`.

```text
frontend/
├── packages/
│   ├── base/
│   ├── shared/
│   ├── pages/
│   └── core/
├── src/
│   ├── main.jsx
│   └── index.css
├── package.json
└── package-lock.json
```

### `packages/base/` – grundläggande UI och layout

Här finns generella delar av gränssnittet, exempelvis `button`, `icon`, `header`, `footer` och `layout`. De kan användas på flera ställen och är inte knutna till en enskild produktsida eller ett särskilt affärsflöde.

**Lägg här:** en generell knapp, modal eller annan återanvändbar UI-byggsten.

### `packages/shared/` – återanvändbara verksamhetskomponenter

Här finns komponenter som kan användas på flera sidor men som är mer specifika för PixelForge. Ett exempel är `productcard`.

**Lägg här:** en produktkomponent som används på både startsidan och produktsidan, eller en annan återanvändbar komponent med koppling till webbshoppen.

### `packages/pages/` – sidor och deras innehåll

Här ligger sidkomponenter, exempelvis startsidan, produktsidan och supportsidorna. Komponenter som bara hör till en viss sida kan placeras i sidans `children/`-mapp.

**Lägg här:** en ny sida eller en komponent som bara används av en specifik sida.

### `packages/core/` – gemensam applikationslogik

Här finns bland annat:

- `api/` – funktioner som hämtar extern data.
- `router/` – applikationens routes.
- `stores/` – global state, exempelvis Zustand-storen för kundvagnen.
- `data/` – projektets datamoduler.

**Lägg här:** gemensam API-logik, en global store eller konfiguration som används av flera komponenter.

## Hur är en komponent organiserad?

Många befintliga komponenter följer det här mönstret:

```text
productcard/
├── ui/
│   ├── index.jsx
│   └── index.css
├── index.js
└── package.json
```

- `ui/index.jsx` innehåller React-komponenten.
- `ui/index.css` innehåller komponentens CSS.
- `index.js` exporterar det som andra delar av projektet ska kunna importera.
- `package.json` ger paketet ett namn och en ingångspunkt.

En komponent kan även ha en `children/`-mapp för mindre komponenter som hör till just den komponenten. Exempelvis ligger `brand`, `navbar`, `headeractions` och `cartdropdown` under `header/children/` i startprojektet.

Det här är projektets befintliga organisationsmönster, **inte ett krav på att varje liten komponent måste bli ett eget npm-paket**. En komponent som bara används internt kan lika gärna vara en vanlig lokal komponent.

## Skapa ett nytt lokalt paket

Anta att du vill skapa en återanvändbar `chatbutton` under `packages/base/`.

### 1. Skapa mapparna

```text
packages/base/chatbutton/
├── ui/
│   ├── index.jsx
│   └── index.css
├── index.js
└── package.json
```

### 2. Skapa komponenten

I `ui/index.jsx`:

```jsx
import './index.css';

export const ChatButton = ({ onClick }) => {
    return (
        <button type="button" onClick={onClick}>
            Open chat
        </button>
    );
};
```

### 3. Exportera komponenten

I paketets `index.js`:

```javascript
export { ChatButton } from './ui/index.jsx';
```

### 4. Namnge paketet

I paketets `package.json`:

```json
{
  "name": "@pixelforge/chatbutton",
  "version": "1.0.0",
  "type": "module",
  "main": "./index.js"
}
```

Frontendprojektets `package.json` har redan `"workspaces": ["./packages/**"]`, så npm kan hitta lokala paket i denna struktur.

### 5. Installera om workspace-beroenden

Kör från **frontendprojektets rot**:

```bash
npm install
```

Det gör att npm kan länka in det nya paketet i projektets workspace. Om Vite redan körs och inte hittar paketet kan du behöva starta om utvecklingsservern.

### 6. Importera komponenten

```jsx
import { ChatButton } from '@pixelforge/chatbutton';

export const Example = () => {
    return <ChatButton onClick={() => console.log('Open chat')} />;
};
```

Kör därefter `npm install` från frontendroten. För vanliga lokala komponenter inom samma paket behövs däremot inget separat workspace-beroende.

## Var ska jag lägga chatbotten?

Du får anpassa frontendstrukturen efter din lösning. En rimlig utgångspunkt är att placera chatbotens komponenter tillsammans, till exempel i ett nytt paket under `packages/shared/`, om flera delar av applikationen behöver använda dem.

En liten underkomponent som bara används av chatbotten kan ligga i chatbotkomponentens egen `children/`-mapp. Logik för anrop till backend kan placeras i `packages/core/api/` eller i en separat modul nära chatbotten.

**Det viktiga är att strukturen är begriplig och att frontend kan kommunicera med din backend.** Du behöver inte följa varje befintligt mappmönster exakt.

## Befintlig data och state

### Produkter och supportdokument

I `packages/core/api/` finns funktionerna `fetchProducts()` och `fetchDocuments()`. De hämtar JSON-data från externa URL:er. Produkt- och dokumentsidorna använder TanStack Query för att hantera hämtning, cache, laddningstillstånd och fel.

Exempel på samma mönster:

```jsx
const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
});
```

Du behöver normalt inte bygga om den befintliga produkt- eller dokumenthämtningen för att implementera din chatbot.

### Kundvagnen

Kundvagnens globala state hanteras med Zustand i `packages/core/stores/usecartstore/`. Den innehåller en array av produkter med bland annat produkt-ID, namn, pris, bild och antal (`qty`). Storen erbjuder funktioner för att lägga till en produkt, minska dess antal eller ta bort den när antalet når noll, samt tömma kundvagnen.

Exempel på användning av Zustand:

```jsx
const cart = useCartStore((state) => state.cart);
const addToCart = useCartStore((state) => state.addToCart);
```

Se befintliga produkt- och kundvagnskomponenter för hur storen används i praktiken.

## Routing

Applikationens routes definieras i `packages/core/router/`. När du skapar en helt ny sida behöver du normalt registrera den där. Om chatbotten i stället visas som en panel ovanpå befintliga sidor kan den monteras i en gemensam layoutkomponent.

## Tips när du utvecklar

- Börja med att köra frontendprojektet och undersöka de befintliga komponenterna.
- Återanvänd befintliga komponenter när det är rimligt.
- Håll API-anrop och gemensam state-logik separerade från ren presentation när det underlättar.
- Skapa bara nya packages när det faktiskt hjälper strukturen.
- Testa att din frontend fungerar tillsammans med backend innan inlämning.

För **vad chatbotten ska kunna göra och vilka krav som gäller för G/VG**, läs den övergripande README-filen i projektets rot.
