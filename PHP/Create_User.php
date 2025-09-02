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
$emailed_confirmation_code = (string) random_int(100000, 999999);
$token_info = Get_Configuration();
$code_expiry = time() + ($token_info->access_token_life_time * 60);
//$ten_minutes = 60*10; 
//$code_expiry = time() + $ten_minutes;

//hashing passwords to prevent rainbow table attacks
$salt = base64_encode(random_bytes(16));//generate salt
$hashed_password = crypt($password, '$2y$10$' . $salt . '$');
$max_password_length = 200;
$trimmed_password = substr($hashed_password, 0, $max_password_length);

//either create or update this user into incompleteUser (pre user state where user needs to confirm with email)
$sql = "SELECT * FROM Incomplete_User WHERE uEmail = ?";
$result = Try_Query($sql, "s", $email);
if ($result->num_rows > 0) 
{
    $sql = "UPDATE Incomplete_User SET uPass = ?, salt= ?, verificationCode = ?, expiry= ? WHERE uEmail = ?";
    $result = Try_Query($sql, "ssssi", $trimmed_password, $salt, $emailed_confirmation_code, $code_expiry, $email);
}
else
{

    $sql = "INSERT into Incomplete_User (uEmail, uPass, salt, verificationCode, expiry) Values (?, ?, ?, ?, ?)";
	$result = Try_Query($sql, "ssssi", $email, $trimmed_password, $salt, $emailed_confirmation_code, $code_expiry);
}

Send_Email($email, "your verification code is $emailed_confirmation_code");
Finish($success_code_full);