CREATE DATABASE mr_coffee_auth;

CREATE TABLE users (
    id          SERIAL       PRIMARY KEY    IDENTITY,
    firstname   VARCHAR(30)  NOT NULL,
    lastname    VARCHAR(30)  NOT NULL,
    email       VARCHAR(50)  NOT NULL,
    password    VARCHAR(50)  NOT NULL
);

CREATE TABLE schedules (
    id          SERIAL       PRIMARY KEY    IDENTITY,
    day         VARCHAR(10)  NOT NULL,
    start_at    TIME         NOT NULL,
    end_at      TIME         NOT NULL,
    user_id     INTEGER      NOT NULL,
                CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
);

INSERT INTO users (firstname, lastname, email, password) VALUES
    ('Jeff', 'Sanderson', 'delta_pany@gmail.com', 'BraggForce111'),
    ('Pete "Maverick"', 'Mitchell', 'topgun86@gmail.com', 'F-14-Tomcat');

INSERT INTO schedules (user_id, day, start_at, end_at) VALUES
    ('1', 'Monday', '10:00:00', '14:00:00'),
    ('2', 'Monday', '14:00:00', '18:00:00');