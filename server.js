const mysql = require('mysql2');
const inquirer = require('inquirer');
const e = require('express');




const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'chai',
      database: 'employee_db'
    },
    console.table(`
                   _____________________________________________
                  |                                             |
                  |           * EMPLOYEE MANAGER *              |
                  |                                             |
                  |_____________________________________________|
                  
                  `)
  );
  db.connect();

 /* db.query('SELECT dept_name AS department FROM department', (err,results) => {
    if(err) {
        console.error(err.message);
    }
    let deptChoices = results.map((results) => results.department);

  inquirer.prompt({
    type: "list",
    message: "Choose the department for the role.",
    name: "dept",
    choices: deptChoices
}).then(function(answer) {
console.log(answer.dept)
const deptName = answer.dept;

const sql = 'SELECT id FROM department WHERE dept_name = ?';
const params = deptName;
  const dept_id = db.query(sql, params, (err,results) => {
    if(err) {
        console.error(err.message);
    }else{
        console.log(results);
    }
});
});
});*/
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
        'Update Employee Manager',
        'View Employees By Manager',
        'Quit'],
        name: 'option'
    }).then(function(answer){
        switch(answer.option) {
            case "View All Employees":
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

            case "Update Employee Manager":
                employeeManager();
                break;

            case "View Employees By Manager":
                empByManager();
                break;

            case "Quit":
                quit();
                break;
        }
  })
};

function viewEmp() {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, role_name.title, role_name.salary, department.dept_name, CONCAT (manager.first_name, " ", manager.last_name) AS manager
           FROM employee
           LEFT JOIN role_name ON employee.role_id = role_name.id
           LEFT JOIN department ON role_name.department_id = department.id
           LEFT JOIN employee manager ON employee.manager_id = manager.id`, function (err, results) {
        if(err) {
            console.error(err.message)
        } else {
        console.table(results);
        startApp();
        };
      });
};

function addEmp() {

    db.query('SELECT * FROM role_name', (err,res) => {
        if(err){
            console.error(err.message);
        };
        const roles = res.map(role_name => ({
            name: role_name.title,
            value: role_name.id
        }));

        db.query('SELECT * FROM employee', (err,res) => {
            if(err) {
                console.error(err.message);
            };
            const managers = res.map((employee) => ({
                name: employee.first_name,
                value: employee.id

            }))

            inquirer.prompt([
                {
                    type: "input",
                    message: "Enter the employee's first name.",
                    name: "first_name"
                },
                {
                    type: "input",
                    message: "Enter the employee's last name.",
                    name: "last_name"
                },
                {
                    type: "list",
                    message: "Select the employee's role.",
                    name: "role_id",
                    choices: roles
                },
                {
                    type: "list",
                    message: "Select the employee's manager.",
                    name: "manager_id",
                    choices: managers
                }
            ]).then((answers) => {
                console.log('Successfully added employee.');
                const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
                const params = [answers.first_name, answers.last_name, answers.role_id, answers.manager_id];
                db.query(sql,params, (err, results) => {
                    if (err) {
                        console.error(err.message);
                    } else {
                        startApp();
                    }
            })

        })
    })
})
};

function updateEmpRole() {


    db.query('SELECT * FROM employee', (err,res) => {
        if(err) {
            console.error(err.message);
        };
        const employees = res.map((employee) => ({
            name: employee.first_name,
            value: employee.id

        }))
    
   
     db.query('SELECT * FROM role_name', (err,res) => {
        if(err) {
            console.error(err.message);
        } 
        const roles = res.map((role) => ({
            name: role.title,
            value: role.id
        }));
        
        inquirer.prompt([
        {
            type: "list",
            message: "Select the employee whose role you would like to update.",
            name: "name",
            choices: employees
        },
        {
            type: "list",
            message: "Select the new role of the employee.",
            choices: roles,
            name: "newRole"
        }
    ]).then(function(answer){
        const emp_name = answer.name;
        const newRole = answer.newRole;


        const sql = 'UPDATE employee SET role_id = ? WHERE id = ?';
        const params = [newRole, emp_name]
            db.query(sql, params, (err,result) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log('Successfully updated employee role.');
                    startApp();
                }
            })
        
        })
    })
    })
};

function viewRoles() {

    db.query(`SELECT role_name.id, role_name.title, department.dept_name AS department
    FROM role_name
    LEFT JOIN department ON role_name.department_id = department.id`, function (err, results) {
        console.table(results);
        startApp();
      }); 
}; 

function addRole() {

    db.query('SELECT *  FROM department', (err,results) => {
        if(err) {
            console.error(err.message);
        }
        let deptChoices = results.map((dept) => ({
            name: dept.dept_name,
            value: dept.id
        }));


    inquirer.prompt([
        {
            type: "input",
            message: "Enter the title for the role.",
            name: "role"
        },
        {
            type: "input",
            message: "Enter the salary for the role.",
            name: "salary"
        },
        {
            type: "list",
            message: "Choose the department for the role.",
            name: "dept",
            choices: deptChoices
        }
    ]).then(function(answer) {

        const sql = 'INSERT INTO role_name (title, salary, department_id) VALUES (?, ?, ?)';
        const params = [answer.role, answer.salary, answer.dept];
        db.query(sql,params, (err, results) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log('Successfully added Role.');
                startApp();
            }
    
    });
    });   
});
};

function viewDepts() {
    db.query('SELECT id, dept_name FROM department', function (err, results) {
        console.table(results);
        startApp();
      });    
}; 

function addDepts() {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the department name.",
            name: "dept"
        }
    ]).then(function(answer) {
        db.query('INSERT INTO department (dept_name) VALUES (?)', answer.dept, (err,res) => {
            if(err) {
                console.error(err.message);
            } console.log('Successfully added department.');
            startApp();
        });
    });
};

function quit() {
    process.exit();
}

function employeeManager() {

    db.query('SELECT * FROM employee', (err,res) => {
        if(err) {
            console.error(err.message);
        };
        const employee = res.map((employee) => ({
            name: employee.first_name,
            value: employee.id

        }))
    
   
     db.query('SELECT * FROM employee', (err,res) => {
        if(err) {
            console.error(err.message);
        } 
        const manager = res.map((manager) => ({
            name: manager.first_name,
            value: manager.id
        }));
        
        inquirer.prompt([
        {
            type: "list",
            message: "Select the employee whose manager you would like to update.",
            name: "name",
            choices: employee
        },
        {
            type: "list",
            message: "Select the new manager for the employee.",
            choices: manager,
            name: "manager"
        }
    ]).then(function(answer){
        const emp_name = answer.name;
        const manager_name = answer.manager;


        const sql = 'UPDATE employee SET manager_id = ? WHERE id = ?';
        const params = [manager_name, emp_name]
            db.query(sql, params, (err,result) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log('Successfully updated Manager.');
                    startApp();
                }
            })
        
        })
    })
    })

}

function empByManager() {

    db.query('SELECT * FROM employee WHERE manager_id IS NOT NULL', (err,res) => {
        if(err) {
            console.error(err.message);
        } 
        const manager = res.map((manager) => ({
            name: manager.first_name,
            value: manager.id
        }));

        inquirer.prompt([
            {
                type: "list",
                message: "Select the manager whose employee you would like to view.",
                name: "mg",
                choices: manager
            }
        ]).then(function(answer){
            const mg_id = answer.mg;

            const sql = 'SELECT * FROM employee WHERE manager_id = ?';
            const params = mg_id

            db.query(sql, params, (err,result) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.table(result);
                    startApp();
                }
            })
        });


    });
}