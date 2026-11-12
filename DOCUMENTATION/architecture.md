# System Architecture and Workflow

## Components

- **React + Vite + Tailwind CSS frontend**: public information pages, citizen submission and tracking, and role-based CMO/officer dashboards.
- **Express API**: authentication, public endpoints, grievance workflow, uploads, administrative data, and optional AI analysis.
- **MongoDB + Mongoose**: users, departments, grievances, and contact enquiries.
- **Gemini API (optional)**: suggests a grievance department, category, priority, and summary. Keyword fallback is used when the key is missing or the request fails.

## Architecture diagram

```mermaid
flowchart LR
  Citizen[Citizen browser]
  Staff[CMO / Department officer browser]
  UI[React + Vite + Tailwind frontend]
  API[Express REST API]
  DB[(MongoDB)]
  AI[Gemini API - optional]
  Files[Backend attachment storage]

  Citizen --> UI
  Staff --> UI
  UI -->|HTTPS / JSON / multipart| API
  API --> DB
  API -. optional classification .-> AI
  API --> Files
```

## Grievance workflow

```mermaid
flowchart TD
  A[Citizen registers or signs in] --> B[Submits grievance and optional attachment]
  B --> C[Backend validates input and creates reference number]
  C --> D{Gemini key configured and request succeeds?}
  D -- Yes --> E[Save AI suggestion]
  D -- No --> F[Use keyword fallback]
  E --> G[CMO reviews grievance]
  F --> G
  G --> H[CMO selects department and assigns / forwards]
  H --> I[Department officer reviews and records action report]
  I --> J[CMO reviews report and updates status]
  J --> K[Citizen tracks status and history]
  K --> L{Resolved?}
  L -- No --> G
  L -- Yes --> M[Citizen may submit feedback or request reopening]
```

## Access and security

- JWT bearer tokens protect authenticated routes.
- Route middleware restricts actions to citizen, CMO, or officer roles.
- Passwords are hashed with bcrypt before storage.
- Helmet and CORS middleware are enabled in the Express app.
- The Gemini API key and database URI belong only in the backend environment.
- Public tracking is by grievance reference ID; private grievance details and attachments require authentication and authorization.
