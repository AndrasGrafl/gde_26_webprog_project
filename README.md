# Mozi Jegyfoglaló Rendszer (Webprogramozás Projekt)

Ez a projekt egy webalkalmazás mozik számára, ahol a felhasználók regisztrálhatnak, bejelentkezhetnek, böngészhetnek a filmek és aktuális vetítések között, valamint jegyeket foglalhatnak.
A projekt két fő részből áll: egy Node.js/Express alapú **Backend** (API) szolgáltatásból, és egy Vue.js + Vite alapú **Frontend** kliensből.

## Fő funkciók
- Felhasználói regisztráció és bejelentkezés JWT alapú hitelesítéssel.
- Filmek listázása és vetítések megtekintése.
- Dinamikus jegyfoglalás, elérhető helyek ellenőrzésével.
- Reszponzív felület Tailwind CSS segítségével.

## Technológiák
- **Backend:** Node.js, Express.js, TypeScript, PostgreSQL, Drizzle ORM, Zod, JsonWebToken.
- **Frontend:** Vue 3 (Composition API), Vue Router, Vite, Tailwind CSS.
- **Infrastruktúra:** Docker (PostgreSQL futtatására).

## Környezeti Változók (Environment Variables)

A backend elindításához szükséges egy `.env` fájl a `backend/` mappában. Ez tartalmazza az érzékeny beállításokat. Példa a `backend/.env` fájl tartalmára:

```env
# A backend szerver portja
PORT=3000

# PostgreSQL adatbázis kapcsolati sztring
DATABASE_URL=postgresql://admin:adminpassword@localhost:5432/mozi_db

# JWT Titkos kulcs a tokenek aláírásához (fejlesztési környezetben bármi lehet)
JWT_SECRET=super_secret_key_for_jwt_development
```

## Projekt Telepítése és Futtatása (Setup Instructions)

### 1. Előfeltételek
- Node.js (v18+)
- Docker és Docker Compose
- Git

### 2. Adatbázis elindítása
A projekt PostgreSQL adatbázist használ, amelyhez legegyszerűbben Docker használatával férhetünk hozzá.
A projekt gyökerében add ki a következő parancsot:
```bash
docker-compose up -d
```
Ez elindítja a `mozi_db` elnevezésű adatbázist a háttérben.

### 3. Backend (API) telepítése és elindítása
Nyiss egy új terminál ablakot, majd:
```bash
# Lépj be a backend mappába
cd backend

# Telepítsd a függőségeket
npm install

# Futtasd le az adatbázis migrációkat (táblák létrehozása)
npx drizzle-kit push

# (Opcionális) Töltsd fel teszt adatokkal az adatbázist (Filmek és vetítések)
npx ts-node src/db/seed.ts

# Indítsd el a backend szervert
npm run dev
```
A backend a `http://localhost:3000` címen fog futni.

### 4. Frontend kliens telepítése és elindítása
Nyiss egy másik terminál ablakot:
```bash
# Lépj be a frontend mappába
cd frontend

# Telepítsd a függőségeket
npm install

# Indítsd el a fejlesztői szervert
npm run dev
```
A frontend applikáció egy automatikusan kapott porton indul el (pl. `http://localhost:5173`). Kattints a megjelenő hivatkozásra a böngészőből való eléréshez!

## Tesztelés
A backendhez írt API tesztek (`jest` + `supertest`) futtatásához lépj be a `backend/` mappába, majd:
```bash
npm test
```
