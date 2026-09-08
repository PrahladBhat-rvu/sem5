# Full Stack Development - Lab Assignment

## Included
- Frontend implementation covering Tutorials 1-8 and the related frontend labs:
  - HTML structure, semantic HTML, lists/tables, forms
  - CSS fundamentals, box model, Flexbox, Grid
  - JavaScript variables, operators, functions, DOM manipulation
  - React with Vite-style structure, JSX, components, props, state, events
  - useState, useEffect, forms, conditional rendering
- Node.js/Express implementation with separate even-ID and odd-ID user routes.

## Run backend
```bash
cd backend
npm install
npm start
```

Backend:
- GET /api/users/even
- GET /api/users/odd

## Run frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend uses the browser fetch API to load the user data from the backend.
