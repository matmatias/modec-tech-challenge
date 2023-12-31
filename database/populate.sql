CREATE TABLE IF NOT EXISTS employees 
( 
	id int AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(20) NOT NULL,
  last_name VARCHAR(20) NOT NULL,
	department VARCHAR(50) NOT NULL,
  age int NOT NULL
);

LOAD DATA INFILE "/var/lib/mysql-files/employees.csv"
INTO TABLE employees
FIELDS TERMINATED BY ","
LINES TERMINATED BY "\n"
IGNORE 1 LINES;
