drop table if exists request_leave, users, leave_type;

CREATE TABLE users
(
    id serial PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    position text not NULL,
    email text UNIQUE NOT NULL,
    PASS_WORD VARCHAR(100) Not NULL
    -- joined TIMESTAMP NOT NULL DEFAULT TIMESTAMP
);

INSERT INTO users (first_name,last_name,position,email,PASS_WORD) VALUES ('Ayabonga','Booi','fullstack dev','aya@gmail','123');
INSERT INTO users (first_name,last_name,position,email,PASS_WORD) VALUES ('Luvuyo','Sono','fullstack dev','sono@gmail','1234');

SELECT *
FROM users;

CREATE TABLE leave_type
(
    id serial PRIMARY KEY,
     leave_type  VARCHAR(100) NOT NULL,
     amount int DEFAULT 5
    -- Study_leave int DEFAULT 5,
    -- unpaid_leave int DEFAULT 10,
    -- family_responsibility int DEFAULT 3,
    -- paid_leave int DEFAULT 17
);

INSERT INTO leave_type (leave_type) VALUES ('Sick leave');
INSERT INTO leave_type (leave_type) VALUES ('unpaid leave');
INSERT INTO leave_type (leave_type) VALUES ('paid leave');

SELECT *
FROM leave_type;

CREATE TABLE request_leave
(
    id serial PRIMARY KEY,
    leave_id int not null,
    users_id int not null,
    Description VARCHAR(250) not null,
    start_date text not null,
    end_date text not null,
    status VARCHAR DEFAULT 'Pending',
    foreign key (leave_id) references request_leave(id),
    foreign key (users_id) references users(id)
)


-- SELECT * FROM request_leave;

