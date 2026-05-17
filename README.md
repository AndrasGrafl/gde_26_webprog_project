# Mozi Jegyfoglalo Rendszer

Ez a projekt egy online jegyfoglalo webalkalmazas mozik szamara. A felhasznalok filmeket es vetiteseket bongeszhetnek, regisztralhatnak, bejelentkezhetnek, majd jegyet foglalhatnak a kivalasztott idopontra. Bejelentkezes utan a sajat foglalasaik is megtekinthetok.

## Alkalmazas felepitese

- `backend/`: Node.js, Express es TypeScript alapu REST API.
- `frontend/`: Vue 3, Vite es Tailwind CSS alapu kliensalkalmazas.
- `backend/src/db/schema.ts`: Drizzle ORM adatbazis modellek.
- `backend/drizzle/0000_tough_revanche.sql`: az adatbazis letrehozasahoz szukseges SQL script.
- `docker-compose.yml`: PostgreSQL, backend es frontend konteneres futtatasa.

## Fobb funkciok

- Filmek listazasa.
- Vetitesek listazasa filmenkent.
- Felhasznaloi regisztracio es bejelentkezes JWT hitelesitessel.
- Jegyfoglalas elerheto helyek ellenorzesevel.
- Sajat foglalasok nyomon kovetese.
- Reszponziv kliensoldal Tailwind CSS segitsegevel.

## Technologiak

- Backend: Node.js, Express, TypeScript, PostgreSQL, Drizzle ORM, Zod, JWT, bcrypt.
- Frontend: Vue 3, Vue Router, Vite, Tailwind CSS.
- Teszteles: Jest es Supertest.
- Kontenerizacio: Docker es Docker Compose.

## Konfiguracio

A backend az alabbi kornyezeti valtozokat hasznalja:

```env
PORT=3000
DATABASE_URL=postgresql://admin:adminpassword@localhost:5432/mozi_db
JWT_SECRET=super_secret_key_for_jwt_development
```

Docker Compose futtatasnal a projekt gyokerben hozz letre egy `.env` fajlt az alabbi tartalommal:

```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=adminpassword
POSTGRES_DB=mozi_db
JWT_SECRET=super_secret_key_for_jwt_development
```

Ilyenkor a `DATABASE_URL` a Compose fajlban ezekbol az ertekekbol epul fel. Helyi, Docker nelkuli backend futtatashoz hozz letre egy `backend/.env` fajlt a fenti tartalommal.

## Futtatas Dockerrel

Az alkalmazas teljes fejlesztoi kornyezete indithato Docker Compose-zal:

```bash
docker-compose up --build
```

Ez elinditja:

- PostgreSQL adatbazist: `localhost:5432`
- Backend API-t: `http://localhost:3000`
- Frontend alkalmazast: `http://localhost:5173`

Az elso inditas utan az adatbazis tablak letrehozasahoz futtasd:

```bash
docker-compose exec backend npx drizzle-kit push
```

Opcionális tesztadatok betoltese:

```bash
docker-compose exec backend npx ts-node src/db/seed.ts
```

## Helyi futtatas Docker nelkul

Adatbazis inditasa:

```bash
docker-compose up -d db
```

Backend:

```bash
cd backend
npm install
npx drizzle-kit push
npx ts-node src/db/seed.ts
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## API vegpontok

### Auth

`POST /auth/register`

Uj felhasznalo regisztralasa.

Request body:

```json
{
  "name": "Teszt Elek",
  "email": "teszt@example.com",
  "password": "titkos123"
}
```

Sikeres valasz: `201 Created`

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "Teszt Elek",
    "email": "teszt@example.com",
    "role": "user"
  }
}
```

`POST /auth/login`

Bejelentkezes JWT token igenylesehez.

Request body:

```json
{
  "email": "teszt@example.com",
  "password": "titkos123"
}
```

Sikeres valasz: `200 OK`

```json
{
  "message": "Login successful",
  "token": "jwt-token",
  "user": {
    "id": 1,
    "name": "Teszt Elek",
    "email": "teszt@example.com",
    "role": "user"
  }
}
```

### Filmek es vetitesek

`GET /movies`

Az osszes film listazasa.

Sikeres valasz: `200 OK`

```json
[
  {
    "id": 1,
    "title": "Film cime",
    "description": "Leiras",
    "genre": "Sci-fi",
    "durationMinutes": 120,
    "posterUrl": "https://example.com/poster.jpg"
  }
]
```

`GET /movies/:id/screenings`

Egy filmhez tartozo vetitesek listazasa. Az `:id` a film azonositoja.

Sikeres valasz: `200 OK`

```json
[
  {
    "id": 1,
    "movieId": 1,
    "room": "1. terem",
    "startTime": "2026-05-20T18:00:00.000Z",
    "availableSeats": 80
  }
]
```

`POST /movies`

Admin jogosultsaghoz kotott film letrehozasa.

Header:

```http
Authorization: Bearer <jwt-token>
```

Request body:

```json
{
  "title": "Uj film",
  "description": "Film leirasa",
  "genre": "Drama",
  "durationMinutes": 100,
  "posterUrl": "https://example.com/poster.jpg"
}
```

### Foglalasok

`POST /bookings`

Jegyfoglalas letrehozasa. Bejelentkezes szukseges.

Header:

```http
Authorization: Bearer <jwt-token>
```

Request body:

```json
{
  "screeningId": 1,
  "seatsBooked": 2
}
```

Sikeres valasz: `201 Created`

```json
{
  "message": "Booking successful",
  "booking": {
    "id": 1,
    "userId": 1,
    "screeningId": 1,
    "seatsBooked": 2
  }
}
```

`GET /bookings/my-bookings`

A bejelentkezett felhasznalo sajat foglalasainak listazasa.

Header:

```http
Authorization: Bearer <jwt-token>
```

Sikeres valasz: `200 OK`

```json
[
  {
    "bookingId": 1,
    "seatsBooked": 2,
    "createdAt": "2026-05-15T20:00:00.000Z",
    "room": "1. terem",
    "startTime": "2026-05-20T18:00:00.000Z",
    "movieTitle": "Film cime",
    "posterUrl": "https://example.com/poster.jpg"
  }
]
```

## Teszteles es build

Backend tesztek:

```bash
cd backend
npm test
```

Backend build:

```bash
cd backend
npm run build
```

Frontend build:

```bash
cd frontend
npm run build
```

## Beadando kovetelmenyek

- Forraskod: `backend/`, `frontend/`
- Git repository: `.git`
- SQL script: `backend/drizzle/0000_tough_revanche.sql`
- Dokumentacio: `README.md`
- Docker konfiguracio: `backend/Dockerfile`, `frontend/Dockerfile`, `docker-compose.yml`

## Megvalositott kiegeszito funkciok

- Autentikacio JWT-vel.
- ORM rendszer: Drizzle ORM.
- Kontenerizacio Dockerrel es Docker Compose-zal.
