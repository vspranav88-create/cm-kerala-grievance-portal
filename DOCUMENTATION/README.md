# CM Kerala Grievance Portal Documentation

This folder contains the project documentation and diagrams for the CM Kerala grievance portal recruitment prototype. The project is a demonstration and is not affiliated with the Government of Kerala.

## Required submission documents

- [01 Project Overview](01_Project_Overview.md): problem statement, objectives, scope and features.
- [02 System Architecture](02_System_Architecture.md): frontend, backend, database, APIs, AI and system/workflow diagrams.
- [03 Database Design](03_Database_Design.md): entities, schema and ER diagram.
- [04 API Documentation](04_API_Documentation.md): endpoints, access roles, parameters and request/response examples.
- [05 AI Integration](05_AI_Integration.md): model, prompt/workflow, fallback, limitations and safeguards.
- [06 Setup and Testing](06_Setup_and_Testing.md): installation, configuration, environment variables and manual test cases.
- [07 User Guide](07_User_Guide.md): citizen, CMO and officer workflows.
- [Deployment guide](deployment-guide.md): Render and Vercel deployment steps.

The older architecture, database-design, API-reference and demo-guide files are supplementary notes. The numbered documents above are the canonical submission set.

## Run locally

1. Start MongoDB and configure `backend/.env` using `backend/.env.example` as a template.
2. In `backend`, run `npm install` and then `npm start` (or `npm run dev`). The API listens on port `5000` by default.
3. In `frontend`, run `npm install` and then `npm run dev`. Vite normally serves the UI at `http://localhost:5173`.
4. Configure the frontend API URL using `frontend/.env.example` if the backend is hosted at a different address.

Never place live passwords, database credentials, JWT secrets, or AI API keys in this folder or commit them to the repository. Commit only the `.env.example` files.

## Demo accounts

These are fictional test accounts. Demo password for each account is `Officer@123`.

| Role | Email | Password |
|---|---|---|
| CMO | `cmo@demo.test` | `Cmo@12345` |
| PWD Officer | `pwd@demo.test` | `Officer@123` |
| Health Officer | `health@demo.test` | `Officer@123` |
| KWA Officer | `kwa@demo.test` | `Officer@123` |

The demo accounts must be created in the same MongoDB database configured for the deployed backend. Do not use real citizen information in a demonstration.

## Important implementation note

AI classification is advisory. If a Gemini key is not configured or the AI request fails, the backend uses a keyword-based fallback. CMO staff remain responsible for reviewing and assigning grievances.
