
const res = require('express/lib/response');
const inquirer = require('inquirer');
const db = require('./db/connection');

const cTable = require('console.table');

const mysql = require('mysql2');

const chalk = require('chalk');

require('dotenv').config()


function getEmployees () {

    let sql = `SELECT employees.id AS ID, employees.first_name AS First_Name, employees.last_name AS Last_Name, roles.title AS Role, department.name AS Department, roles.salary AS Salary, employees.manager_id AS Manager 
    FROM employees
    LEFT JOIN roles
    ON employees.role_id = roles.id
    LEFT JOIN department
    ON roles.department_id = department.id`;

    db.query(sql, (err, res) => 
        {
            if (err) {
                console.log(err);
                return;
            }
        console.table(res);
        showOrAddData();
        });
    }


function getEmployeesByDepartment() {
    const departmentChoice = `Select * FROM department`;
    db.query(departmentChoice, (err, result) =>{
        const departments = result.map(({id, name}) =>({name: name, value:id}));
        inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: "From which department do you want to see the employees? ",
                choices: departments
            },
        ])
        .then (departmentChoice => {
            const criteria = [departmentChoice.department];
            const employeeSearchSql = `SELECT employees.first_name, employees.last_name, 
            department.name AS Department
            FROM employees
            LEFT JOIN roles ON employees.role_id = roles.id 
            LEFT JOIN department ON roles.department_id = department.id
            WHERE department.id = ?`;

            db.query(employeeSearchSql, criteria, (err, result) => {
                if (err) {
                    res.status(500).json({error: err.message});
                    return;
                }
            console.log("These are the employees by department you requested");
            console.table(result);
            showOrAddData();
            })
        })
    })
}


function viewAllRoles (){
    let sqlViewRoles = `SELECT roles.id AS Id, roles.title AS Role, department.name AS department, roles.salary AS Salary
                FROM roles
                LEFT JOIN department
                ON roles.department_id = department.id `;
    db.query(sqlViewRoles, (err, res) => {
        if (err) {
            console.log(err);
            return;
        } 
        console.table(res);
        showOrAddData();
    });
}


function addRole () {
    inquirer.prompt([
        {
            type:'input',
            name: 'role',
            message: 'Please enter the role you wish to add :',
        },
        {
            type: 'input',
            name: 'salary',
            message: "Please enter the salary for the role (ie: 125000) :",
        }
    ])
    .then(roleChoice => {
        const criteria = [roleChoice.role, roleChoice.salary];
        const departmentSql ='SELECT department.id, department.name FROM department';
        db.query(departmentSql, (err, result)=>{
            const departments = result.map(({id, name}) =>({name: name, value:id}));
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'department',
                    message: "In which department does this role belong?",
                    choices: departments
                }
            ])
            .then (roleChoice => {
                const role = roleChoice.department;
                criteria.push(role);
                const departmentSql = `INSERT INTO roles (title, salary, department_id)
                VALUES (?,?,?)`
                db.query(departmentSql, criteria, (err, result) =>{
                    if(err) {
                        res.status(500).json({error: err.message});
                        return;
                    }
                console.log("You have added a new role.")
                viewAllRoles()
                showOrAddData;
                })
            })
        })
    })  
}


 
function deleteRole() {
    const roleSQL = `SELECT roles.id, roles.title FROM roles`;
    db.query(roleSQL, (err, result) =>{
        const roles = result.map(({id, title}) => ({name: title, value:id}));
        inquirer.prompt([
        {
            type: 'list',
            name: 'role',
            message: "Which Role would you like to delete?",
            choices: roles
        }
        ])
        .then (roleChoice =>{
            const criteria = [roleChoice.role];
            const deleteRole = `DELETE FROM roles WHERE roles.id = ?`;
            db.query(deleteRole, criteria, (err, result) =>{
                if(err) {
                    res.status(500).json({error: err.message});
                    return;
                }
                console.log("You have deleted that role");
                viewAllRoles()
            })
        })
    })
}



