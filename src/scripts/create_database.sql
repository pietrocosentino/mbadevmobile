CREATE DATABASE `mbadevmobiledb`;

USE mbadevmobiledb;

CREATE TABLE `mbadevmobiledb`.`mbadevmobile` (
    `id` int NOT NULL AUTO_INCREMENT,
    `url` text NOT NULL,
    `shortUrl` text NOT NULL,
    `createDate` datetime NOT NULL DEFAULT NOW(), 
    PRIMARY KEY (id)
);

CREATE USER 'mbadevmobileUsr'@'localhost' IDENTIFIED WITH mysql_native_password BY '35nC5lZb%Awu2';
GRANT ALL PRIVILEGES ON *.* TO 'mbadevmobileUsr'@'localhost';
FLUSH PRIVILEGES;