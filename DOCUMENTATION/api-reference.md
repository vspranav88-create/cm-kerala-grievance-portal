# API Reference

Base URL for local development: `http://localhost:5000/api`. JSON endpoints use `Content-Type: application/json`; grievance submission may use `multipart/form-data` when attaching a file. Protected endpoints require `Authorization: Bearer <token>`.

## Authentication — `/auth`

| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a citizen account. |
| POST | `/auth/login` | Public | Authenticate and receive a token. |
| GET | `/auth/me` | Authenticated | Return the current account. |

## Public information

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/departments` | Public | List departments. |
| GET | `/meta` | Public | Return districts and grievance categories. |
| GET | `/public-stats` | Public | Return public portal statistics. |
| POST | `/contact` | Public | Save a contact enquiry. |

## Grievances — `/grievances`

| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | `/grievances` | Citizen | Submit a grievance, optionally with an attachment. |
| GET | `/grievances/track/:refId` | Public | Retrieve tracking information by reference ID. |
| GET | `/grievances` | Authenticated | List grievances permitted for the current role. |
| GET | `/grievances/:id` | Authorized user | Get grievance details. |
| GET | `/grievances/:id/attachments/:filename` | Authorized user | Access an attachment. |
| PUT | `/grievances/:id/assign` | CMO | Assign/forward a grievance to a department/officer. |
| PUT | `/grievances/:id/status` | CMO or officer | Update grievance status. |
| POST | `/grievances/:id/remarks` | CMO | Add an internal remark. |
| PUT | `/grievances/:id/escalate` | CMO | Escalate a grievance. |
| POST | `/grievances/:id/action-report` | Officer | Submit a department action report. |
| PUT | `/grievances/:id/review` | CMO | Review an officer action report. |
| POST | `/grievances/:id/feedback` | Citizen | Submit feedback for a grievance. |
| POST | `/grievances/:id/reopen` | Citizen | Request reopening of a resolved grievance. |

## AI and administration

| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | `/ai/analyze` | Citizen or CMO | Return an AI suggestion or keyword fallback. |
| GET | `/admin/stats` | As implemented in route | Return dashboard statistics. |
| GET | `/admin/officers` | As implemented in route | List officer accounts. |

Route-level authorization is enforced by backend middleware. For exact request fields and response shapes, see the corresponding implementation under `backend/routes/`.
