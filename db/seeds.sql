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
    ('Nebiat', 'Yitbarek', '1', '0'),
    ('Ali', 'Mima', '2', '1'),
    ('Eric', 'Yayu', '3', '0'),
    ('Solomon', 'Scott', '4', '3'),
    ('Ondo', 'Happy', '5', '0'),
    ('Rebka', 'Desta', '6', '5'),
    ('Senait', 'Abi', '7','0'),
    ('Keya', 'Girum', '8', '7');