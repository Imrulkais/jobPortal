Project Name: Job Portal

How to install and use this project-

1. Download and Install the node js according to your Operating system. For details use this link-

https://nodejs.org/en/download/

2. Install the npm. For npm installation details see this link-

https://docs.npmjs.com/cli/install

3. Install Mysql and create a database named "jobPortal". Upload the sql file YourRootDirectory\jobPortal\jobPortal.sql exactly to that database. To install Mysql see the following link-

http://dev.mysql.com/doc/refman/5.7/en/installing.html

4. Edit your database setting in YourRootDirectory\jobPortal\db.js.

var settings = {
    host     : 'localhost',
    port     :  your port what you are going to use,
    user     : 'your user name',
    password : 'your password',
    database : 'jobPortal
};

5. Go to your terminal and change the directory to this project directory. And start the npm. To start npm write-

npm start

6. Go to your Browser and write-

localhost:3000