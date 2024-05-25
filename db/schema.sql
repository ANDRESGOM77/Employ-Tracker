DROP DATABASE IF EXIST company_db;
CREATE DATABASE company_db;

\c company_db;

CREATE TABLE department (
    department_id INT  NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (department_id),
    department_name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE roles(
    roles_id INTEGER NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INTEGER NOT NULL,
    PRIMARY KEY (roles_id),
    FOREIGN KEY (department_id) REFERENCES department(department_id)
);

CREATE TABLE employee(
    employee_id INTEGER NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    roles_id INTEGER NOT NULL,
    manager_id INTEGER NOT NULL,
    PRIMARY KEY (employee_id)
    FOREIGN KEY (roles_id) REFERENCES roles(roles_id),
    FOREIGN KEY (manager_id) REFERENCES employee(employee_id)
);