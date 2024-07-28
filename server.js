const inquirer = require("inquirer");
const express = require("express");
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
const { log, error } = require("console");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_NAME
});

function displayBanner(){
  console.log(`
    #####################################################
    #                                                   #
    #          Employee Tracker System                  #
    #                                                   #
    #####################################################
    `)
}

function runSchema() {
  const schemaPath = path.join(__dirname, 'Assets/sql/schema.sql');
  const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
  return pool.query(schemaSQL)
    .then(() => {
      console.log("Schema applied successfully.");
    })
    .catch(err => {
      console.error("Error applying schema: ", err);
    });
}


function runSeed() {
  const seedPath = path.join(__dirname, 'Assets/sql/seed.sql');
  const seedSQL = fs.readFileSync(seedPath, 'utf8');
  return pool.query(seedSQL)
    .then(() => {
      console.log("Seed data inserted successfully.");
    })
    .catch(err => {
    console.log("Error applying seed data: ", err);
  })
}




function init() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View Department",
          "View Roles",
          "View Employees",
          "Add Department",
          "Add Role",
          "Add Employee",
          "Update Employee Role",
        ],
        name: "action",
      },
    ])
    .then((answers) => {
      if (answers.action == "View Department") {
        viewDepartments();
      } else if (answers.action == "View Roles") {
        viewRoles();
      } else if (answers.action == "View Employees") {
        viewEmployees();
      } else if (answers.action == "Add Department") {
        addDepartment();
      } else if (answers.action == "Add Role") {
        addRoles();
      } else if (answers.action == "Add Employee") {
        addEmployee();
      } else if (answers.action == "Update Employee Role") {
        updateEmployeeRole();
      } else {
        console.log("Invalid Choice");
      }
    });
}

function viewDepartments() {
  pool.query("SELECT * FROM departments", (err, res) => {
    if (err) throw err;
    
    console.log(formatTable(['ID', 'Name'], res.rows));
    init();
  });
}

function viewRoles() {
  const query = `
    SELECT 
      r.id, 
      r.title, 
      r.salary, 
      d.name AS department
    FROM 
      roles r
    LEFT JOIN 
      departments d ON r.department_id = d.id;
  `;

  pool.query(query, (err, res) => {
    if (err) throw err;
    console.log(formatTable(['ID', 'Title', 'Salary', 'Department'], res.rows));
    init();
  });
}

function viewEmployees() {
  const query = `
    SELECT 
      e1.id, 
      e1.first_name, 
      e1.last_name, 
      r.title, 
      d.name AS department, 
      r.salary, 
      COALESCE(e2.first_name || ' ' || e2.last_name, 'NULL') AS manager
    FROM 
      employees e1
    LEFT JOIN 
      roles r ON e1.role_id = r.id
    LEFT JOIN 
      departments d ON r.department_id = d.id
    LEFT JOIN 
      employees e2 ON e1.manager_id = e2.id;
  `;

  pool.query(query, (err, res) => {
    if (err) throw err;

    console.log(formatTable(['ID', 'First Name', 'Last Name', 'Title', 'Department', 'Salary', 'Manager'], res.rows));
    init();
  });
}


function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the department you would like to add?",
        name: "new_department",
      },
    ])
    .then((response) => {
      pool.query(
        `INSERT INTO departments (name) VALUES ($1)`,
        [response.new_department],
        (err, res) => {
          if (err) throw err;

          console.log("Department Added Successfully.");
          init();
        }
      );
    });
}

function addRoles() {
  pool.query("SELECT id, name FROM departments")
    .then((departmentsRes) => {
      const departments = departmentsRes.rows.map(department => ({ name: department.name, value: department.id }));
      
      inquirer
        .prompt([
          {
            type: "input",
            message: "What is the name of the role you would like to add?",
            name: "new_role"
          },
          {
            type: "input",
            message: "What is the salary you would like to add?",
            name: "new_salary"
          },
          {
            type: "list",
            message: "Select the department for the new role:",
            name: "new_department",
            choices: departments
          },
        ])
        .then((response) => {
          pool.query(
            `INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)`,
            [response.new_role, response.new_salary, response.new_department],
            (err, res) => {
              if (err) throw err;

              console.log("Added new role to the database.");
              init();
            }
          );
        });
    })
    .catch(err => {
      console.error("Error fetching departments: ", err);
    });
}


function addEmployee() {
  Promise.all([
    pool.query("SELECT id, title FROM roles"),
    pool.query("SELECT id, first_name, last_name FROM employees")
  ]).then(([rolesRes, managersRes]) => {
    const roles = rolesRes.rows.map(role => ({ name: role.title, value: role.id }));
    const managers = managersRes.rows.map(manager => ({ name: `${manager.first_name} ${manager.last_name}`, value: manager.id }));
    
    managers.unshift({ name: 'None', value: null }); // Add an option for no manager

    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the first name of the employee you would like to add?",
          name: "first_name"
        },
        {
          type: "input",
          message: "What is the last name of the employee you would like to add?",
          name: "last_name"
        },
        {
          type: "list",
          message: "Select the role for the new employee:",
          name: "role_id",
          choices: roles
        },
        {
          type: "list",
          message: "Select the manager for the new employee:",
          name: "manager_id",
          choices: managers
        }
      ])
      .then((response) => {
        pool.query(
          `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`,
          [
            response.first_name,
            response.last_name,
            response.role_id,
            response.manager_id
          ],
          (err, res) => {
            if (err) throw err;

            console.log("Added Employee to the database.");
            init();
          }
        );
      });
  }).catch(err => {
    console.error("Error fetching roles or managers: ", err);
  });
}


function updateEmployeeRole() {
  pool.query("SELECT * FROM employees", (err, res) => {
    if (err) throw err;
    const employeeList = res.rows.map((employee) => ({
      value: employee.id,
      name: `${employee.first_name} ${employee.last_name}`,
    }));

    pool.query("SELECT * FROM roles", (err, res) => {
      if (err) throw err;
      const roleList = res.rows.map((role) => ({
        value: role.id,
        name: role.title,
      }));

      inquirer
        .prompt([
          {
            type: "list",
            message: "Which employee would you like to update?",
            choices: employeeList,
            name: "employee",
          },
          {
            type: "list",
            message: "What is the new Role?",
            choices: roleList,
            name: "role",
          },
        ])
        .then((response) => {
          pool.query(
            `UPDATE employees SET role_id = $1 where id = $2`,
            [response.role, response.employee],
            (err, res) => {
              if (err) throw err;
              console.log('Employee role updated successfully.');
              init();
            }
          );
        });
    });
  });
}

function formatTable(headers, rows) {
  const colWidths = headers.map((header, i) => {
    return Math.max(header.length, ...rows.map(row => String(row[header.toLowerCase().replace(' ', '_')]).length)) + 2;
  });

  const headerRow = headers.map((header, i) => header.padEnd(colWidths[i])).join('|');

  const separatorRow = headers.map((header, i) => '-'.repeat(colWidths[i])).join('+');

  const dataRows = rows.map(row => {
    return headers.map((header, i) => String(row[header.toLowerCase().replace(' ', '_')]).padEnd(colWidths[i])).join('|');
  }).join('\n');

 
  return [headerRow, separatorRow, dataRows].join('\n');
}


pool.connect()
  .then(() => {
    return runSchema();
  }).then(() => {
    return runSeed();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started Successfully`);
    });
    displayBanner();
    init();
    
  }).catch(err => {
    console.error("Error Starting server: ", err);
  })



