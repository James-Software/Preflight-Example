const { test } = require("node:test");
const assert = require("node:assert/strict");
const { load } = require("./load-module.cjs");
const request = body => new Request("http://localhost:3000/api/waitlist", { method: "POST", body: JSON.stringify(body) });
const handler = saveWaitlistEmail => load("src/app/api/waitlist/route.ts", { "@/lib/waitlist": { saveWaitlistEmail } }).POST;

test("the API normalizes the email and awaits persistence before acknowledging success", async () => {
  let release, saved, finished = false;
  const post = handler(async email => { saved = email; await new Promise(resolve => { release = resolve; }); });
  const response = post(request({ email: " Demo@Example.com " })).then(r => { finished = true; return r; });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(saved, "demo@example.com");
  assert.equal(finished, false);
  release();
  assert.equal((await response).status, 201);
});
test("invalid input and malformed requests cannot reach persistence", async () => {
  let calls = 0;
  const post = handler(async () => { calls++; });
  for (const body of [{ email: "wrong" }, {}, { email: "" }, { email: "x@example.com", admin: true }])
    assert.equal((await post(request(body))).status, 400);
  assert.equal((await post(new Request("http://localhost:3000/api/waitlist", { method: "POST", body: "{" }))).status, 400);
  assert.equal(calls, 0);
});
test("database failure returns an error instead of the success message", async () => {
  const response = await handler(async () => { throw new Error("private database connection details"); })(request({ email: "demo@example.com" }));
  assert.equal(response.status, 503);
  assert.doesNotMatch(await response.text(), /private database|entered the waitlist/);
});
test("the save uses a bound parameter and safely handles duplicate emails", async () => {
  let statement, parameters;
  const api = load("src/lib/waitlist.ts", { "server-only": {}, "@/lib/db": { getSql: () => async (parts, ...values) => { statement = parts.join("?"); parameters = values; } } });
  await api.saveWaitlistEmail("demo@example.com");
  assert.match(statement, /INSERT INTO waitlist_entries/);
  assert.match(statement, /ON CONFLICT \(email\) DO NOTHING/);
  assert.doesNotMatch(statement, /demo@example.com/);
  assert.deepEqual(parameters, ["demo@example.com"]);
});
test("foreign-origin writes are rejected", async () => {
  const req = new Request("http://localhost:3000/api/waitlist", { method: "POST", headers: { Origin: "https://other.test" }, body: JSON.stringify({ email: "demo@example.com" }) });
  const response = await handler(async () => assert.fail("Must not save"))(req);
  assert.equal(response.status, 403);
});
