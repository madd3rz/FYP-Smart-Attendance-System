# Node Web Application boilerplate

This NodeJs project uses Express with Sequelize as ORM and MySQL as database.

### Prerequisites

1. ```NodeJs```
2. ```NPM```
3. ```MySQL```

### Quick start for UNIX env

1. Clone the repository.
2. Change directory to the project folder
3. Create database in MySQL.
4. Update the your database name and credentials in the `.env` file.
5. Run the application by executing ```script.sh``` (MySQL service should be up and running).
6. Access `http://localhost` in the browser and you're ready to go!

### Quick start for WIN env
1. Clone the repository.
2. Change directory to the project folder
3. Create database in MySQL.
4. Update the your database name and credentials in the `.env` file.
5. Run the application by executing ```script.bat``` (MySQL service should be up and running).
6. Access `http://localhost` in the browser and you're ready to go!

### Folder Structure
```
.
├── app/
│   ├── controllers/           # Controllers
│   ├── middlewares/           # Middlewares
│   ├── models/                # Sequelize database models
├── config/
├── public/                    
│   ├── css/
│   ├── js/                     
│	├── fonts/                 
│   ├── images/
├── .env                       # Contains DB configuration and MQTT broker IP 
├── routes/                    # Route definitions
├── reports/                   # Path to store the generated attendance reports PDF
├── views/                     # All view files
├── index.js                   # Express application
└── package.json               # NPM Dependencies and scripts
```