# 04 — API Documentation

Base URL in development: `http://localhost:5000/api`. The hosted base URL is the deployed backend URL plus `/api`.

JSON requests use `Content-Type: application/json`. Protected routes require `Authorization: Bearer <token>`. Grievance submission uses `multipart/form-data` when an attachment is supplied.

## Authentication

| Method and path | Access | Parameters/body | Success |
|---|---|---|---|
| `POST /auth/register` | Public | JSON: `name`, `email`, `mobile`, `password` | `201 { token, user }` |
| `POST /auth/login` | Public | JSON: `email`, `password` | `200 { token, user }` |
| `GET /auth/me` | Authenticated | Bearer token | `200 { user }` |

Registration validation: valid email, 10-digit Indian mobile starting 6–9, password at least 6 characters. CMO and officer accounts are provisioned by an administrator/seed script, not public registration.

Example login request:

```json
{ "email": "citizen@demo.test", "password": "Citizen@123" }
```

Example login response:

```json
{
  "token": "<jwt-token>",
  "user": { "id": "<user-id>", "name": "Demo Citizen", "email": "citizen@demo.test", "mobile": "9000000002", "role": "citizen", "department": null }
}
```

## Public endpoints

| Method and path | Access | Parameters/body | Success |
|---|---|---|---|
| `GET /departments` | Public | None | Array of departments (`_id`, `code`, `name`, `category`, `description`). |
| `GET /meta` | Public | None | `{ districts: string[], categories: string[] }`. |
| `GET /public-stats` | Public | None | `{ total, resolved, pending, departments }`. |
| `POST /contact` | Public | JSON: `name`, `email`, `subject`, `message` | `201 { message }`. |

Contact example:

```json
{ "name": "Demo User", "email": "demo@example.test", "subject": "Portal question", "message": "Please share more information." }
```

## AI analysis

| Method and path | Access | Parameters/body | Success |
|---|---|---|---|
| `POST /ai/analyze` | Citizen or CMO | JSON: `description` (at least 20 characters), optional `district` | `{ department, category, priority, summary, source, note, possibleDuplicates }`. |

The endpoint returns a suggestion. A Gemini failure or missing key falls back to keywords; the response `source` indicates the path.

## Grievances

| Method and path | Access | Parameters/body | Success |
|---|---|---|---|
| `POST /grievances` | Citizen | Multipart: `district`, `category`, `subject`, `description`, optional `priority`, optional JSON string `aiSuggestion`, optional file `attachment` | `201 { message, refId, id }`. |
| `GET /grievances/track/:refId` | Public, limited fields | Path: reference ID | Public tracking record with status, department and history. |
| `GET /grievances` | Authenticated | Query: `district`, `category`, `priority`, `status`, `overdue=true`, `q` | Role-filtered grievance array (up to 500). |
| `GET /grievances/:id` | Authorized role | Path: grievance ID | Grievance details with role-based field filtering. |
| `GET /grievances/:id/attachments/:filename` | Authorized role | Path: grievance ID and stored filename | Attachment file if present. |
| `PUT /grievances/:id/assign` | CMO | JSON: `departmentId`, optional `officerId`, `remark`, `priority`, `category` | Updated grievance. |
| `PUT /grievances/:id/status` | CMO or officer | JSON: `status`, optional `remark` | Updated grievance. Officers may only set `In Progress` and must provide a remark. |
| `POST /grievances/:id/remarks` | CMO | JSON: `text` | `201 { internalRemarks }`. |
| `PUT /grievances/:id/escalate` | CMO | JSON: optional `remark` | `{ message, escalated }`; priority becomes High. |
| `POST /grievances/:id/action-report` | Officer | JSON: `text` (minimum 10 characters) | `{ message, actionReport }`. |
| `PUT /grievances/:id/review` | CMO | JSON: `decision` (`resolve` or `sendback`), optional `remark` | Updated grievance. |
| `POST /grievances/:id/feedback` | Owning citizen | JSON: `rating` (1–5), optional `comment` | `201 { feedback }`; only after resolution and once. |
| `POST /grievances/:id/reopen` | Owning citizen | JSON: `remark` | `{ message, status }`; only for resolved grievance. |

Submission example (text fields; use multipart form if uploading):

```json
{
  "district": "Ernakulam",
  "category": "Water Supply",
  "subject": "No water supply for four days",
  "description": "Our ward has had no drinking water supply for four days. Please inspect the supply line and resolve the issue.",
  "priority": "High",
  "aiSuggestion": "{\"department\":\"Kerala Water Authority\",\"category\":\"Water Supply\",\"priority\":\"High\",\"source\":\"fallback-keyword\"}"
}
```

Example successful submission response:

```json
{ "message": "Grievance submitted", "refId": "CMK2026-123456", "id": "<grievance-id>" }
```

## CMO administration

| Method and path | Access | Parameters/body | Success |
|---|---|---|---|
| `GET /admin/stats` | CMO | None | Totals and chart series: `total`, `resolved`, `pending`, `overdue`, `unassigned`, `awaitingReview`, `byStatus`, `byDistrict`, `byCategory`, `byDepartment`. |
| `GET /admin/officers?department=<id>` | CMO | Optional department ID query | Array of officer `name`, `email`, and `department`. |

## Common errors

Errors use JSON such as `{ "message": "Invalid district" }`. Common HTTP statuses include `400` validation error, `401` missing/invalid token or login, `403` disallowed role/record, `404` missing record, and `409` duplicate registration email. Login attempts are rate limited.
