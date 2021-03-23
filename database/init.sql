-- Create a table to store user accounts in.
CREATE TABLE IF NOT EXISTS accounts (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(50) NOT NULL,
	password VARCHAR(250) NOT NULL,
	CONSTRAINT usernameUnique UNIQUE (username)
);
INSERT INTO accounts (username, password) VALUES ("Babbi", "baba12");


CREATE TABLE IF NOT EXISTS dramaRecensions(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150),
    description VARCHAR(150)
   );


CREATE TABLE IF NOT EXISTS dramas(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150),
    description VARCHAR(150)
   );

