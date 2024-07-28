
\c employees_db;

INSERT INTO departments (name) 
VALUES('Sales'), 
('Marketing'),
('Information Technology'),
('Accounting'),
('Human Resources'),
('Customer Services');


INSERT INTO roles(title, salary, department_id)
VALUES
    ('Assistant Manager', 60000, 1),
    ('Regional Manager', 80000, 1),
    ('Sales intern', 30000, 1),
    ('Social Media Manager', 70000, 2)
    ('Software Engineer', 100000, 3)
    ('HR', 50000, 5);


INSERT INTO employees(first_name, last_name, role_id, manager_id) 
VALUES
    ('John', 'Hopkins', 2, NULL),
    ('Tom', 'Twain', 1, 1),
    ('Claire', 'Browne', 3, 1),
    ('Jesse', 'Ruiz', 3, 5),
    ('Adam', 'Clark', 4, 4),
    ('Lisa', 'Gomez', 5, 6),
    ('Ellen', 'Thomas', 6, 3);
    

    