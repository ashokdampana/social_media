import app from "./src/app";
import { connectToDatabase } from "./src/db";

if (!Bun.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required to start the server');
}

const PORT = Number(Bun.env.PORT ?? 3000);

await connectToDatabase();

export default {
    port: PORT,
    fetch: app.fetch
}
console.log(`Server started on port ${PORT}`);
