# Social Media

A full-stack social media application for creating accounts, publishing posts, and reading the feed.

## Tech Stack

- **Client:** React, TypeScript, Vite, React Router, Zustand, Axios, Zod
- **Server:** Bun, Hono, Mongoose, Zod
- **Database:** MongoDB / MongoDB Atlas

## Features

- User registration and login
- JWT-based authentication
- Create and view posts
- View comments
- Protected application routes

## Prerequisites

- [Bun](https://bun.sh/)
- [MongoDB](https://www.mongodb.com/) or a MongoDB Atlas connection string

## Local Setup

Clone the repository and install dependencies in both applications:

```powershell
git clone https://github.com/ashokdampana/social_media.git
cd social_media
bun install
cd client
npm install
cd ../server
bun install
```

Configure the environment:

```powershell
Copy-Item client\.env.example client\.env
Copy-Item server\.env.example server\.env
```

Update the values in `server/.env`, especially `JWT_SECRET` and `MONGODB_URI`.

Start MongoDB locally, or use MongoDB Atlas. Then run the server and client in separate terminals:

```powershell
# Terminal 1
cd server
bun run dev
```

```powershell
# Terminal 2
cd client
npm run dev
```

- Client: http://localhost:5173
- API: http://localhost:5000

## Scripts

### Client

```powershell
cd client
npm run dev
npm run build
npm run lint
npm run preview
```

### Server

```powershell
cd server
bun run dev
bun run start
bun run test
bun run typecheck
```

## Project Structure

```text
client/   React frontend
server/   Hono API and MongoDB integration
```

## Deployment

Deploy the client and server as separate projects. Set `VITE_API_URL` in the client to the public API URL ending in `/api`, and configure the server's `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, and `PORT` values as environment variables.
