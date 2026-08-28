# HeritageConnect Backend (SIH26197)

Node.js + Express backend for the **HeritageConnect** frontend (heritage search, voice/location search, QR scanner, 26-language support).

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev      # needs nodemon (npm i -g nodemon), or:
npm start        # plain node
```

Server runs at `http://localhost:5000` by default.

## Folder Structure

```
backend/
├── server.js              # App entry point
├── package.json
├── .env.example
├── data/
│   ├── heritage.json      # Sample monuments/food/festivals/dance/music data (multi-language)
│   └── languages.json     # 26 supported languages
├── controllers/
│   ├── heritageController.js
│   ├── locationController.js
│   ├── scannerController.js
│   └── languageController.js
└── routes/
    ├── heritage.js
    ├── location.js
    ├── scanner.js
    └── languages.js
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check + list of endpoints |
| GET | `/api/heritage?lang=ta` | Get all heritage items |
| GET | `/api/heritage/search?q=taj&category=monument&lang=ta` | Search by name/state, filter by category |
| GET | `/api/heritage/:id?lang=ta` | Get one item, e.g. `/api/heritage/taj-mahal` |
| GET | `/api/heritage/category/:category` | e.g. `/api/heritage/category/food` |
| GET | `/api/location/nearby?lat=13.08&lng=80.27&radius=500&lang=ta` | Heritage sites near a location |
| GET | `/api/scanner/:qrCode?lang=ta` | Look up a heritage site by scanned QR code, e.g. `/api/scanner/HC-MON-001` |
| GET | `/api/languages` | List of 26 supported languages |

`lang` query param accepts codes like `en`, `hi`, `ta`, `te`, `kn`, etc. Falls back to English if a translation isn't available for that item yet.

## Connecting to Your Frontend

In your frontend JS, replace hardcoded/dummy search logic with calls like:

```js
const res = await fetch(`http://localhost:5000/api/heritage/search?q=${query}&lang=${currentLang}`);
const data = await res.json();
// data.results -> render into your "LIVE SEARCH RESULTS" section
```

For location:

```js
navigator.geolocation.getCurrentPosition(async (pos) => {
  const { latitude, longitude } = pos.coords;
  const res = await fetch(`http://localhost:5000/api/location/nearby?lat=${latitude}&lng=${longitude}`);
  const data = await res.json();
});
```

For QR scanner, once your camera library decodes a QR code into a string (e.g. `HC-MON-001`), call:

```js
const res = await fetch(`http://localhost:5000/api/scanner/${decodedText}`);
```

## Deploying

- Free options: **Render**, **Railway**, or **Cyclic** for the Node backend.
- Since your frontend is on GitHub Pages, update `FRONTEND_URL` in `.env` and restrict CORS in `server.js` once deployed, so only your site can call the API.
- After deploying, replace `http://localhost:5000` in your frontend fetch calls with your live backend URL.

## Next Steps / TODO

- Add more heritage entries to `data/heritage.json` (currently 8 sample entries across monuments, food, festivals, dance, music).
- Add more language translations per item (`name`/`description` objects support any of the 26 language codes).
- Optionally connect a real database (MongoDB/PostgreSQL) instead of the JSON file once data grows.
- Add rate limiting / API key if you make this public.
