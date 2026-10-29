# PreFlight demo brief

Connect the demo repository and its deployed URL. Use a dedicated test email.

**User story:** When a visitor joins the waitlist with a valid email, the app saves one matching email to `waitlist_entries` before reporting success. Invalid input must not create records, and failed saves must not show success or discard the entered email.

**Expected check:** Submit a fresh valid email, observe the notification, then verify the matching row exists in the connected demo database. Appropriate access to that separate database is required; browser UI alone cannot establish whether a write happened.

Example read-only query with a bound email parameter:

```sql
SELECT count(*)::int FROM waitlist_entries WHERE email = $1;
```

Use PreFlight’s database settings to configure the supported bound assertion for your deployment; do not embed database credentials in the test prompt or browser code. If the automatic browser plan does not target signup, supply the user story above as the test goal.

The seeded source code omits the form-to-server request. The API itself provides the real insert operation. After a repair, a fresh signup should create a row, and a failed save should leave the email in the field.
