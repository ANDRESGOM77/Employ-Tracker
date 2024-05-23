DROP DATABASE IF EXIST Company_db;
CREATE DATABASE company_db;

\c company_db;

CREATE TABLE department (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role(
    role_id SERIAL PRIMARY KEY,
    role_title VARCHAR(30) UNIQUE NOT NULL,
    role_salary DECIMAL NOT NULL,
    FOREIGN KEY department_id INTEGER NOT NULL REFERENCES department(department_id)
);

CREATE TABLE employee(
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    FOREIGN KEY role_id INTEGER NOT NULL REFERENCES role(role_id),
    FOREIGN KEY manager_id INTEGER REFERENCES employee(employee_id)
);