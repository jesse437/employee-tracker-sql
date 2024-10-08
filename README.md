# employee-tracker-sql

# 1. Description

### This application is intended to help companies access employee databases. As a developer I want to make the interection with the interface user friendly for non developers.

# 2. User Story

```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database
```

# 3. How to Use

## This command-line application allows us to view and add departments, roles and employess, essentially accessing a companies database. To start we will open the command-line and run our application with the command "npm run start". From there you'll be presented with the different options to view and add. You can then choose from the options to modify the companies databae.

# 4. Deployment

### https://github.com/jesse437/employee-tracker-sql

# 5. Visuals

![alt text](img.png)

<video controls src="presentation.mp4" title="Title"></video>

# 6. Collaborators

### [Jesus Ruiz Gutierrez](https://github.com/jesse437)

# 7. Technologies Used

- Node.js
- Inquirer
- PostgreSQL
