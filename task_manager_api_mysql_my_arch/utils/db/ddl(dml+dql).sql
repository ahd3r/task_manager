DROP DATABASE IF EXISTS task_manager;
CREATE DATABASE task_manager;
USE task_manager;

CREATE TABLE status_perm(
id_status TINYINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY UNIQUE,
permission VARCHAR(100) NOT NULL UNIQUE);

CREATE TABLE image(
id_image INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY UNIQUE,
image_url VARCHAR(255) NOT NULL);

CREATE TABLE users(
id_user INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY UNIQUE,
username VARCHAR(255) NOT NULL,
password VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
confirmed TINYINT(1) NOT NULL DEFAULT 0,
created DATE NOT NULL,
updated DATE NULL,
permission TINYINT UNSIGNED NOT NULL DEFAULT 1,
avatar INT UNSIGNED NOT NULL DEFAULT 1,
active TINYINT NOT NULL DEFAULT 1,
FOREIGN KEY (avatar) REFERENCES image(id_image), -- if user wants to get default ava, he must to set 1 insted delete pic and then delete it from table and cloud
FOREIGN KEY (permission) REFERENCES status_perm(id_status)); -- you just can not delete status

CREATE TRIGGER set_user_created BEFORE INSERT ON users FOR EACH ROW SET NEW.created = CURRENT_DATE();
CREATE TRIGGER set_user_update BEFORE UPDATE ON users FOR EACH ROW SET NEW.updated = CURRENT_DATE();

CREATE TABLE token(
id_token INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY UNIQUE,
owner_user INT UNSIGNED NOT NULL UNIQUE,
confirm_token VARCHAR(40) NULL UNIQUE,
reset_token VARCHAR(40) NULL UNIQUE,
FOREIGN KEY (owner_user) REFERENCES users(id_user)); -- you can not delete user only set active to 0 (false)

CREATE TABLE tasks(
id_task INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY UNIQUE,
task_name VARCHAR(100) NOT NULL,
task_done TINYINT(1) NOT NULL DEFAULT 0,
task_done_time DATE NULL,
task_created DATE NOT NULL,
task_updated DATE NULL,
task_owner INT UNSIGNED NOT NULL,
FOREIGN KEY (task_owner) REFERENCES users(id_user)); -- you can not delete user only set active to 0 (false)

CREATE TRIGGER set_task_created BEFORE INSERT ON tasks FOR EACH ROW SET NEW.task_created = CURRENT_DATE();
CREATE TRIGGER set_task_updated BEFORE UPDATE ON tasks FOR EACH ROW SET NEW.task_updated = CURRENT_DATE();

delimiter //
CREATE PROCEDURE done_task(id INT UNSIGNED)
BEGIN
UPDATE tasks SET task_done=1 WHERE id_task=id;
UPDATE tasks SET task_done_time=CURRENT_DATE() WHERE id_task=id;
END//
delimiter ;

CREATE TABLE del_tasks(
id_del_task INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY UNIQUE,
del_task_name VARCHAR(100) NOT NULL,
del_task_done TINYINT(1) NOT NULL,
deleted_time DATE NOT NULL,
created_time DATE NOT NULL,
user_deleted INT UNSIGNED NOT NULL,
FOREIGN KEY (user_deleted) REFERENCES users(id_user)); -- you can not delete user only set active to 0 (false)

CREATE TRIGGER set_delete_time BEFORE INSERT ON del_tasks FOR EACH ROW SET NEW.deleted_time = CURRENT_DATE();

CREATE TABLE support_message(
id_message INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY UNIQUE,
title VARCHAR(100) NOT NULL,
body TEXT NOT NULL,
message_status VARCHAR(100) NOT NULL DEFAULT 'Open',
created DATE NOT NULL,
updated DATE NOT NULL,
creator INT UNSIGNED NOT NULL,
readed TINYINT NOT NULL DEFAULT 0,
FOREIGN KEY (creator) REFERENCES users(id_user)); -- you can not delete user only set active to 0 (false)

CREATE TRIGGER set_created_time BEFORE INSERT ON support_message FOR EACH ROW SET NEW.created = CURRENT_DATE();
CREATE TRIGGER set_updated_time BEFORE UPDATE ON support_message FOR EACH ROW SET NEW.updated = CURRENT_DATE();

