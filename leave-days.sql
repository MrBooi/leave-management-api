drop table if exists user_leave_allowed,leave_status,leave_request, users, leave_type;

CREATE TABLE users
(
    id serial PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    position text not NULL,
    email text UNIQUE NOT NULL,
    user_password text Not NULL,
    joined_date TIMESTAMP NOT NULL 
);

SELECT *
FROM users;

CREATE TABLE leave_type
(
    id serial PRIMARY KEY,
     leave_type  text NOT NULL
     
    -- Study_leave int DEFAULT 5,
    -- unpaid_leave int DEFAULT 10,
    -- family_responsibility int DEFAULT 3,
    -- paid_leave int DEFAULT 17
);

SELECT *
FROM leave_type;

CREATE TABLE leave_request
(
    id serial PRIMARY KEY,
    leave_type_id int not null,
    user_id int not null,
    leave_description text not null,
    start_date date not null,
    end_date date not null,
    status_id int not NULL,
    foreign key (leave_type_id ) references request_leave(id),
    foreign key (user_id) references users(id),
    foreign key (status_id) references leave_status(id)
)

CREATE TABLE leave_status(
  id serial PRIMARY KEY,
  status text DEFAULT 'Pending'
)

CREATE TABLE user_leave_allowed(
    id serial PRIMARY KEY,
    user_id int not null,
    leave_type_id int not null,
    leave_amount int not null,
    foreign key (user_id) references users(id),
    foreign key (leave_type_id) references leave_type(id)
)




