# Microblog-API-Challenge

This project was made for learning purposes in node, postgreSQL and WebAPIs.

Instructions for the server:

1. Clone the repo
2. Create a .env file and add the variables defined in the .env.example
3. run the command > npm install
4. run the command > npn run prisma:migrate:run
5. run the command > npm run compile
6. run the command > npm run server
7. Check under the folder Postman, there is a json file of the workspace for the request
8. Import the workspace in your Postman application
9. In the workspace, find "User SignUp" request.
10. Edit the body request with your email and send.
11. You will get the response a jwt token. Copy that value.
12. In Postman/Insomnia application, create an evironment VARIABLE with the name "authtoken". The VALUE of this VARIABLE will be the token previously copied.

Instructions for the test:

1. Create a .env.test file and add the variables defined in the .env.example
2. run the command > prisma:migrate:test
3. run the command > npm run test

About the paths:
/signout: Log out the user
/signin: Log in the user with his email and password
/emailconfirmation: Allows to confirm the email of user, the body has to contain the activation code that is sent to the email of user.
