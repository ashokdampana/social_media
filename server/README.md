# server

To install dependencies:

```bash
bun install
```

Before starting, configure:

- `MONGODB_URI` with the MongoDB connection string.
- `JWT_SECRET` with a strong secret used to sign auth cookies.
- `PORT` (optional; defaults to `3000`).

The server validates its required configuration and connects to MongoDB before accepting requests. The Vite client proxies `/api` to `http://localhost:3000` during development.

To run:

```bash
bun run index.ts
```

To type check:

```bash
bun check
```

Run `bun fmt` to format the code.

This project was created using `bun init` in bun v1.4.4. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
