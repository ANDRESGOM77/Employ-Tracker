INSERT INTO departments (department_name)
VALUES 
    ('Human Resources'),
    ('Finance'),
    ('Engineering'),
    ('Sales'),
    ('Marketing'),
    ('IT'),
    ('Customer Service'),
    ('Research and Development'),
    ('Legal'),
    ('Operations');
    
INSERT INTO roles ( title, salary, department_id)
VALUES 
    ( 'HR Manager', 80000, 1),
    ( 'Accountant', 60000, 2),
    ( 'Software Engineer', 90000, 3),
    ( 'Sales Representative', 50000, 4),
    ( 'Marketing Coordinator', 55000, 5),
    ( 'IT Support Specialist', 50000, 6),
    ( 'Customer Service Rep', 40000, 7),
    ( 'R&D Scientist', 95000, 8),
    ( 'Legal Advisor', 85000, 9),
    ( 'Operations Manager', 75000, 10);

INSERT INTO employee (first_name,last_name,roles_id, manager_id)
VALUES
('John','Doe', 1, NULL),         
('Jane','Smith', 2, 1),       
('Emily','Jones', 3, 2),      
('Michael','Brown', 4, 2),    
('Sarah','Davis', 5, 1),      
('David','Wilson', 6, 3),     
('Linda','Martinez', 7, 4),   
('James','Garcia', 8, NULL),
( 'Chris', 'Young', 4, 4),       
( 'Patricia', 'Hall', 5, 5),    
('Mark', 'Allen', 6, 6),       
('Elizabeth', 'King', 7, 7),    
( 'Thomas', 'Scott', 8, 8),      
('Barbara', 'Adams', 9, 9),    
('Joseph', 'Baker', 10, NULL);      