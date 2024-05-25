INSERT INTO department (department_name)
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
INSERT INTO roles (roles_id, title, salary, department_id)
VALUES 
    (1, 'HR Manager', 80000, 1),
    (2, 'Accountant', 60000, 2),
    (3, 'Software Engineer', 90000, 3),
    (4, 'Sales Representative', 50000, 4),
    (5, 'Marketing Coordinator', 55000, 5),
    (6, 'IT Support Specialist', 50000, 6),
    (7, 'Customer Service Rep', 40000, 7),
    (8, 'R&D Scientist', 95000, 8),
    (9, 'Legal Advisor', 85000, 9),
    (10, 'Operations Manager', 75000, 10);

INSERT INTO employee (employee_id,first_name,last_name,roles_id, manager_id)
VALUES
(1,'John','Doe', 1, 5),         
(2,'Jane','Smith', 2, 1),       
(3,'Emily','Jones', 3, 2),      
(4,'Michael','Brown', 4, 2),    
(5,'Sarah','Davis', 5, 1),      
(6,'David','Wilson', 6, 3),     
(7,'Linda','Martinez', 7, 4),   
(8,'James','Garcia', 8, 9),     
(9,'Susan','Rodriguez', 9, 7),  
(10,'Robert','Lewis', 10, 8),   
(11,'Alice','Walker', 3, 1),     
(12,'Chris','Young', 4, 4),       
(13,'Patricia','Hall', 5, 5),      
(14,'Mark','Allen', 6, 6),         
(15,'Elizabeth','King', 7, 7),     
(16,'Thomas','Scott', 8, 8),       
(17,'Barbara','Adams', 9, 9),      
(18,'Joseph','Baker', 10, 10),     
(19,'Nancy','Gonzalez', 2, 2),     
(20,'Daniel','Nelson', 1, 1);      