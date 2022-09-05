const inquirer = require("inquirer");
const db = require("./db/connection");
const ctable = require("console.table");
db.connect(() => {
    init();
});

// Function to initialize the main menu
function init() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "mainMenu",
                message: "What would you like to do?",
                choices: [
                    "View All Departments",
                    "View All Roles",
                    "View All Employees",
                    "Add a Department",
                    "Add a Role",
                    "Add an Employee",
                    "Update an Employee",
                ],
            },
        ])
        .then((answers) => {
            console.log("Answer:", answers.mainMenu);

            if (answers.mainMenu === "View All Departments") {
                viewDepartments();
            } else if (answers.mainMenu === "View All Roles") {
                viewRoles();
            } else if (answers.mainMenu === "View All Employees") {
                viewEmployees();
            } else if (answers.mainMenu === "Add a Department") {
                addDepartment();
            } else if (answers.mainMenu === "Add a Role") {
                addRole();
            } else if (answers.mainMenu === "Add an Employee") {
                addEmployee();
            } else {
                updateEmployee();
            }
        });
};

// View all current departments
function viewDepartments() {
    const sql = `SELECT * FROM department`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }
        console.table(rows);
        init();
    })
};

// View all current roles
function viewRoles() {
    const sql = `SELECT * FROM role`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }
        console.table(rows);
        init();
    });
};

// View all current employees
function viewEmployees() {
    const sql = `SELECT * FROM employee`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
        }
        console.table(rows);
        init();
    });
};

// Add a new department
function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "deptName",
            message: "What department would you like to add?"
        },
    ])
        .then(answers => {
            const sql = `INSERT INTO department (name) VALUES (?)`;
            const params = [answers.deptName];

            db.query(sql, params, (err) => {
                if (err) {
                    console.log(err);
                }
                viewDepartments();
            });
        });
};

// Add a new role
function addRole() {
    inquirer.prompt([
        {
            type: "input",
            name: "roleName",
            message: "What is the name of the role?"
        },
        {
            type: "input",
            name: "roleSalary",
            message: "What is the salary for this role?"
        },
        {
            type: "input",
            name: "deptId",
            message: "What is the department id for this role?"
        },
    ])
        .then(answers => {
            const sql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;
            const params = [answers.roleName, answers.roleSalary, answers.deptId];

            db.query(sql, params, (err) => {
                if (err) {
                    console.log(err);
                }
                viewRoles();
            });
        });
};

// Add a new employee
function addEmployee() {
    // db.query("SELECT title AS name, id FROM value AS employee", (err, roleData) => {
        // db.query("SELECT concat(first_name, ' ', last_name) AS name, id AS value FROM employee", (err, managerData) => {
            inquirer.prompt([
                {
                    type: "input",
                    name: "employeeFirstName",
                    message: "What is the employee's first name?"
                },
                {
                    type: "input",
                    name: "employeeLastName",
                    message: "What is the employee's last name?"
                },
                {
                    // type: "list",
                    type: "input",
                    name: "roleId",
                    message: "What is the role id for this employee?",
                    // choices: roleData
                },
                {
                    // type: "list",
                    type: "input",
                    name: "managerId",
                    message: "What is the manager id for this employee?",
                    // choices: managerData
                },
            ])
                .then(answers => {
                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
                    const params = [answers.employeeFirstName, answers.employeeLastName, answers.roleId, answers.managerId];

                    db.query(sql, params, (err) => {
                        if (err) {
                            console.log(err);
                        }
                        viewRoles();
                    });
                });
        // });
    // });
};

// Update an Employee
function updateEmployee() {
    db.query("SELECT title AS name, id AS value FROM role", (err, roleData) => {
        db.query("SELECT concat(first_name, ' ', last_name) AS name, id AS value FROM employee", (err, employeeData) => {
            inquirer.prompt([
                {
                    type: "list",
                    name: "roleId",
                    message: "What is the role id for this employee?",
                    choices: roleData
                },
                {
                    type: "list",
                    name: "employeeId",
                    message: "What is the id for this employee?",
                    choices: employeeData
                },
            ])
                .then(answers => {
                    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
                    const params = [answers.roleId, answers.employeeId];

                    db.query(sql, params, (err) => {
                        if (err) {
                            console.log(err);
                        }
                        viewEmployees();
                    });
                });
        });
    });
};