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
CREATE TABLE public.barangay_requests (
  request_id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  barangay_id uuid NOT NULL,
  status character varying DEFAULT 'Pending'::character varying CHECK (status::text = ANY (ARRAY['Pending'::character varying, 'Approved'::character varying, 'Rejected'::character varying]::text[])),
  requested_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  reviewed_at timestamp without time zone,
  rejection_reason text,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT barangay_requests_pkey PRIMARY KEY (request_id),
  CONSTRAINT barangay_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT barangay_requests_barangay_id_fkey FOREIGN KEY (barangay_id) REFERENCES public.barangays(barangay_id)
);
CREATE TABLE public.barangays (
  barangay_id uuid NOT NULL DEFAULT uuid_generate_v4(),
  barangay_name character varying NOT NULL UNIQUE,
  municipality character varying NOT NULL,
  province character varying NOT NULL,
  region character varying NOT NULL,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT barangays_pkey PRIMARY KEY (barangay_id)
);
CREATE TABLE public.document_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  request_id text NOT NULL UNIQUE,
  user_id text NOT NULL,
  document_type text NOT NULL,
  purpose text NOT NULL,
  date_requested timestamp with time zone DEFAULT now(),
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])),
  claim_date date,
  estimated_release date,
  rejection_reason text,
  created_at timestamp with time zone DEFAULT now(),
  first_name text,
  middle_name text,
  last_name text,
  address text,
  contact_number text,
  email text,
  birthdate date,
  place_of_birth text,
  civil_status text,
  occupation text,
  valid_id_type text,
  ctc_number text,
  CONSTRAINT document_requests_pkey PRIMARY KEY (id)
);
CREATE TABLE public.official_verifications (
  verification_id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  barangay_id uuid NOT NULL,
  proof_document_url text,
  verification_status character varying DEFAULT 'Pending'::character varying CHECK (verification_status::text = ANY (ARRAY['Pending'::character varying::text, 'Approved'::character varying::text, 'Rejected'::character varying::text])),
  requested_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  reviewed_at timestamp without time zone,
  rejection_reason text,
  CONSTRAINT official_verifications_pkey PRIMARY KEY (verification_id),
  CONSTRAINT official_verifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT official_verifications_barangay_id_fkey FOREIGN KEY (barangay_id) REFERENCES public.barangays(barangay_id)
);
CREATE TABLE public.request_types (
  type_id integer NOT NULL DEFAULT nextval('request_types_type_id_seq'::regclass),
  type_name character varying NOT NULL UNIQUE,
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
  barangay_id uuid NOT NULL,
  CONSTRAINT residents_pkey PRIMARY KEY (resident_id),
  CONSTRAINT residents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT residents_barangay_id_fkey FOREIGN KEY (barangay_id) REFERENCES public.barangays(barangay_id)
);
CREATE TABLE public.users (
  user_id uuid NOT NULL,
  full_name character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  role character varying DEFAULT 'resident'::character varying CHECK (role::text = ANY (ARRAY['resident'::character varying, 'official'::character varying]::text[])),
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  barangay_id uuid,
  is_verified boolean DEFAULT false,
  CONSTRAINT users_pkey PRIMARY KEY (user_id),
  CONSTRAINT users_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT users_barangay_id_fkey FOREIGN KEY (barangay_id) REFERENCES public.barangays(barangay_id)
);