function ViewAllDepartments() {
    const sqlViewDepartments = `SELECT department.id AS ID, department.name as Department FROM department`;

    db.query(sqlViewDepartments, (err, results) =>{
        if (err) {
            console.log(err);
            return;
        }
        console.table(results);
        showOrAddData();
    })
}



function AddDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: "Please Enter the name of the Department you want to add"
        },
    ])
    .then(departmentChoice => {
        const criteria =[departmentChoice.department];
        const departmentAddSql = 'INSERT INTO department (name) VALUES(?)'
        db.query(departmentAddSql, criteria, (err, result) =>{
            if(err) {
                res.status(500).json({error: err.message});
                return;
            }
            console.log("You have added a new department");
            ViewAllDepartments()
        });
    });
};


function deleteDepartment() {
    const departmentSql = `SELECT * FROM department`;
    db.query(departmentSql, (err, data) => {
    const departments = data.map(({id, name}) =>({name: name, value:name}));
    inquirer.prompt([
        {
            type: 'list',
            name: 'department',
            message: "Which Department would you like to delete?",
            choices: departments
        }
    ])
    .then (departmentChoice => {
        const criteria = [departmentChoice.department];
        const deleteDepartmentSql = `DELETE FROM department WHERE department.name = ?`;
        db.query(deleteDepartmentSql, criteria, (err, result) => {
            if(err) {
                res.status(500).json({error: err.message});
                return;
            }
            console.log("You have deleted that department.");
            ViewAllDepartments();
           })
        })
    })
}




function updateEmployeeRole() {
    const employeeSQL = `SELECT * FROM employees`;
    db.query(employeeSQL, (err, data) =>{
        const employees = data.map(({id, first_name, last_name}) =>({name: first_name + " " + last_name, value:id}));
        inquirer.prompt([
            {
                type:'list',
                name: 'employee',
                message: "Which employee's role would you like to change?",
                choices: employees
            }
        ])
        .then (employeeChoice =>{
            const criteria = [employeeChoice.employee];
            const rolesSql = `SELECT roles.id, roles.title FROM roles`;
            db.query(rolesSql, (err, result) => {
                const roles = result.map(({id, title}) => ({name: title, value:id}));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "What is the employee's new role?",
                        choices: roles
                    },
                ])
                .then (roleChoice =>{
                    const role = roleChoice.role;
                    criteria.push(role);
                    const criteriaReverse = criteria.reverse();
                    const changeroleSql = `UPDATE employees SET role_id = ? WHERE id = ?`;
                    db.query(changeroleSql, criteriaReverse, (err, result) =>
                    {
                        if (err) {
                            res.status(500).json({error: err.message});
                            return;
                        }
                console.log("You have updated the employee's role");
                getEmployees()
                    }) 
                })
            })

            
        })
    })

}


