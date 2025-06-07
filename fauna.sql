--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17
-- Dumped by pg_dump version 14.17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: status_lindungi; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.status_lindungi AS ENUM (
    'Dilindungi',
    'Terancam Punah',
    'Punah',
    'Tidak Dilindungi'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: data_hewan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.data_hewan (
    id_hewan integer NOT NULL,
    nama_hewan character varying(255) NOT NULL,
    nama_latin character varying(255),
    deskripsi text,
    status_lindungi public.status_lindungi NOT NULL,
    wilayah character varying(255),
    populasi integer,
    urlfoto character varying(255)
);


--
-- Name: data_hewan_id_hewan_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.data_hewan_id_hewan_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: data_hewan_id_hewan_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.data_hewan_id_hewan_seq OWNED BY public.data_hewan.id_hewan;


--
-- Name: laporan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.laporan (
    id_laporan integer NOT NULL,
    nama_pelapor character varying(255) NOT NULL,
    email_pelapor character varying(255) NOT NULL,
    lokasi_kejadian text NOT NULL,
    deskripsi_kejadian text NOT NULL,
    foto_bukti character varying(255)
);


--
-- Name: laporan_id_laporan_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.laporan_id_laporan_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: laporan_id_laporan_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.laporan_id_laporan_seq OWNED BY public.laporan.id_laporan;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    nama character varying(100) NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(50) NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: data_hewan id_hewan; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_hewan ALTER COLUMN id_hewan SET DEFAULT nextval('public.data_hewan_id_hewan_seq'::regclass);


--
-- Name: laporan id_laporan; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.laporan ALTER COLUMN id_laporan SET DEFAULT nextval('public.laporan_id_laporan_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: data_hewan; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.data_hewan (id_hewan, nama_hewan, nama_latin, deskripsi, status_lindungi, wilayah, populasi, urlfoto) FROM stdin;
2	Harimau Sumatra	Panthera tigris sondaica	Harimau Sumatra ( Panthera tigris sumatrae) adalah subspesies harimau terkecil dan hanya ditemukan di Pulau Sumatra, Indonesia. Mereka memiliki ciri khas berupa loreng hitam yang lebih rapat dibandingkan subspesies harimau lainnya dengan warna kulit oranye yang lebih gelap. 	Dilindungi	Sumatra	604	https://storage.googleapis.com/ember-antipecah/harimau-sumatra.jpg
3	Komodo	Varanus komodoensis	Komodo adalah spesies kadal terbesar di dunia yang endemik di beberapa pulau di Nusa Tenggara, Indonesia. Mereka memiliki tubuh yang besar dan kekar, dengan sisik kasar berwarna abu-abu gelap hingga kecoklatan.	Dilindungi	NTT	3396	https://storage.googleapis.com/ember-antipecah/komodo.jpg
10	Tungtungtung	Bombardino	121sadsa	Dilindungi	Earth 616	122	https://storage.googleapis.com/ember-antipecah/Bombardiro_crocodilo_cover.jpg
4	aa	bb	cc	Dilindungi	dd	124	https://storage.googleapis.com/ember-antipecah/ChatGPT%20Image%20May%206,%202025,%2009_45_27%20AM.png
14	aku	akuaku	aku	Tidak Dilindungi	aku	1	https://storage.googleapis.com/ember-antipecah/DALLÂ·E 2024-11-06 14.09.22 - A 3D RPG character portrait of a person standing with their arms crossed, wearing a red shirt that says âHimpunan Mahasiswa Informatikaâ on the chest.png
15	Saya Adalah Hewan	Hewania	Aku adalah Hewan	Terancam Punah	Bandung	12	https://storage.googleapis.com/ember-antipecah/1.jpg
9	Noval Adalah Aku	Tralelelo tralala	emote beku	Dilindungi	Earth 616	1	https://storage.googleapis.com/ember-antipecah/AlexanderTheGreat.png
7	Napoleon	baru	baru	Dilindungi	baru	111	https://storage.googleapis.com/ember-antipecah/leonardobonaporte.jpg
16	Kecoak	saa	sdasd	Terancam Punah	aaa	10	https://storage.googleapis.com/ember-antipecah/kecoak.jpg
\.


--
-- Data for Name: laporan; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.laporan (id_laporan, nama_pelapor, email_pelapor, lokasi_kejadian, deskripsi_kejadian, foto_bukti) FROM stdin;
1	Ali Rahman	ali.rahman@example.com	Kawasan Hutan Lindung, Sumatera	Menemukan satwa liar yang terluka akibat perburuan ilegal	http://example.com/images/satwa-luka.jpg
2	aa	fsa@gmail.com	cozy cost	menemukan hewan langka	https://storage.googleapis.com/ember-antipecah/2.jpg
3	aag	f1sa@gmail.com	cozy costt	menemukan hewan langka2	https://storage.googleapis.com/ember-antipecah/docker.jpg
4	dsa	dasdas@gmail.com	ds	nsn	https://storage.googleapis.com/ember-antipecah/Screenshot 2025-05-12 184534.png
5	sadsa	dasdas@gmail.com	dasda	abcd	https://storage.googleapis.com/ember-antipecah/id-11134207-7r98t-lrcwgfd3b14te0.jpg
6	alexander a palisungan 152022158	pki@mhs.itenas.ac.id	cozy kost	Tidak usah mandi jendral	https://storage.googleapis.com/ember-antipecah/langka.jpg
7	alexander a palisungan 152022158	alexander.a@mhs.itenas.ac.id	cozy kost	ini leonardo da noval jendral	https://storage.googleapis.com/ember-antipecah/Leonardo da Noval.png
9	alexander a palisungan 152022158	alexander.a@mhs.itenas.ac.id	Cozy Cost	hewan langka janbaran	https://storage.googleapis.com/ember-antipecah/ChatGPT Image Apr 16, 2025, 11_37_22 AM.png
10	dsadsa	dasdsa@gmail.com	dsadasd	dasdsadas	https://storage.googleapis.com/ember-antipecah/ChatGPT Image May 18, 2025, 08_54_45 PM.png
11	Thoriq	Najmu@gmail.com	Banjaran	adqda	https://storage.googleapis.com/ember-antipecah/hmm_asr.py
12	Thoriq	RAKII@gmail.com	banjaran	NININ	https://storage.googleapis.com/ember-antipecah/2.jpg
13	1	1@gmail.com	1	1	https://storage.googleapis.com/ember-antipecah/3.jpg
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, nama, username, password, role) FROM stdin;
1	Admin	admin	1234	admin
\.


--
-- Name: data_hewan_id_hewan_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.data_hewan_id_hewan_seq', 16, true);


--
-- Name: laporan_id_laporan_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.laporan_id_laporan_seq', 13, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: data_hewan data_hewan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_hewan
    ADD CONSTRAINT data_hewan_pkey PRIMARY KEY (id_hewan);


--
-- Name: laporan laporan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.laporan
    ADD CONSTRAINT laporan_pkey PRIMARY KEY (id_laporan);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

REVOKE ALL ON SCHEMA public FROM cloudsqladmin;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO cloudsqlsuperuser;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

