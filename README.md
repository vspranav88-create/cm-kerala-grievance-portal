# CM Kerala – Public Grievance Portal

A MERN-stack recruitment prototype for citizens to submit and track grievances, CMO administrators to review and route them, and department officers to report actions taken. This project is a demonstration and is **not an official Government of Kerala service**.

## Features

- Public pages for Home, About, How It Works, Departments, Contact and FAQ.
- Citizen registration, sign-in, grievance submission, reference-number tracking, feedback and reopening.
- CMO dashboard for reviewing, assigning, escalating and monitoring grievances.
- Department officer dashboard for updating progress and submitting action reports.
- Optional Gemini classification suggestions with a keyword-based fallback.
- Contact enquiry persistence and optional JPG, PNG or PDF grievance attachment uploads (maximum 5 MB).

## Technology

- Frontend: React, Vite, Tailwind CSS, Axios.
- Backend: Node.js, Express, Mongoose, JWT, bcryptjs.
- Database: MongoDB.
- Optional AI: Gemini API, called from the backend only.

## Run locally

Requirements: Node.js with npm and a MongoDB database (local or Atlas).

1. Configure `backend/.env` using `backend/.env.example` as a template. Add a MongoDB URI and a long random JWT secret.
2. In a terminal, run `cd backend`, `npm install`, then `npm run dev`.
3. In a second terminal, run `cd frontend`, `npm install`, then `npm run dev`.
4. Open the Vite URL printed in the frontend terminal (normally `http://localhost:5173`).

For frontend API configuration, copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL` if the backend is not at `http://localhost:5000/api`.

## Demo accounts

Use fictional demo accounts only. These accounts must exist in the MongoDB database connected to the backend.

| Role | Email | Password |
|---|---|---|
| CMO administrator | `cmo@demo.test` | `Cmo@12345` |
| Citizen | `citizen@demo.test` | `Citizen@123` |
| PWD officer | `pwd@demo.test` | `Officer@123` |
| Health officer | `health@demo.test` | `Officer@123` |
| KWA officer | `kwa@demo.test` | `Officer@123` |

## Documentation

See [`DOCUMENTATION/`](DOCUMENTATION/README.md) for the project overview, architecture and database diagrams, API documentation, AI integration, setup and manual test cases, and role-based user guide.

## Safety and limitations

- Never commit `.env` files, database passwords, JWT secrets, or Gemini keys. The checked-in `.env.example` files contain placeholders only.
- Gemini output is only a suggestion and must be reviewed. The fallback classifier is keyword-based.
- Uploaded files are stored on the backend filesystem. Deployments with ephemeral disks may not retain attachments after a restart or redeploy.
- Use a separate demo database; `npm run seed` deletes existing records in the configured database before adding fictional sample records.
