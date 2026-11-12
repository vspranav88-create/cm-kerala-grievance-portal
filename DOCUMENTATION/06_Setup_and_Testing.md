# 06 — Setup and Testing

## Requirements

- Node.js and npm.
- MongoDB local instance or MongoDB Atlas database.
- Optional: Gemini API key for live AI suggestions. The app uses keyword fallback without it.

## Install and run

1. Clone the repository and open its root folder.
2. Backend: copy `backend/.env.example` to `backend/.env`; set `MONGO_URI` and a strong `JWT_SECRET`. Set `CLIENT_URL` to the frontend origin. Set `GEMINI_API_KEY` only if enabling Gemini.
3. In a terminal: `cd backend`, `npm install`, `npm run dev`. The API defaults to port 5000 and waits for MongoDB to connect.
4. Frontend: copy `frontend/.env.example` to `frontend/.env`. Set `VITE_API_URL` to `http://localhost:5000/api` for local development.
5. In a second terminal: `cd frontend`, `npm install`, `npm run dev`; open the URL printed by Vite (usually `http://localhost:5173`).

The root `.env.example` is a reference only. The backend and frontend read separate environment files. Never commit real `.env` files or secrets.

## Environment variables

| Variable | App | Required | Purpose |
|---|---|---:|---|
| `PORT` | Backend | No | Server port; hosting platforms provide this. Local default is 5000. |
| `MONGO_URI` | Backend | Yes | MongoDB connection string. |
| `JWT_SECRET` | Backend | Yes | Secret used to sign authentication tokens. Use a long random value. |
| `CLIENT_URL` | Backend | No | Allowed frontend origin(s); comma-separated values are supported by current server configuration. |
| `GEMINI_API_KEY` | Backend | No | Enables Gemini classification. Empty means fallback is used. |
| `GEMINI_MODEL` | Backend | No | Gemini model ID; example: `gemini-3.5-flash`. |
| `VITE_API_URL` | Frontend | No | API base URL; local default is `http://localhost:5000/api`. |

## Demo data warning

`npm run seed` deletes all users, departments, grievances and contact enquiries in the configured database, then inserts fictional demo records. Use it only with a dedicated empty/demo database. Demo staff accounts can also be created with the helper scripts under `backend/scripts/`.

## Manual test cases

These are suggested checks for a local or hosted build. Record the actual result/date before submission; this document does not claim these cases have already been run.

| ID | Test | Expected result |
|---|---|---|
| TC-01 | Open public home and department pages. | Pages load; department list and public statistics appear. |
| TC-02 | Submit contact form with all valid fields. | Success message appears and enquiry is saved. |
| TC-03 | Register a citizen using valid name, email, mobile and password. | Account is created and a token/user response is returned. |
| TC-04 | Register again with the same email. | Request is rejected with a duplicate email message. |
| TC-05 | Citizen submits valid grievance without file. | Grievance is saved with reference ID and initial history. |
| TC-06 | Citizen submits grievance with allowed JPG/PNG/PDF under 5 MB. | File metadata is saved and authorized user can access the attachment. |
| TC-07 | Submit invalid district/category or too-short description. | API returns validation error; no grievance is created. |
| TC-08 | Track an existing reference ID. | Limited tracking details and history are returned. |
| TC-09 | Request AI analysis with Gemini key absent. | Keyword fallback returns suggestion and identifies fallback source. |
| TC-10 | CMO assigns grievance to a department/officer. | Assignment, status and history update; invalid department/officer is rejected. |
| TC-11 | Officer submits action report; CMO resolves it. | Report awaits review, then grievance becomes Resolved after CMO decision. |
| TC-12 | Citizen gives feedback and reopens resolved case. | Valid feedback is saved once; reopening changes status and adds history. |
| TC-13 | Access protected route without token or as wrong role. | API returns 401 or 403 and does not expose unauthorized details. |

## Test execution record

| Date | Environment / URL | Cases run | Result / notes |
|---|---|---|---|
| _Fill in after manual verification_ |  |  |  |
