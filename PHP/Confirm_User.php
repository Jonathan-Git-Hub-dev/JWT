<?php
require_once "Utility.php";
require_once "Create_Credentials.php";


$email = Declared($_POST["email"]);
$code = Declared($_POST["code"]);


//checking if these credentials exist
$sql = "SELECT * FROM Incomplete_User WHERE uEmail = ? AND varificationCode = ?";
$result = Try_Query($sql, "ss", $email, $code);
if ($result->num_rows <= 0)
{
    Finish($error_code_bad_data);
}

$row = $result->fetch_assoc();
if(time() > $row["expiry"])//make sure it has been less then 10 min
{
    Finish($error_code_bad_data);
}
$password = $row["uPass"];
if(!Validate_Password($password))
{
    Finish($error_code_bad_data);
}

//create entery in the real user table and remove enrty from transitional table
$sql = "INSERT INTO User (uEmail, uPass) VALUES (?, ?)";
$result = Try_Query($sql, "ss", $email, $password);
$sql = "DELETE FROM Incomplete_User WHERE BINARY uEmail = ?";
$query_exec = Try_Query($sql, "s", $email);

//generate a crendential using user's new id
$sql = "SELECT * FROM User WHERE uEmail = ?";
$res = Try_Query($sql, "s", $email);
$row = $res->fetch_assoc();
Generate_Credentials($row['uId']);//creates the refresh and access tokens
