<?php
require_once "Utility.php";

$email = Declared($_POST["email"]);
$password = Declared($_POST["password"]);

//make sure data follows convention
if(!Validate_Email($email))
{
    Finish($error_code_bad_data);
}
if(!Validate_Password($password))
{
    Finish($error_code_bad_data);
}

//make sure email is not in use
$sql = "SELECT * FROM User WHERE uEmail = ?";
$result = Try_Query($sql, "s", $email);
if ($result->num_rows > 0)
{
    Finish($error_code_bad_data);
}

//create validation code and expiry of that code
$emailed_confirmation_code = (string) rand(100000, 999999);
$token_info = Get_Configuration();
$code_expiry = time() + ($token_info->access_token_life_time * 60);
//$ten_minutes = 60*10; 
//$code_expiry = time() + $ten_minutes;

//either create or update this user into incompleteUser (pre user state where user needs to confirm with email)
$sql = "SELECT * FROM Incomplete_User WHERE uEmail = ?";
$result = Try_Query($sql, "s", $email);
if ($result->num_rows > 0) 
{
    $sql = "UPDATE Incomplete_User SET uPass = ?, varificationCode = ?, expiry= ? WHERE uEmail = ?";
    $result = Try_Query($sql, "sssi", $password, $emailed_confirmation_code, $code_expiry, $email);
}
else
{

    $sql = "INSERT into Incomplete_User (uEmail, uPass, varificationCode, expiry) Values (?, ?, ?, ?)";
	$result = Try_Query($sql, "sssi", $email, $password, $emailed_confirmation_code, $code_expiry);
}

Send_Email($email, "your varification code is $emailed_confirmation_code");
Finish($success_code_full);