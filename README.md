# Implementation of JSON Web Token(JWT) like system

## sections
[What is a JWT](#What-is-a-JWT)<br />
[System breakdown](#System-breakdown)<br />
[API](#API)<br />
[SQL Database](#sql-database)<br />



### What is a JWT
the documentation for JWT can be found here [JWT_Documentation](https://www.jwt.io/introduction), put simply a JWT is a system of information verification using hashing. A JWT has three fields a header, a payload and a signature. The header and payload are hashed together to create the signature meaning that a web resource with access to the key can verify the 'claims' made by the header and payload. This has many potential applications and in this case is used as a way for the application’s user to verify oneself without always having to send a password repeatedly to the server.

### System breakdown
This system implements JWT for user verification. The application offers user account creation with email verification, user login and account password resetting through email. when a user has provided the correct credentials and has been verified (this happens on login, successful email verification of a new account and a successful email password reset) the user receives a JWT and a refresh token. The system operates hierarchically, JWT Access tokens could potentially be sent over the internet hundreds of times to access recourses, because it is so exposed it is given only a short lifespan. [This life span is detailed  here](https://github.com/Jonathan-Git-Hub-dev/JWT/blob/main/src/token_configuration.json). Refresh tokens are more powerful as they can be used to create JWTs but are less frequently needed, this means they are exposed less which minimizes risk. The user’s actual credentials are the most import, being able to generate an unlimited number of refresh tokens, these credentials are only exposed a single time at the initial verification for the session.

### API
This section details the APIs and the data they consume. All endpoints are available in PHP files of the same name. 

#### API sections
[Login ](#Login)<br />
[Get_Access_Token ](#Get_Access_Token)<br />
[Confirm_User ](#Confirm_User)<br />
[Create_User ](#Create_User)<br />
[Reset_Send ](#Reset_Send)<br />
[Reset_Receive ](#Reset_Receive)<br />
[Validate_Access_Token ](#Validate_Access_Token)<br />

##### Login
This interface verifies a user's identity.
###### Data
- email : account's email.
- password : account's password.
###### Returns
- 403 : Data missing.
- 408 : Invalid credentials.
- 500 : Server error occurred.
- Base64 encoded access token and Base64 encoded refresh token separated by a comma : Login success.
<br />


##### Get_Access_Token
This interface generates a new access token.
###### Data
- uid : The user's ID.
- refresh : The user's refresh token.
###### Returns
- 403 : Token format incorrect.
- 499 : Token expired.
- 500 : Server error occurred.
- Base64 encoded access token : Refresh token correct
<br />


##### Confirm_User
This interface transitions a user's account from the [Incomplete User](#Incomplete-User) table to the [User](#User) table creating a fully instantiated user.
###### Data
- email : Users account email.
- code : Emailed code.
###### Returns
- 403 : Data provided incorrect.
- 500 : Server error occurred.
- Base64 encoded access token and Base64 encoded refresh token separated by a comma : Data received matches database, account created.
<br />


##### Create_User
This interface creates an entry in the [Incomplete User](#Incomplete-User)' table and emails a verification code to the user.
###### Data
- email : Email of the new account.
- password : Password for the new account.
###### Returns
- 400 : Account created and email sent.
- 403 : Data provided incorrect.
- 500 : Server error occurred.
<br />


##### Reset_Send
This interface initiates the recover user sequence by adding an entry to [Recover User](#Recover-User) table and emails the user a recovery code.
###### Data
- email : Email of the account to be reset.
###### Returns
- 400 : Email sent.
- 403 : Data provided incorrect.
- 429 : Max recovery attempts reached.
- 500 : Server error occurred.
<br />


##### Reset_Receive
This interface changes a user’s password.
###### Data
- email : Email of the account that the user wants reset.
- code : Emailed verification code.
- password : New password.
###### Returns
- 403 : Data provided incorrect.
- 429 : Max recovery attempts for the last code emailed.
- 500 : Server error occurred.
- Base64 encoded access token and Base64 encoded refresh token separated by a comma : New password saved and user logged in.
<br />


##### Validate_Access_Token
This interface verifies the claims of a JWT it requires the following data.
###### Data
- token : The JWT to be verified.
###### Returns
- 400 : JWT correct (claims inside JWT match signature, so claim of user identity valid).
- 500 : Server error occurred.
- 403 : Data provided incorrect.
<br />


### SQL Database
This section details the database [(Code found here)](https://github.com/Jonathan-Git-Hub-dev/JWT/edit/main/sql.txt) and is put here to be referenced in the API section above.

#### User
the "User" table represents a fully created user account.
###### Data

- uId : Primary index of this table.
- uEmail : Unique email associated with account.
- uPass : Password for the account.
- resets : How many times the password reset sequence has been requested for this account.

#### Incomplete User
the "Incomplete_User" represents a preliminary stage where a user has created an account but has not used their email to confirm it, in this stage a user is unable to login until the confirmation.
###### Data
- uId : Primary index of this table.
- uEmail : Unique email associated with account.
- uPass : Password for the account>
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

