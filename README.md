# TablerEnabler

1) mkdir server
2) cd server
3) npm init -y
4) npm i express body-parser cors dotenv mongoose nodemon body-parser helmet morgan
    express - api framework
        https://www.simplilearn.com/tutorials/nodejs-tutorial/what-is-express-js#:~:text=StackExplore%20Program-,What%20Is%20Express%20JS%3F,helps%20manage%20servers%20and%20routes

    body-parser - pasing data coming in
        Body-parser parses is an HTTP request body that usually helps when you need to know more than just the URL being hit.
        Specifically in the context of a POST, PATCH, or PUT HTTP request where the information you want is contained in the body.
        Using body-parser allows you to access req.body from within routes and use that data.
        For example: To create a user in a database.        

    cors - cross origina sharing. Allows a server to indicate any origins (domain, scheme, or port) other than its own from which a browser should permit loading resources

    dotenv - environment variables. 
        a library or module that loads environment variables from a .env file into the runtime environment of a program

    helmet - protecting apis
        middleware for Node. js applications that provides a comprehensive set of security-related HTTP headers

    morgan - logging api calls
        is a Node. js and Express middleware to log HTTP requests and errors, and simplifies the process

    mongoose - handling MongoDB calls

    nodemon - live server reload


5) cd ..
    into root directory

6) npx create-react-app client

7) cd client

8) npm i react-redux @reduxjs/toolkit react-datepicker react-router-dom@6 @mui/material @emotion/react @emotion/styled @mui/icons-material @mui/x-data-grid @nivo/geo