-- /c death;
-- /i ./db/migrations/01_create_table_model.sql

DROP TABLE IF EXISTS reservations;

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


