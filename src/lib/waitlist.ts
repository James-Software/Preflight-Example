import "server-only";
import { getSql } from "@/lib/db";

export async function saveWaitlistEmail(email: string) {
  const sql = getSql();
  await sql`INSERT INTO waitlist_entries (email) VALUES (${email}) ON CONFLICT (email) DO NOTHING`;
}
