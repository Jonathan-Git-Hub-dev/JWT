# Implementation of JSON Web Token(JWT) like system

## sections
[What is a JWT](#What-is-a-JWT)<br />
[System breakdown](#System-breakdown)<br />
[API](#API)<br />
[SQL Database](#sql-database)<br />



### What is a JWT
the documentation for JWT can be found here [JWT_Documentation](https://www.jwt.io/introduction), put simply a JWT is a system of information verification using hashing. A JWT has three fields a header, a payload and a signature. The header and payload are hashed together to create the signature meaning that a web resource with access to the key can verify the 'claims' made by the header and payload. This has many potential applications and in this case is used as a way for the application’s user to verify oneself without always having to send a password repeatedly to the server.

### System breakdown
This system implements JWT for user verification. The application offers user account creation with email verification, user login and account password resetting through email. when a user has provided the correct credentials and been verified (this happens on login, successful email verification of a new account and a successful email password reset) the user receives a JWT and a refresh token. The system operates hierarchically, JWT Access tokens could potentially be sent over the internet hundreds of times to access recourses, because it is so exposed it is given only a short lifespan. [This life span is detailed  here](https://github.com/Jonathan-Git-Hub-dev/JWT/blob/main/src/token_configuration.json). Refresh tokens are more powerful as they can be used to create JWTs but are less frequently needed, this means they are exposed less which minimizes risk. The user’s actual credentials are the most import, being able to generate an unlimited number of refresh tokens, these credentials are only exposed a single time at the initial verification for the session.
#### Delployment guide
To deploy this application, download the repo into a local folder.

Follow this Vite set up guide

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

<br /><br />
Download React-Router-Dom and jQuery to the downloaded repo, this can be done using the following commands:
-	npm install react-router-dom
-	npm install jquery
<br /><br />
set up the backend:
local host a PHP server on your machine (I am using Xampp, in which PHP scripts have to be moved into the htdocs file to be run) change the Url variable found in constants.js to the path to your PHP server. <br />
Run an SQL database (this can also be done using Xampp). Run the SQL commands found in sql.txt to initialize the relevant tables needed for this application.<br />
Download PHP mailer to handle emailing verification codes.<br />
In the PHP folder create a file called config.php it should have the following structure with all the blank strings substituted for your SQL credentials and your credentials for Gmail (to successfully send email with Gmail and PHP mailer two-factor authentication must be set up and an app password must be requested).<br />
<br /><br />
<?php

$config = [<br />
    "database" => [<br />
        "server_name" => "",<br />
        "username" => "",<br />
        "password" => "",<br />
        "database" => "JWT"<br />
    ],<br />
    "mail_credentials" => [<br />
        "username" => "",<br />
        "password" => ""<br />
    ]<br />
];<br /><br />

Finally, the application can be run using the command 
-	npm run dev


### API
[API documentation in OpenAPI format can be found here]( https://jonathan-git-hub-dev.github.io/JWT/API/index.html)



### SQL Database
This section details the database [(Code found here)](https://github.com/Jonathan-Git-Hub-dev/JWT/edit/main/sql.txt) and is put here to be referenced in the API section above.

#### User
the "User" table represents a fully created user account.
###### Data

- uId : Primary index of this table.
- uEmail : Unique email associated with account.
- uPass : Password for the account in hashed format.
-salt : Added when hashing password for security reasons. 
- resets : How many times the password reset sequence has been requested for this account.

#### Incomplete User
the "Incomplete_User" represents a preliminary stage where a user has created an account but has not used their email to confirm it, in this stage a user is unable to login until the confirmation.
###### Data
- uId : Primary index of this table.
- uEmail : Unique email associated with account.
- uPass : Password for the account in hashed format.
-salt : Added when hashing password for security reasons. 
- varificationCode : The 6 digit code sent to the email associated with this account.t
- expiry : The Unix time when the verification code will no longer be legitimate.

#### Recover User
the "Recover_User" table stores entries for users who have forgotten their password and have requested a recovery email.
###### Data
- uEmail : Email of the initial account.
- varificationCode : The code that is emailed to a user.
- expiry : The Unix time when the verification code will no longer be legitimate.
- attempts : Number of times this code has been "guessed".

#### Refresh Tokens
the "Refresh_Tokens" table stores the refresh token sent to a user on identity confirmation.
###### Data
- uId : The user who this token applies to.
- token : The token itself.
- secret : The hashing seed used for all JWT tokens generated by this refresh token.
- expiry : the Unix time when this refresh token will no longer work.
