INSERT INTO department (dept_name)
VALUES ("Finance"),
       ("Marketing"),
       ("HR"),
       ("Information Technology");

INSERT INTO role_name (title, salary, department_id)
VALUES ("Financial Analyst", 75000, 1),
       ("Finance Intern", 30000, 1),
       ("Digital Media Manager", 63000, 2),
       ("Public Relations Specialist", 60000, 2),
       ("Human Resources Coordinator", 50000, 3),
       ("Human Resources Manager", 80000, 3),
       ("Full Stack Developer", 90000, 4),
       ("Data Analyst", 75000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Andrea", "Nichola", 1, NULL),
       ("Jennifer", "Smith", 2, NULL),
       ("Sam", "Rhoads", 3, NULL),
       ("Daniel", "Brown", 4, NULL),
       ("Harry", "James", 5, NULL),
       ("Somya", "Gupta", 6, NULL),
       ("Savita", "Manchanda", 7, NULL),
       ("Keith", "Scott", 8, NULL);