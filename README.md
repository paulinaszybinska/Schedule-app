# Schedule app

This application is used to manage the work schedules of users and requires registration and login to access its functionalities. After logging in, users can view the list of all users and their schedules, but can only modify their own schedule.
For the purpose of the project, a database and endpoints were created to handle various functionalities using HTTP POST and GET methods.

## Stack
* Express.js
* Node.js
* PostgreSQL
* EJS templates

## Application functionalities
* Authorization - user registration and login/logout, which provides access to the rest of the application.
* Access to the set of schedules of all users.
* Access to the schedule of only the logged-in user.
* Adding new entries to the schedule. 

## Run locally
```
    $ git clone https://github.com/paulinaszybinska/Schedule-app.git 
    $ cd schedule-app 
    $ npm init -y 
    $ node src/main.js 
    or 
    $ npx nodemon src/main.js
```
<br><br>
