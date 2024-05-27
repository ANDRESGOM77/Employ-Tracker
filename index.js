const inquirer = require('inquirer');
const { Pool } = require('pg');
const cfonts = require('cfonts');

const pool = new Pool(
    {
        user: 'postgres',
        password: 'Manolo19',
        host: 'localhost',
        database: 'employeetracker_db'
    },
    console.log(`Connected to the employeetracker_db database.`)
)

cfonts.say('EMPLOYEE TRACKER', {
    font: 'block',
    align: 'center',
    colors: ['greenBright'],
    background: 'transparent',
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: '0',
    env: 'node'
});

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
                'Delete Employee',
                'Exit'
            ]
        }
    ]).then(answer => {

        console.log(answer.action);
        switch (answer.action) {
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
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
            case 'Delete Employee':
                deleteEmployee();
                break;
            default:
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
        console.table(res.rows);
        init();
    })
}

function viewRoles() {
    // title, id, department, salary
    pool.query('SELECT roles.title, roles.id, departments.department_name, roles.salary FROM roles JOIN departments on roles.department_id = departments.id', (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(res.rows);
        init();
    })
}

function viewEmployees() {
    const query = `   
    SELECT employee.id, employee.first_name, employee.last_name, roles.title, departments.department_name, roles.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
    FROM employee 
    LEFT JOIN roles ON employee.roles_id = roles.id
    LEFT JOIN departments  ON roles.department_id = departments.id
    LEFT JOIN employee m ON m.id = employee.manager_id ;`

    pool.query(query, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        console.table(res.rows);
        init();
    })
}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department_name',
            message: 'What is the name of the department you would like to add?'
        }
    ])
        .then((answer) => {

            const query = `INSERT INTO departments (department_name) VALUES ($1)`;
            pool.query(query, [answer.department_name], (err, res) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(`Added department ${answer.department_name} to the database!`);
                console.log(answer.department_name);
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
                type: 'list',
                name: 'department_id',
                message: 'What is the department of the role you would like to add?',
                choices: res.rows.map(department => ({
                    name: department.department_name,
                    value: department.id,
                }))
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role you would like to add?'
            }
        ])
            .then((answer) => {
                pool.query("INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)", [answer.title, answer.salary, answer.department_id],
                    (err, res) => {
                        if (err) throw err;
                        console.log(
                            `Added role ${answer.title} with salary ${answer.salary} to the ${answer.department_id} department in the database!`
                        );
                        console.table(res.rows);
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
        const roles = res.rows.map(roles =>
        ({
            name: roles.title,
            value: roles.id,
        }))
        pool.query('SELECT id, first_name AS name FROM employee', (err, res) => {
            if (err) {
                console.log(err);
                return;
            }
            const managers = res.rows.map(({ id, name }) =>
            ({
                name: name,
                value: id,
            }));

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
                    type: 'list',
                    name: 'role_id',
                    message: 'What is the role of the employee you would like to add?',
                    choices: roles,
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: 'What is the manager of the employee you would like to add?',
                    choices: managers,
                }
            ])
                .then((answer) => {
                    const query = "INSERT INTO employee (first_name,last_name,roles_id, manager_id) VALUES ($1, $2, $3,$4)";
                    const values = [
                        answer.first_name,
                        answer.last_name,
                        answer.role_id,
                        answer.manager_id,
                    ];
                    pool.query(query, values, (err, res) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        console.log(res.rows);
                        console.log(`
                    Employee ${answer.first_name} ${answer.last_name}to the role ${answer.role_id} with the manager ${answer.manager_id} has been added successfully`
                        );
                        init();
                    });
                })

        })
    })
}

function updateEmployeeRole() {
    const queryEmp = "SELECT employee.id, employee.first_name, employee.last_name, roles.title FROM employee LEFT JOIN roles ON employee.roles_id = roles.id";
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
                    choices: resEmployees.rows.map((employee) => 
                        ({
                        name:`${employee.first_name} ${employee.last_name}`,
                        value: employee.id,
                    }))
                        
                },
                {
                    type: "list",
                    name: "role",
                    message: "Select the new role:",
                    choices: resRoles.rows.map(roles => ({
                        name: roles.title,
                        value: roles.id,
                    }))

                },
            ])
                .then((answer) => {
                    const query = "UPDATE employee SET roles_id =$1 WHERE id =$2";
                    const values = [answer.role, answer.employee];
                    console.log(values)
                    pool.query(query, values, (err, res) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        console.log(`Updated employee has been success`);
                        init();
                    })
                })
        })
    })
}

function deleteEmployee() {
    const query = "SELECT * FROM employee";
    pool.query(query, (err, res) => {
        if (err){
            console.log(err);
        }
        console.log(res.rows);
        const employeeList = res.rows.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));
        employeeList.push({ name: "Go Back", value: "back" });
        inquirer
            .prompt({
                type: "list",
                name: "id",
                message: "Select the employee you want to delete:",
                choices: employeeList,
            })
            .then((answer) => {
                if (answer.id === "back") {
                console.log('all good');
                }
                const query = "DELETE FROM employee WHERE id = $1";
                pool.query(query, [answer.id], (err, res) => {
                    if (err) throw err;
                    console.log(
                        `Deleted employee with ID ${answer.id} from the database!`
                        
                    );
                    init();
                });
            });
    });
}

function exit() {
    console.log("Goodbye!");
    pool.end();
}

init()