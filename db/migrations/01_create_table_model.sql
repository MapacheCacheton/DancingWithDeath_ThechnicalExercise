-- /c death;
-- /i ./db/migrations/01_create_table_model.sql

DROP TABLE IF EXISTS reservations;

-- i decided to use this model because the system doesn't have a login service for the users
CREATE TABLE reservations(
    id SERIAL NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    user_rut varchar(12) NOT NULL,
    user_name VARCHAR(30) NOT NULL,
    user_last_name VARCHAR(30) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT (True)--True if the reservation is active, false if reservation is inactive/deleted
);

-- if in the future we decide to implement this service we should use this other model that follows normalization

-- DROP TABLE IF EXISTS reservations;
-- DROP TABLE IF EXISTS users;

-- CREATE TABLE users(
--     id SERIAL NOT NULL,
--     rut VARCHAR(10) NOT NULL,
--     first_name VARCHAR(30) NOT NULL,
--     last_name VARCHAR(30) NOT NULL,
--     email VARCHAR(255) UNIQUE NOT NULL,
--     password VARCHAR(50) UNIQUE NOT NULL,
--     active BOOLEAN NOT NULL
--     PRIMARY KEY (rut) 
-- );


-- CREATE TABLE reservations(
--     id SERIAL NOT NULL,
--     date DATE NOT NULL,
--     start_time TIME NOT NULL,
--     user_fk INTEGER NOT NULL,
--     PRIMARY KEY (id),
--     FOREIGN KEY (user_fk) REFERENCES users(rut)
-- );

