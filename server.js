const inquirer = require('inquirer');
const { Pool } = require('pg');
const express = require('express');

const PORT = process.env.PORT || 5001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const pool = new Pool(
    {
        user: 'postgres',
        password: 'Manolo19',
        host: 'localhost',
        database: 'employeetracker_db'
    },
    console.log(`Connected to the employeetracker_db database.`)
)

pool.connect(err => {
    if (err) {
        console.log('there is an error connecting to the employeetracker_db database')
    }
    console.log('connected to the employeetracker_db database')
    init();
}
);

function init() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
        }
    ]).then(answer => {
        switch (answer.action) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'view all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Exit':
                exit();
                break;
        }
    })
};

function viewDepartments() {
    pool.query('SELECT * FROM departments', (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(res.rows);
        init();
    })
}

function viewRoles() {
    pool.query('SELECT * FROM roles', (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(res.rows);
        init();
    })
}

function viewEmployees() {
    const query = `   
    SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
    FROM employee e
    LEFT JOIN roles r ON e.roles_id = r.id
    LEFT JOIN departments d ON r.department_id = d.id
    LEFT JOIN employee ON e.manager_id = employee.id;`

    pool.query(query, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(res.rows);
        init();
    })
}

async function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department_name',
            message: 'What is the name of the department you would like to add?'
        }
    ])
        .then((answer) => {
            console.log(answer.name);
            const query = `INSERT INTO departments (department_name) VALUES ("${answer.name}")`;
            pool.query(query, (err, res) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(`Added department ${answer.name} to the database!`);
                console.log(answer.name);
                init();
            });
        });
}
function addRole() {
    pool.query('SELECT * FROM departments;', (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the name of the role you would like to add?'
            },
            {
                type: 'input',
                name: 'department_id',
                message: 'What is the department of the role you would like to add?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role you would like to add?'
            }
        ])
            .then((answer) => {
                const department = res.find(
                    (department) => department.department_name === answer.department_id
                );
                pool.query("INSERT INTO roles SET ?", {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: department,
                },
                    (err, res) => {
                        if (err) throw err;
                        console.log(
                            `Added role ${answer.title} with salary ${answer.salary} to the ${answer.department} department in the database!`
                        );
                        console.log(res.rows);
                        init();
                    }
                )
            });
    })
}

function addEmployee() {
    pool.query('SELECT id, title FROM roles', (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'What is the first name of the employee you would like to add?'
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'What is the last name of the employee you would like to add?'
            },
            {
                type: 'input',
                name: 'role_id',
                message: 'What is the role of the employee you would like to add?',
                choices: res.rows.map(({ id, title }) => ({ role: id, role: title }))
            },
            {
                type: 'input',
                name: 'manager_id',
                message: 'What is the manager of the employee you would like to add?'
            }
        ])
            .then((answer) => {
                const query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                const values = [
                    answer.firstName,
                    answer.lastName,
                    answer.roleId,
                    answer.managerId,
                ];
                connection.query(query, values, (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    console.log("Employee added successfully");
                    init();
                });
            })

    })
}

function updateEmployeeRole() {
    const queryEmp = "SELECT  employee.id, employee.first_name, employee.last_name roles.title FROM employee LEFT JOIN roles ON employee.roles.id = roles.id";
    const queryRol = "SELECT * FROM roles";
    pool.query(queryEmp, (err, resEmployees) => {
        if (err) {
            console.log(err)
        };
        pool.query(queryRol, (err, resRoles) => {
            if (err) {
                console.log(err)
            }
            inquirer.prompt([
                {
                    type: "list",
                    name: "employee",
                    message: "Select the employee to update:",
                    choices: resEmployees.map((employee) => `${employee.first_name} ${employee.last_name}`)
                },
                {
                    type: "list",
                    name: "role",
                    message: "Select the new role:",
                    choices: resRoles.map((role) => role.title)
                },
            ])
                .then((answer) => {
                    const employee = resEmployees.find((employee) => `${employee.first_name}${employee.last_name}` === answer.employee);
                    const role = resRoles.find((role) => role.title === answer.role);
                    const query = "UPDATE employee SET role_id =? WHERE id =?";
                    const values = [role.id, employee.id];
                    pool.query(query, values, (err, res) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        console.log(`Updated employee ${employee.first_name} ${employee.last_name}'s role to ${role.title}`);
                        init();
                    })
                })
        })
    })
}

function exit() {
    process.on("exit", () => {
        console.log("Goodbye!");
        pool.end();
    });
}

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})