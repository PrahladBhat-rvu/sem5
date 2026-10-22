# Campus Lost & Found Management System

A full-stack Node.js, Express, EJS, MongoDB and Mongoose application implementing the supplied two-phase assignment.

## Features

- Student profile creation, unique email validation, directory, dynamic profile pages and demo profile switching.
- Create, list, search/filter and view lost-item reports.
- Create, list, search/filter and view found-item reports.
- Claims linked to a found item and the claiming student.
- Claims start as `Pending`; only the student who reported the found item can approve/reject.
- Approving a claim marks the item `Returned` and rejects other pending claims.
- Returned items cannot be claimed again; a student cannot claim their own found report.
- Duplicate claims prevented by a MongoDB compound unique index.
- EJS empty states, flash messages, invalid-ID/missing-record handling, and responsive UI.
- `/health` endpoint reports app/database connection state.

## Requirements

- Node.js 18+ (Node.js 20 LTS recommended)
- MongoDB Community Server running locally, or a MongoDB Atlas connection string
- npm

## Setup

1. Extract the ZIP and open a terminal in the project directory.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env`.

   Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

   Windows Command Prompt:

   ```cmd
   copy .env.example .env
   ```

4. Set `MONGODB_URI` in `.env`. For local MongoDB, use:

   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/campus_lost_found
   SESSION_SECRET=replace-with-a-long-random-secret
   PORT=3000
   ```

   If using MongoDB Atlas, replace the URI with your Atlas connection string and ensure your IP is allowed in Atlas Network Access. Never commit `.env`.

5. Start the server:

   ```bash
   npm run dev
   ```

   Or use `npm start`.

6. Open `http://localhost:3000`.

The server starts only after MongoDB connects. Check `http://localhost:3000/health` to verify the connection.

## Suggested demonstration

1. Create Student A and report a found item.
2. Open the student directory and switch to Student B.
3. Open the found item and submit a claim with a specific reason.
4. Switch back to Student A and open the found item.
5. Approve the claim. Confirm the item shows `Returned` and the claim shows `Approved`.
6. Try submitting another claim as Student B. It should be blocked.
7. Try changing the claim status while acting as Student B. The backend should reject the request with HTTP 403.

## Data relationships

- `Student` 1-to-many `LostItem` via `LostItem.reportedBy`.
- `Student` 1-to-many `FoundItem` via `FoundItem.reportedBy`.
- `Student` 1-to-many `Claim` via `Claim.claimedBy`.
- `FoundItem` 1-to-many `Claim` via `Claim.foundItemId`.

All relationships use MongoDB ObjectIds and Mongoose references.

## Route list

| Method | Route | Purpose |
|---|---|---|
| GET | `/` | Dashboard |
| GET | `/students` | Student directory |
| GET | `/students/new` | Student creation form |
| POST | `/students` | Create student |
| GET | `/students/:id` | Student profile |
| POST | `/session/student` | Select demo student |
| POST | `/session/logout` | Clear selected student |
| GET | `/lost-items` | List/search lost items |
| GET | `/lost-items/new` | Lost-item form |
| POST | `/lost-items` | Create lost report |
| GET | `/lost-items/:id` | Lost-item details |
| GET | `/found-items` | List/search/filter found items |
| GET | `/found-items/new` | Found-item form |
| POST | `/found-items` | Create found report |
| GET | `/found-items/:id` | Found-item details and claims |
| POST | `/found-items/:id/claims` | Submit a claim |
| PATCH | `/claims/:id/status` | Approve/reject a claim |
| PATCH | `/found-items/:id/status` | Restricted item status update |
| GET | `/health` | Health/database status |

## Test checklist

- [ ] Create a student with valid fields.
- [ ] Attempt duplicate student email.
- [ ] Open a malformed student/item/claim ID.
- [ ] Open a valid-looking ID for a record that does not exist.
- [ ] Submit an empty/invalid report.
- [ ] Submit a claim with a reason shorter than 10 characters.
- [ ] Submit a claim twice from the same student for the same found item.
- [ ] Attempt to claim an item as the student who reported it.
- [ ] Attempt to claim a returned item.
- [ ] Attempt approval/rejection as a student other than the item reporter.
- [ ] Approve a claim and verify item status changes to `Returned` and other pending claims are rejected.

## Notes

- Profile switching is a classroom/demo convenience, **not production authentication**. A real deployment needs authenticated accounts, authorization, CSRF protection, secure production session storage, HTTPS and rate limiting.
- For reliable production-grade atomicity across item and claim changes, use a MongoDB replica set transaction. The current implementation uses a conditional item update and guarded status transitions, suitable for a local assignment demo but not a full concurrent production workflow.
- A few decorative objects on the home page are UI illustration only; all counts and actual report cards come from MongoDB.
