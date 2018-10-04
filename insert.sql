--  INSERT INTO users(first_name,last_name,position,email,user_password) VALUES('Ayabonga','Booi','Fullstack dev','ayabongabooi2@gmail.com','1234567890');
-- INSERT INTO leave_type (leave_type) VALUES ('Sick leave');
-- INSERT INTO leave_type (leave_type) VALUES ('unpaid leave');
-- INSERT INTO leave_type (leave_type) VALUES ('paid leave');
-- INSERT INTO leave_type (leave_type) VALUES ('family leave');


-- INSERT INTO leave_status (leave_status) VALUES ('Pending');
-- INSERT INTO leave_status (leave_status) VALUES ('Approved');
-- INSERT INTO leave_status (leave_status) VALUES ('Rejected');
-- INSERT INTO leave_status (leave_status) VALUES ('Canceled');

-- INSERT INTO user_leave_allowed (user_id,leave_type_id,leave_amount) VALUES (3,1,3);
-- INSERT INTO user_leave_allowed (user_id,leave_type_id,leave_amount) VALUES (3,2,8);
-- INSERT INTO user_leave_allowed (user_id,leave_type_id,leave_amount) VALUES (3,3,10);
-- INSERT INTO user_leave_allowed (user_id,leave_type_id,leave_amount) VALUES (3,4,3);

     
INSERT INTO leave_request (leave_type_id,user_id,leave_description,start_date,end_date,status_id)
 VALUES (1,3,'sick','2018-10-04','2018-10-06',1);