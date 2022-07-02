# [Smart Attendance System with IoT using ESP32](https://github.com/madd3rz/FYP-Smart-Attendance-System.git)

This NodeJs project uses Express with Sequelize as ORM and MySQL as database.

### Prerequisites

1. ```NodeJs```
2. ```NPM```
3. ```MySQL```

### Quick start

1. Clone the repository.
2. Change directory to the project folder
3. Create database in MySQL.
4. Update the your database name and credentials in the `.env` file.
5. Run the application by executing ```script.sh``` (If you're running UNIX env) or ```script.bat``` (If you' running WIN env) (MySQL service should be up and running).
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