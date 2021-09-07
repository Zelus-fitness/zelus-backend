# zelus-backend

# How to run back-end locally

1. Type ```git clone https://github.com/caesar-chin/zelus-backend/tree/development```in your command line

2. Make sure you have Docker and PostgreSQL installed.

3. Type ```npm install``` and ```npm install nodemon dotenv -g``` in your command line

5. Make a new file inside the project called "**docker-compose.yml**" and paste the example Docker file

6. Make another new file called "**.env**" and paste the example configs

7. Type ```docker-compose up``` to start your Docker container

8. To run the code, type ```npm start```, the project has a hot reload so there is no need to restart the code. 

# How to access PostgreSQL database
.env has the credentials you need

1. Type ```psql -U <DB_USER> -p <DB_PORT>```

2. You will then need to type a password, which you already know :)

### If command line does not recognize psql, then run the SQL Script (PSQL) by typing "psql" in your Window Search

### If you are running this for the first time, you will need to make the database:
### type ```CREATE DATABASE zelus;```


