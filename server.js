const inquirer = require("inquirer");
const express = require("express");
const fs = require("fs");
const { Pool } = require("pg");
const { removeAllListeners } = require("process");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

const pool = new Pool({
  user: process.env.DV_USER,
  //   password: process.env.DB_PASSWORD,
  network: 5432,
  database: "employees_db",
});

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
          "Add Employees",
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
      } else if (answers.action == "Add employee") {
        addEmployee();
      } else if (answers.action == "Update Employee Role") {
        addUpdateEmployee();
      }
    });
}

function viewDepartments() {
  pool.query("SELECT * FROM departments", (err, res) => {
    if (err) throw err;
    console.log(res);
    init();
  });
}

function viewRoles() {
  pool.query("SELECT * FROM roles", (err, res) => {
    if (err) throw err;
    console.log(res.rows);
    init();
  });
}

function viewEmployees() {
  pool.query("SELECT * FROM employees", (err, res) => {
    if (err) throw err;
    console.log(res.rows);
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

          console.log(res.rows);
          init();
        }
      );
    });
}

function addRoles() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the role you would like to add?",
        name: "new_role",
      },
      {
        type: "input",
        message: "What is the salary you would like to add?",
        name: "new_salary",
      },
      {
        type: "input",
        message: "What is the department you would like to add?",
        name: "new_department",
      },
    ])
    .then((response) => {
      pool.query(
        `INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)`,
        [response.new_role, response.new_salary, response.new_dept_id],
        (err, res) => {
          if (err) throw err;

          console.log(res.rows);
          init();
        }
      );
    });
}

function addEmployees() {
  inquirer
    .prompt([
      {
        type: "input",
        message:
          "What is the first name of the employee you would like to add?",
        name: "first_name",
      },

      {
        type: "input",
        message: "What is the last name of the employee you would like to add?",
        name: "last_name",
      },

      {
        type: "input",
        message: "What is the new role you would like to add?",
        name: "role_id",
      },

      {
        type: "input",
        message: "What is the manager you would like to add?",
        name: "manager_id",
      },
    ])
    .then((response) => {
      pool.query(
        `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`,
        [
          response.first_name,
          response.last_name,
          response.role_id,
          response.manager_id,
        ],
        (err, res) => {
          if (err) throw err;

          console.log(res.rows);
          init();
        }
      );
    });
}

function updateEmployeeRole() {
  pool.query("SELECT * FROM employees", (err, res) => {
    if (err) throw err;
    const employeeList = results.rows.map((employee) => ({
      value: employees.id,
      name: `${employee.first_name} ${employee.last_name}`,
    }));
  });

  pool.query("SELECT * FROM roles", (err, res) => {
    if (err) throw err;
    const roleList = results.rows.map((role) => ({
      value: role.id,
      name: role.title,
    }));
  });

  inquirer
    .prompt([
      {
        type: "list",
        message: "Which message would you like to update?",
        choices: employeeList,
      },

      {
        type: "list",
        message: "What is the new Role?",
        choices: roleList,
      },
    ])
    .then((response) => {
      pool.query(
        `UPDATE employees SET role_id = $1 where id = $2`,
        [response.role, response.employee],
        (err, res) => {
          if (err) throw err;
          console.log(res.rows);
          init();
        }
      );
    });
}

pool.connect();

init();

app.listen(PORT, () => {
  console.log(`Server started at https://127.0.0.1:${PORT} Successfully`);
});
