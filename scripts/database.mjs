import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

const [command, emailArgument] = process.argv.slice(2);
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing. Add your demo database URL to .env.local first.");
  process.exit(1);
}
const sql = neon(process.env.DATABASE_URL);
try {
  if (command === "setup") {
    await sql.query(await readFile(new URL("../database/schema.sql", import.meta.url), "utf8"));
    console.log("waitlist_entries is ready.");
  } else if (command === "check") {
    const email = emailArgument?.trim().toLowerCase();
    if (!email) throw new Error("Usage: npm run db:check -- person@example.com");
    const rows = await sql`SELECT count(*)::int AS matches FROM waitlist_entries WHERE email = ${email}`;
    console.log(JSON.stringify({ email, persisted: Number(rows[0].matches) > 0, matches: Number(rows[0].matches) }, null, 2));
  } else {
    throw new Error("Choose setup or check.");
  }
} catch {
  console.error("Database operation failed. Check the command, connection, permissions and schema. No persistence result was established.");
  process.exitCode = 1;
}
