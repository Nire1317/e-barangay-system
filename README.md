# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# File Structure

E-BARANGAY-SYSTEM/
│
│
├── public/
│ ├── favicon.ico
│ └── index.html
│
├── src/
│ ├── assets/ # (optional) images, icons, logos
│ │ └── logo.png
│ │
│ ├── components/ # Reusable UI components
│ │ ├── Navbar.jsx
│ │ ├── ProtectedRoute.jsx
│ │ └── RequestCard.jsx
│ │
│ ├── pages/ # Page-level components (screens)
│ │ ├── Auth.jsx # Login / Signup page
│ │ ├── Dashboard.jsx # Resident main page (form submission)
│ │ ├── Requests.jsx # Resident request history
│ │ ├── AdminDashboard.jsx # Admin (Captain/Secretary) view
│ │ └── NotFound.jsx
│ │
│ ├── hooks/ # Custom React hooks
│ │ └── useAuth.js # Manage logged-in state & Supabase session
│ │
│ ├── context/ # Global context providers (if needed)
│ │ └── AuthContext.jsx
│ │
│ ├── services/ # API & data layer for Supabase interactions
│ │ ├── supabaseClient.js # Supabase initialization
│ │ ├── userService.js # CRUD for user/resident
│ │ └── requestService.js # CRUD for request submissions
│ │
│ ├── style/ # Custom global or component styles
│ │ ├── globals.css
│ │ └── form.css
│ │
│ ├── router/ # App routes configuration
│ │ └── AppRouter.jsx
│ │
│ ├── App.jsx # Main app wrapper
│ ├── main.jsx # React entry point
│ └── index.css # Tailwind entry point
│
├── .env.local # Supabase keys (never commit this)
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
