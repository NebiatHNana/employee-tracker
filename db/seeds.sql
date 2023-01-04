INSERT INTO department(name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO roles (title, salary, department_id )
VALUES
    ('Sales Lead', '100000', '1'),
    ('Salesperson', '80000', '1'),
    ('Lead Engineer', '150000', '2'),
    ('Software Engineer', '160000', '2'),
    ('Account Manager', '160000', '3' ),
    ('Accountant', '125000', '3'),
    ('Legal Team Lead', '250000', '4'),
    ('Lawyer', '190000', '4');

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Grace', 'Jones', '1', '0'),
    ('Chaka', 'Khan', '2', '1'),
    ('Erykah', 'Badu', '3', '0'),
    ('Jill', 'Scott', '4', '3'),
    ('Beth', 'Hart', '5', '0'),
    ('Lucinda', 'Williams', '6', '5'),
    ('Jody', 'Watley', '7','0'),
    ('Tori', 'Amos', '8', '7');