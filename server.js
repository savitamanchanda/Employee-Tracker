const mysql = require('mysql2');
const inquirer = require('inquirer');
const { ADDRGETNETWORKPARAMS } = require('dns');
const { allowedNodeEnvironmentFlags } = require('process');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'chai',
      database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
  );

  startApp();

  function startApp() {
    inquirer.prompt({
        type: 'list',
        message: "What would you like to do?",
        choices: ['View All Employees', 
        'Add Employee',
        'Update Employee Role',
        'View All Roles',
        'Add Role',
        'View All Departments', 
        'Add Department',
        'Quit'],
        name: 'option'
    }).then(function(answer){
        switch(answer.option) {
            case "View All Employes":
                viewEmp();
                break;

            case "Add Employee":
                addEmp();
                break;

            case "Update Employee Role":
                updateEmpRole();
                break;

            case "View All Roles":
                viewRoles();
                break;

            case "Add Role":
                addRole();
                break;

            case "View All Departments":
                viewDepts();
                break;

            case "Add Department":
                addDepts();
                break;

            case "Quit":
                quit();
                break;
        }
  })
};