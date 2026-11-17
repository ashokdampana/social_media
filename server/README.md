# server

To install dependencies:

```bash
bun install
```

Before starting, configure:

- `MONGODB_URI` with the MongoDB connection string.
- `JWT_SECRET` with a strong secret used to sign auth cookies.
- `CLIENT_URL` with the frontend origin (defaults to `http://localhost:5173` outside production).
- `PORT` (optional; defaults to `3000`).

Copy `.env.example` to `.env` for local development. The server validates its required configuration and connects to MongoDB before accepting requests. Set `VITE_API_URL` in `client/.env` to the server API URL; the client example uses `http://localhost:5000/api`.

To run:

```bash
bun run index.ts
```

To type check:

```bash
bun check
```

Run `bun fmt` to format the code.

## Deploy to Render

Create a **Web Service** from this repository and set its root directory to `server`.
Choose **Docker** as the runtime and deploy. Render supplies `PORT`; the server
uses it automatically.

Set these environment variables in Render:

- `MONGODB_URI`: your MongoDB connection string.
- `JWT_SECRET`: a strong, private signing secret.
- `CLIENT_URL`: the exact production Vercel origin, for example
  `https://your-project.vercel.app` (no trailing slash).

The client uses secure, cross-site cookies in production and rejects state-changing
requests unless their `Origin` matches `CLIENT_URL`.

After deployment, verify `https://<your-render-service>.onrender.com/api/health`.

This project was created using `bun init` in bun v1.4.4. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
