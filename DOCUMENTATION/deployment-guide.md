# Deployment Guide (GitHub + Render + Vercel + MongoDB Atlas)

This project is organized as a monorepo with `backend/` and `frontend/` application roots. Deployment requires a GitHub repository and accounts for the selected hosting providers. Never commit `.env`; the root `.gitignore` excludes local environment files.

## 1. Push the source to GitHub

Create a private or public GitHub repository, then upload only the intended `backend/`, `frontend/`, and `DOCUMENTATION/` folders, plus the root `.gitignore` and any root README. Do not upload local `.env` files, `node_modules`, or zip backups. Check the pending file list before publishing.

## 2. Confirm MongoDB Atlas access

Use a dedicated application database user and the production connection string as the backend's `MONGO_URI`. Ensure Atlas network access allows connections from the backend host. A broad `0.0.0.0/0` allow rule is convenient for a short demo but permits connection attempts from any IP; use a narrower provider IP range or private networking when available. Keep strong database credentials and never include them in GitHub.

## 3. Deploy the Express backend on Render

Create a Render **Web Service** connected to the GitHub repository and set:

- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Health Check Path:** `/`

Add these environment variables in Render's service settings:

| Key | Value |
|---|---|
| `MONGO_URI` | Production Atlas connection string |
| `JWT_SECRET` | A long, random secret (generate a new production value) |
| `CLIENT_URL` | The deployed Vercel frontend URL, e.g. `https://your-site.vercel.app` |
| `GEMINI_API_KEY` | Optional; leave blank to use keyword fallback |
| `GEMINI_MODEL` | `gemini-3.5-flash` when using a Gemini key |

Render supplies `PORT`; the backend reads it automatically. After deployment, open the Render service URL in a browser. The root should return a JSON message indicating the API is running. Copy this URL for the frontend configuration.

## 4. Deploy the React frontend on Vercel

Import the same GitHub repository into Vercel and set:

- **Root Directory:** `frontend`
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

Add this environment variable before deploying:

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://YOUR-RENDER-SERVICE.onrender.com/api` |

The included `frontend/vercel.json` rewrites frontend routes to the React entry page. After the frontend has a URL, update Render's `CLIENT_URL` to that exact origin, save, and redeploy the backend.

## 5. Populate demo data and verify the hosted app

Run database seeding only against the dedicated demo database. Seeding may delete existing records. Create/confirm demo CMO and officer users in that same database. Then check the deployed frontend can:

1. Load departments and public statistics.
2. Register/sign in as a fictional citizen and submit a grievance.
3. Track the grievance using its reference ID.
4. Sign in as CMO, assign it, and update status.
5. Sign in as the corresponding department officer and submit an action report.
6. Submit the contact form and check it is accepted.

Do not record or submit until all demo accounts use the deployed database and the deployed flows have been manually checked. Record the 3–5 minute demonstration after successful verification.

## Hosting notes

- Render free services may sleep when idle and take time to wake for evaluators. Confirm current plan behavior before relying on it for a deadline-critical demo.
- Files saved under `backend/uploads` are local to the service instance and may not persist across redeploys or restarts. For durable attachment storage, configure an object storage provider before promising permanent file availability.
- Changing `VITE_API_URL` requires a new frontend build/deployment because Vite embeds the value in built assets.
