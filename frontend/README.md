# CM Kerala Grievance Portal frontend

React and Vite frontend adapted from the bookstore starter. Styling uses Tailwind utility classes; `src/index.css` only imports Tailwind.

## Run locally

1. Keep the backend running on `http://localhost:5000`.
2. In this folder, run `npm install`.
3. Run `npm run dev` and open the Vite URL (usually `http://localhost:5173`).

The API defaults to `http://localhost:5000/api`. To use another API URL, copy `.env.example` to `.env` and set `VITE_API_URL`.

## Beginner code map

- `src/App.jsx` keeps the shared page state and backend request functions.
- `src/pages/` contains one React component for each page.
- `src/components/` contains small pieces reused by several pages, such as forms and tracking.
- Put Tailwind classes in `className` to style elements. There are no custom page stylesheets.

Citizen registration and sign-in use the backend API. Demo CMO and officer accounts are set up with the backend's safe helper scripts.
