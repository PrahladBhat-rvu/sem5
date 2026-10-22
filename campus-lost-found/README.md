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

