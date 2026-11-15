import app from "./src/app";
import { connectToDatabase } from "./src/db";

const PORT = Number(Bun.env.PORT ?? 3000);

await connectToDatabase();

export default {
    port: PORT,
    fetch: app.fetch
}
console.log(`Server started on port ${PORT}`);
