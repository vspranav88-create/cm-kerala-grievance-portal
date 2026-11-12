# Evaluator Demo Guide (3–5 minutes)

Use fictional data only. Confirm the hosted frontend and backend are running and that the backend points to the intended demo MongoDB database before recording.

## Suggested walkthrough

1. **Public portal (30–45 seconds):** Show the home page, key navigation, department list, How It Works, and FAQ.
2. **Citizen workflow (60–90 seconds):** Sign in as a demo citizen, submit a sample grievance, note the generated reference ID, and show tracking/history. If Gemini is configured, show the suggestion as advisory; otherwise explain the keyword fallback.
3. **CMO workflow (60–90 seconds):** Sign in as CMO, open the submitted grievance, review it, assign it to the relevant department, and update its status.
4. **Officer workflow (60–90 seconds):** Sign in as the matching department officer, review the assignment, submit an action report, and show the resulting status/history.
5. **Close (15–30 seconds):** Return to tracking or dashboard to show the end-to-end flow and mention the technology stack.

## Demo credentials

| Role | Email | Password |
|---|---|---|
| CMO | `cmo@demo.test` | `Cmo@12345` |
| PWD Officer | `pwd@demo.test` | `Officer@123` |
| Health Officer | `health@demo.test` | `Officer@123` |
| KWA Officer | `kwa@demo.test` | `Officer@123` |

Citizen demo account (if present in the deployed database): `citizen@demo.test` / `Citizen@123`. Otherwise, register a fictional citizen account before recording.

## Recording and submission checklist

- Record a 3–5 minute screen capture with readable browser zoom and no visible secrets or personal information.
- Test each demo login against the deployed backend/database, not just localhost.
- Include the hosted application URL and GitHub repository URL in the submission message.
- Include evaluator demo logins and point to this `DOCUMENTATION` folder.
- Verify `.env` is ignored by Git and only `.env.example` files are committed.
- Ensure the deployed demo remains accessible to evaluators after submission.
