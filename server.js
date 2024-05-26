const inquirer = require('inquirer');
const {Pool}= require('pg');
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
    console.log(`Connected to the company_db database.`)
  )
  
  pool.connect(err=> {
     if(err){
        console.log('there is an error connecting to the company_db database')
     }
     console.log('connected to the company_db database')
     init();
    }
);

  function init (){
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
  }})};

function viewDepartments(){
    pool.query('SELECT * FROM departments', (err, res)=>{
        if(err){
            console.log(err);
            return;
        }
        console.log(res.rows);
        init();
    })
}

function viewRoles(){
    pool.query('SELECT roles.title, roles.id, departments.department_name, roles.salary from roles join departments on roles.department_id = departments.id', (err, res)=>{
        if(err){
            console.log(err);
            return;
        }
        console.log(res.rows);
        init();
    })
}

function viewEmployees(){
    const query= `   
    SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
    FROM employee e
    LEFT JOIN roles r ON e.roles_id = r.id
    LEFT JOIN departments d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id;`

    pool.query(query, (err, res)=>{
        if(err){
            console.log(err);
            return;
        }
        console.log(res.rows);
        init();
    })
}

async function addDepartment(){
    inquirer.prompt([
        {
            type: 'input',
            name: 'department_name',
            message: 'What is the name of the department you would like to add?'
        }
    ])
    await pool.query('INSERT INTO departments (department_name) VALUES ($1)', [answer.department_name], (err, res)=>{
            if(err){
                console.log(err);
                return;
            }
            console.log(res.rows);
            init();
        })
    }


function addRole(){}
app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
})