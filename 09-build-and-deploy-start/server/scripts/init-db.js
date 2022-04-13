import pg from 'pg'

const pool = new pg.Pool({
  database: 'campsites',
  user: 'user',
  host: '127.0.0.1',
  password: 'pass',
  port: 5432
})

pool.query(`CREATE TABLE IF NOT EXISTS public.users
  (
    id character varying(36) COLLATE pg_catalog."default" NOT NULL,
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    email character varying(50) COLLATE pg_catalog."default" NOT NULL,
    password character varying(60) COLLATE pg_catalog."default" NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT users_pkey PRIMARY KEY (id)
  )`, (error, results) => {
  if (error) {
    throw error
  }

  console.log(results)
})

pool.query(`CREATE TABLE IF NOT EXISTS public.places
  (
    id character varying(36) COLLATE pg_catalog."default" NOT NULL,
    title character varying(100) COLLATE pg_catalog."default" NOT NULL,
    description character varying(300) COLLATE pg_catalog."default" NOT NULL,
    address character varying(50) COLLATE pg_catalog."default" NOT NULL,
    location point,
    creator character varying(36) COLLATE pg_catalog."default" NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT places_pkey PRIMARY KEY (id)
  )`, (error, results) => {
  if (error) {
    throw error
  }

  console.log(results)
})
