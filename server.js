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
      database: 'company_db'
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

