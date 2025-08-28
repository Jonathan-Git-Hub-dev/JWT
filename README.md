# Implementation of JSON Web Token(JWT) like system

## sections
What is a JWT and what i am doing
System break down
API
SQL



### What is a JWT
the documentation for JWT can be found here [JWT_Documentation](https://www.jwt.io/introduction), put simply a JWT is a system of information varification using hashing. A JWT has there feilds a header, a payload and a signiture. The header and body are hashed together to create the signature meaning that a web resource with access to the key can verify the 'claims' made by the header and payload. This has many potentail applications and in this case is used as a way for the application user to varify oneself without always having to send a password repeatedly to the server.

### System breakdown
This systems implements JWT for user varificarion. The appliation offers user account create with email rerificaion, user login and account reseting through email. when a user has provided the correct credentials and been verfied (login, successful email varification of a new account and a successful emial password reset) the user recieves a JWT and a refresh token. The systems operates heirachyically JWT Access token could potentially sent over the internet hundreds of times to access recourses and so are only given a short lifespan (editable in C:\xampp\htdocs\JWT\src\token_configuration.json). Refresh tokens are more pwoerful as they can be used to create JWTs but are used less frequently to mimise risk. the users actual credentials are the most import, being able to genreate an unlimited numbre of refresh tokens, these credentials are only exposed a single time at the intial varifaction fro the session.

### API
this section details the APIs that are implemented to facilitate this system. All data that the API end points are php files and consume the data points listed from the posting process. 

#### [Login ](#Login)
#### [Get_Access_Token ](#Get_Access_Token)
#### [Confirm_User ](#Confirm_User)
#### [Create_User ](#Create_User)
#### [Reset_Send ](#Reset_Send)
#### [Reset_Receive ](#Reset_Receive)
#### [Validate_Access_Token ](#Validate_Access_Token)

##### Login
This interface varifies a user's identity, and requires the following data:\
- email : account's email
- password : account's password\

when credentails matching the database are presented the calling process recieves an inital base64-encoded access token followed by this sessions refresh token base64_encoded seperated by a comma.
the following errors codes are also possible
- 403 : data provided incorrect ()()()()()(order error numerically
- 408 : Invalid credentails.
- 500 : Server error occured.
<br />


##### Get_Access_Token
this interface generates a new access token for the user and requires:/
- uid : The user's ID.
- refresh : The user's refresh token.\

When a real users ID and unexpired refesh token is recieved the calling process recieves an access token./
the following errors codes are also possible
- 403 : Data provided incorrect.
- 499 : Token expired.
- 500 : Server error occured.
<br />


##### Confirm_User
this interface transition a user cocount from the [Incomplete_User](#Incomplete User) table to the 'User' table
- email : users account email.
- code : emailed code.\

when a legitimate email and its accompanying un expired validation code it provided the calling process recieves an inital base64 encoded access token followed by a comma and this sessions refresh token encoded in base 64.
errors
- 403 : data provided incorrect
- 500 : server error occured
<br />


##### Create_User
this interface create an entry in the 'Incomplete_User' table and emails the accompanying varifcation code to the user this interface expects
- email : email of the new account
- password : password for the new account.\

when a novel email an correctly formated password is recieved nothing is return to the calling process
errors
- 403 : data provided incorrect
- 500 : server error occured
<br />


##### Reset_Send
this interface initaites the revocer user sequnce by adding an entry to 'Recover_User' and email the user a recovery code, it requires the following data
- email : email of the account to be reset.\

the calling process recieves nothing when a succesful request is made
errors
- 403 : data provided incorrect
- 429 : max recovery attemps reached
- 500 : server error occured
<br />


##### Reset_Recieve
this interface recovers a user and changes thier password, to do so it requires the following data
- email : eamil fo the accoutn to reset
- code : emailed varifaction code.\

'password' : new passwird
on success tit provided the calling process recieves an inital base64 encoded access token followed by a comma and this sessions refresh token encoded in base 64
- 403 : data provided incorrect
- 429 : max recovery attemps for the last code emailed
- 500 : server error occured
<br />


##### Validate_Access_Token
this interface varifes the claims of a JWT it requires the following data
- token : the JWT to be varified.\

on success the calling process recieves code "400" to indiacte success
errors
- 500 : server error occured
- 403 : data provided incorrect
<br />


### SQL DataBase
this is a explanation of the code in SQDLLSDA>DS.txt and is put here to be referenced in the API section above

#### User
the "User" table represents a fully created user account it has the following data feilds
uId : primary index of this table
uEmail : unique email accociated with account
uPass : password for the account
resets : how many times the password reset sequence has been requested for this account

#### Incomplete User
the "Incomplete_User" represetn a preliminary stage where a user has created an account but has not used thier email to confirm it, in this stage a user is unable to login until the confirmation.
uId : primary index of this table
uEmail : unique email accociated with account
uPass : password for the account
varificationCode : the 6 digit code sent to the email accociated with this account
expiry : the Unix time when the varification code will no longer be elgitimate

#### Recovery User
the "Recover_User" table stores enteries for users who have forgotten thier password and has requested a recovery email, it has the following imformation
uEmail : email of the inital account 
varificationCode : the code that is emailed to a user
expiry : the Unix time when the varification code will no longer be elgitimate
attempts : number of times this code has been "guessed"

#### Refresh Tokens
the "Refresh_Tokens" table stores the refresh token sent to a user on identity confirmation
uId : the user who thsi token applies to
token : the token itself
secret : the hashing seed used for all JWT tokens generated by this refresh token
expiry : the Unix time when this refresh token will no longer work