delimiter //
CREATE PROCEDURE delete_task(id_task_not_del_for_del INT UNSIGNED)
BEGIN
DECLARE name VARCHAR(255);
DECLARE done TINYINT(1);
DECLARE created_time_task_not_del DATE;
DECLARE user INT UNSIGNED;
SET name = (SELECT task_name FROM tasks WHERE id_task = id_task_not_del_for_del);
SET created_time_task_not_del = (SELECT task_created FROM tasks WHERE id_task = id_task_not_del_for_del);
SET user = (SELECT task_owner FROM tasks WHERE id_task = id_task_not_del_for_del);
SET done = (SELECT task_done FROM tasks WHERE id_task = id_task_not_del_for_del);
INSERT del_tasks(del_task_name,del_task_done,created_time,user_deleted) VALUES (name,done,created_time_task_not_del,user);
DELETE FROM tasks WHERE id_task=id_task_not_del_for_del;
END//
delimiter ;

delimiter //
CREATE PROCEDURE show_tasks_by_date(user_for INT UNSIGNED, year_t SMALLINT UNSIGNED,month_t TINYINT UNSIGNED, day_t TINYINT UNSIGNED,admin_s TINYINT(1))
BEGIN
	IF(admin_s=0)
	THEN
		IF EXISTS(SELECT * FROM users WHERE id_user = user_for)
		THEN
			IF EXISTS(SELECT * FROM tasks WHERE YEAR(task_created)=year_t AND MONTH(task_created)=month_t AND DAY(task_created)=day_t AND task_owner=user_for)
			THEN
				IF EXISTS(SELECT * FROM del_tasks WHERE YEAR(created_time)=year_t AND MONTH(created_time)=month_t AND DAY(created_time)=day_t AND user_deleted=user_for)
				THEN
					SELECT * FROM tasks WHERE YEAR(task_created)=year_t AND MONTH(task_created)=month_t AND DAY(task_created)=day_t AND task_owner=user_for ORDER BY id_task DESC;
					SELECT * FROM del_tasks WHERE YEAR(created_time)=year_t AND MONTH(created_time)=month_t AND DAY(created_time)=day_t AND user_deleted=user_for ORDER BY id_del_task DESC;
				ELSE
					SELECT * FROM tasks WHERE YEAR(task_created)=year_t AND MONTH(task_created)=month_t AND DAY(task_created)=day_t AND task_owner=user_for ORDER BY id_task DESC;
				END IF;
			ELSE
				IF EXISTS(SELECT * FROM del_tasks WHERE YEAR(created_time)=year_t AND MONTH(created_time)=month_t AND DAY(created_time)=day_t AND user_deleted=user_for)
				THEN
					SELECT * FROM del_tasks WHERE YEAR(created_time)=year_t AND MONTH(created_time)=month_t AND DAY(created_time)=day_t AND user_deleted=user_for ORDER BY id_del_task DESC;
				ELSE
					SELECT 'This user has no tasks at this day' AS Error;
				END IF;
			END IF;
		ELSE
			SELECT 'Wrong id' AS Error;
		END IF;
	ELSE
		IF EXISTS(SELECT * FROM tasks WHERE YEAR(task_created)=year_t AND MONTH(task_created)=month_t AND DAY(task_created)=day_t)
        THEN
            IF EXISTS(SELECT * FROM del_tasks WHERE YEAR(created_time)=year_t AND MONTH(created_time)=month_t AND DAY(created_time)=day_t)
            THEN
				SELECT * FROM tasks WHERE YEAR(task_created)=year_t AND MONTH(task_created)=month_t AND DAY(task_created)=day_t ORDER BY id_task DESC;
				SELECT * FROM del_tasks WHERE YEAR(created_time)=year_t AND MONTH(created_time)=month_t AND DAY(created_time)=day_t ORDER BY id_del_task DESC;
			ELSE
				SELECT * FROM tasks WHERE YEAR(task_created)=year_t AND MONTH(task_created)=month_t AND DAY(task_created)=day_t ORDER BY id_task DESC;
			END IF;
		ELSE
			IF EXISTS(SELECT * FROM del_tasks WHERE YEAR(created_time)=year_t AND MONTH(created_time)=month_t AND DAY(created_time)=day_t)
            THEN
				SELECT * FROM del_tasks WHERE YEAR(created_time)=year_t AND MONTH(created_time)=month_t AND DAY(created_time)=day_t ORDER BY id_del_task DESC;
            ELSE
				SELECT 'In this date was not be any task' AS Message;
            END IF;
		END IF;
	END IF;
END//
delimiter ;



INSERT status_perm(permission) VALUES ('user'),('admin'),('paid');
SELECT * FROM status_perm;

INSERT image(image_url) VALUES('https://res.cloudinary.com/dpacw4pua/image/upload/v1549307344/task_manager/avatar/user.png');
SELECT * FROM image;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1111';
