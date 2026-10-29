import { z } from "zod";
import { saveWaitlistEmail } from "@/lib/waitlist";

const signup = z.object({ email: z.string().trim().toLowerCase().max(254).pipe(z.email()) }).strict();

export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return Response.json({ error: "Invalid request origin." }, { status: 403, headers });
  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > 2048)
      return Response.json({ error: "Request too large." }, { status: 413, headers });
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: "Send a valid email address." }, { status: 400, headers });
  }
  const result = signup.safeParse(body);
  if (!result.success)
    return Response.json({ error: "Enter a valid email address." }, { status: 400, headers });

  try {
    await saveWaitlistEmail(result.data.email);
    return Response.json({ message: "You have entered the waitlist!" }, { status: 201, headers });
  } catch {
    return Response.json({ error: "We couldn’t save your email. Please try again." }, { status: 503, headers });
  }
}
