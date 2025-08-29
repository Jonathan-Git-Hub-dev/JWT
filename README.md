# Implementation of JSON Web Token(JWT) like system

## sections
[What is a JWT](#What-is-a-JWT)<br />
[System breakdown](#System-breakdown)<br />
[API](#API)<br />
[SQL Database](#sql-database)<br />



### What is a JWT
the documentation for JWT can be found here [JWT_Documentation](https://www.jwt.io/introduction), put simply a JWT is a system of information varification using hashing. A JWT has three feilds a header, a payload and a signiture. The header and payload are hashed together to create the signature meaning that a web resource with access to the key can verify the 'claims' made by the header and payload. This has many potentail applications and in this case is used as a way for the application user to varify oneself without always having to send a password repeatedly to the server.

### System breakdown
This systems implements JWT for user varificarion. The appliation offers user account create with email rerificaion, user login and account reseting through email. when a user has provided the correct credentials and been verfied (login, successful email varification of a new account and a successful emial password reset) the user recieves a JWT and a refresh token. The systems operates heirachyically JWT Access token could potentially sent over the internet hundreds of times to access recourses and so are only given a short lifespan (editable in C:\xampp\htdocs\JWT\src\token_configuration.json). Refresh tokens are more pwoerful as they can be used to create JWTs but are used less frequently to mimise risk. the users actual credentials are the most import, being able to genreate an unlimited numbre of refresh tokens, these credentials are only exposed a single time at the intial varifaction fro the session.

### API
This section details the APIs and the data they consume that are implemented to facilitate this system. All endpoints are avialible in PHP files of the same name. 

#### API sections
[Login ](#Login)<br />
[Get_Access_Token ](#Get_Access_Token)<br />
[Confirm_User ](#Confirm_User)<br />
[Create_User ](#Create_User)<br />
[Reset_Send ](#Reset_Send)<br />
[Reset_Receive ](#Reset_Receive)<br />
[Validate_Access_Token ](#Validate_Access_Token)<br />

##### Login
This interface varifies a user's identity.
###### Data
- email : account's email
- password : account's password
###### Returns
- 403 : Data missing.
- 408 : Invalid credentails.
- 500 : Server error occured.
- Base64 encoded access token and Base64 encoded refresh token seperated by a comma : Login success.
<br />


##### Get_Access_Token
This interface generates a new access token.
###### Data
- uid : The user's ID.
- refresh : The user's refresh token.
###### Returns
- 403 : Token format incorrect.
- 499 : Token expired.
- 500 : Server error occured.
- Base64 encoded access token : Refresh token correct
<br />


##### Confirm_User
This interface transitions a user's account from the [Incomplete User](#Incomplete-User) table to the [User](#User) table
###### Data
- email : users account email.
- code : emailed code.\
###### Returns
- 403 : data provided incorrect
- 500 : server error occured
- Base64 encoded access token and Base64 encoded refresh token seperated by a comma : Data recieved matches database, account created.
<br />


##### Create_User
This interface creates an entry in the [Incomplete User](#Incomplete-User)' table and emails a varification code to the user.
###### Data
- email : email of the new account
- password : password for the new account.
###### Returns
- 400 : Account created and eamil send
- 403 : data provided incorrect
- 500 : server error occured
<br />


##### Reset_Send
This interface initaites the revocer user sequnce by adding an entry to [Recover User](#Recover-User) table and emails the user a recovery code.
###### Data
- email : email of the account to be reset.
###### Returns
- 400 : Email sent.
- 403 : data provided incorrect.
- 429 : max recovery attemps reached.
- 500 : server error occured.
<br />


##### Reset_Receive
This interface changes a users password.
###### Data
- email : eamil of the account that the user wants reset
- code : emailed varifaction code.
- password : new password.
###### Returns
on success tit provided the calling process recieves an inital base64 encoded access token followed by a comma and this sessions refresh token encoded in base 64
- 403 : data provided incorrect
- 429 : max recovery attemps for the last code emailed
- 500 : server error occured
- Base64 encoded access token and Base64 encoded refresh token seperated by a comma : New password saved and user loggedin
<br />


##### Validate_Access_Token
This interface varifes the claims of a JWT it requires the following data
###### Data
- token : the JWT to be varified.
###### Returns
- 400 : JWT correct (claims inside JWT match singnature, so claim of user identiy valid).
- 500 : server error occured.
- 403 : data provided incorrect.
<br />


### SQL Database
This sections details the database [(Code found here)](https://github.com/Jonathan-Git-Hub-dev/JWT/edit/main/sql.txt) and is put here to be referenced in the API section above.

#### User
the "User" table represents a fully created user account it has the following data feilds
- uId : primary index of this table
- uEmail : unique email accociated with account
- uPass : password for the account
- resets : how many times the password reset sequence has been requested for this account

#### Incomplete User
the "Incomplete_User" represetn a preliminary stage where a user has created an account but has not used thier email to confirm it, in this stage a user is unable to login until the confirmation.
- uId : primary index of this table
- uEmail : unique email accociated with account
- uPass : password for the account
- varificationCode : the 6 digit code sent to the email accociated with this account
- expiry : the Unix time when the varification code will no longer be elgitimate

#### Recover User
the "Recover_User" table stores enteries for users who have forgotten thier password and has requested a recovery email, it has the following imformation
- uEmail : email of the inital account 
- varificationCode : the code that is emailed to a user
- expiry : the Unix time when the varification code will no longer be elgitimate
- attempts : number of times this code has been "guessed"

#### Refresh Tokens
the "Refresh_Tokens" table stores the refresh token sent to a user on identity confirmation
- uId : the user who thsi token applies to
- token : the token itself
- secret : the hashing seed used for all JWT tokens generated by this refresh token
- expiry : the Unix time when this refresh token will no longer work