function getNewEmployeeInfo (){

    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'What is their first name?',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'What is the their last name?',
        }, 
    ])
    .then(answer => {
    const criteria = [answer.first_name, answer.last_name]
    const roleSql = `SELECT roles.id, roles.title FROM roles`;
    db.query(roleSql, (err, result) =>{
        const roles = result.map(({id, title}) => ({name: title, value:id}));
        inquirer.prompt([
        {
            type: 'list',
            name: 'role',
            message: "What is the employee's role?",
            choices: roles

        },
       ])      
    .then ( rolechoice  => {
        const role = rolechoice.role;
        criteria.push(role);
        const managerSQL = `SELECT * FROM employees`;
        db.query(managerSQL, (err, data) => {
            const managers = data.map(({id, first_name, last_name}) => ({name: first_name + " " + last_name, value:id}));
        inquirer.prompt([
            {
            type: 'list',
            name: 'manager',
            message: "Who is the employee's manager?",
            choices: managers
            }
        ])
        .then (managerChoice => {
            const manager = managerChoice.manager;
            criteria.push(manager);
            const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
            VALUES (?,?,?,?)`
            db.query(sql, criteria, (err, result) => 
                {
                    if (err) {
                        res.status(500).json({error: err.message});
                        return;
                    }
            console.log("You have added the new employee");
            getEmployees()
        });
        });
    });
});
});
});
}


function deleteEmployee() {
    const employeeSQL = 'SELECT * FROM employees';
    db.query(employeeSQL, (err, data) =>{
        const employees = data.map(({id, first_name, last_name}) =>({name: first_name + " " + last_name, value:id}));
        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: "Which employee would you like to delete?",
                choices: employees
            },
        ])
        .then (employeeChoice => {
            const criteria = [employeeChoice.employee];
            const deleteEmployeeSql = `DELETE FROM employees WHERE employees.id = ?`;
            db.query(deleteEmployeeSql, criteria, (err, result) => {
                if(err) {
                    res.status(500).json({error: err.message});
                    return;
                }
                console.log("You have deleted that employee.");
                getEmployees()
            })
        })
    })
}


function validateChoice(choice) {
    if(choice === '["View All Employees"]') {
        console.log("You chose to show all employees");
        getEmployees();
    } else if (choice === '["View Employees by Department"]'){
        console.log("You chose to view employees by department");
        getEmployeesByDepartment();
    }  
    else if (choice === '["Add Employee"]') {
        console.log("You chose to add an employee");
        getNewEmployeeInfo();
    } else if (choice === '["Delete Employee"]') {
        console.log("You have chosen to delete an employee");
        deleteEmployee();
    } else if (choice === '["Update Employee Role"]'){
        console.log("You have chosen to update an employee's role");
        updateEmployeeRole();
    } else if (choice === '["View All Roles"]'){
        console.log("You have chosen to view all roles");
        viewAllRoles();
    } else if (choice === '["Add Role"]'){
        console.log("You have chosen to view add a role");
        addRole();
    } else if (choice === '["Delete Role"]'){
        console.log("You have chosen to delete role");
        deleteRole();
    } else if (choice === '["View All Departments"]'){
        console.log("You have chosen to view add all departments");
        ViewAllDepartments();
    } else if (choice === '["Add Department"]'){
        console.log("You have chosen to view add a departments");
        AddDepartment();
    } else if (choice === '["Delete Department"]'){
        deleteDepartment();
    } else if (choice === '["Quit"]') {
        console.log("Have a good day!");
        process.exit();
    }

}


function showOrAddData () {
    return inquirer.prompt([

        {
            type: 'checkbox',
            name: 'choice',
            message: 'What would you like to do?',
            choices: ["View All Employees", "View Employees by Department", "Add Employee", "Delete Employee", "Update Employee Role", "View All Roles", "Add Role", "Delete Role", "View All Departments", "Add Department", "Delete Department","Quit"],

        },

    ])
    .then (data =>{
        const choice = JSON.stringify(data.choice);
        validateChoice(choice)

    })
}

showOrAddData()
/*// BONUS FUNCTION TO DELETE A ROLE
function deleteRole() {

  db.query('SELECT role.id, role.title FROM employee_db.role;', function (err, results) {
    if (err) throw err;
    console.log("");
    const whichRole = results.map(({ id, title}) => ({ name: title, value: id }));

    inquirer.prompt([
      {
        type: "list",
        name: "role",
        message: "Which employee would you like to delete? ",
        choices: whichRole,
      },
    ])
      .then((roleChoice) => {

        let sql = `DELETE FROM role WHERE id = ?`;

        db.query(sql, roleChoice.role, (error, results) => {
          if (error)
            return console.error(error.message);
        
          console.log('Deleted Row(s):', results.affectedRows);
        });      
        console.log("");
        viewAllRoles();
        console.log("");

          //BACK TO MAIN MENU
          mainFunc();
        });
      });
}


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
