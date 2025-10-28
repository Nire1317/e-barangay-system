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

└── E-Barangay-System/
├── .env
├── .gitattributes
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── vite.config.js
├── src/
│ ├── App.css
│ ├── App.jsx
│ ├── index.css
│ ├── main.jsx
│ ├── utils/
│ │ └── permissions.js
│ ├── style/
│ │ └── globals.css
│ ├── services/
│ │ ├── requestService.js
│ │ └── supabaseClient.js
│ ├── router/
│ │ └── AppRouter.jsx
│ ├── pages/
│ │ ├── NotFound.jsx
│ │ ├── SignIn.jsx
│ │ ├── residents/
│ │ │ └── Dashboard.jsx
│ │ └── officials/
│ │ └── AdminDashboard.jsx
│ ├── hooks/
│ │ ├── useAuth.jsx
│ │ └── usePermissions.js
│ ├── config/
│ │ └── rbac.js
│ ├── components/
│ │ ├── PermissionGate.jsx
│ │ └── ProtectedRoute.jsx
│ └── assets/
│ └── react.svg
└── public/
└── vite.svg

# Schema

-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.activity_logs (
log_id uuid NOT NULL DEFAULT uuid_generate_v4(),
user_id uuid NOT NULL,
action character varying NOT NULL,
details text,
created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT activity_logs_pkey PRIMARY KEY (log_id),
CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);
CREATE TABLE public.request_types (
type_id integer NOT NULL DEFAULT nextval('request_types_type_id_seq'::regclass),
type_name character varying NOT NULL,
description text,
CONSTRAINT request_types_pkey PRIMARY KEY (type_id)
);
CREATE TABLE public.requests (
request_id uuid NOT NULL DEFAULT uuid_generate_v4(),
resident_id uuid NOT NULL,
type_id integer NOT NULL,
purpose text,
status character varying DEFAULT 'Pending'::character varying CHECK (status::text = ANY (ARRAY['Pending'::character varying, 'Approved'::character varying, 'Denied'::character varying, 'Completed'::character varying]::text[])),
submitted_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
reviewed_by uuid,
reviewed_at timestamp without time zone,
remarks text,
CONSTRAINT requests_pkey PRIMARY KEY (request_id),
CONSTRAINT requests_resident_id_fkey FOREIGN KEY (resident_id) REFERENCES public.residents(resident_id),
CONSTRAINT requests_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.request_types(type_id),
CONSTRAINT requests_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(user_id)
);
CREATE TABLE public.residents (
resident_id uuid NOT NULL DEFAULT uuid_generate_v4(),
user_id uuid NOT NULL,
address text NOT NULL,
birthdate date,
contact_number character varying,
gender character varying CHECK (gender::text = ANY (ARRAY['Male'::character varying, 'Female'::character varying, 'Other'::character varying]::text[])),
civil_status character varying CHECK (civil_status::text = ANY (ARRAY['Single'::character varying, 'Married'::character varying, 'Widowed'::character varying, 'Separated'::character varying]::text[])),
occupation character varying,
household_no character varying,
created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT residents_pkey PRIMARY KEY (resident_id),
CONSTRAINT residents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);
CREATE TABLE public.users (
user_id uuid NOT NULL,
full_name character varying NOT NULL,
email character varying NOT NULL UNIQUE,
role character varying DEFAULT 'resident'::character varying CHECK (role::text = ANY (ARRAY['resident'::character varying, 'official'::character varying]::text[])),
created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT users_pkey PRIMARY KEY (user_id),
CONSTRAINT users_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
