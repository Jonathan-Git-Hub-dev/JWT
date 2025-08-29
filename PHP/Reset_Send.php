<?php
require_once "Utility.php";

$email = Declared($_POST["email"]);

//checking if real user's email
$sql = "SELECT * FROM User WHERE uEmail = ?";
$result = Try_Query($sql, "s", $email);
if($result->num_rows <= 0)
{
    finish($error_code_bad_data);
}

//limiting recovery attempts
$token_info = Get_Configuration(); 
$row= $result->fetch_assoc();
$recovery_trys = $row['resets'] + 1;
if($recovery_trys >= $token_info->max_recovery_attemps)
{
    Finish("429");//too many tries code
}

//new code
$email_confirmation_code = (string) rand(100000, 999999);
$expiry_time = time() + $token_info->recovery_code_life_time * 60;

//either create or update entry in recover user table
$sql = "SELECT * FROM Recover_User WHERE uEmail = ?";
$result = Try_Query($sql, "s", $email);
if ($result->num_rows > 0)//change code
{
    $sql = "UPDATE Recover_User SET attempts = ?, varificationCode = ?, expiry= ? WHERE uEmail = ?";
    $result = Try_Query($sql, "isis",0, $email_confirmation_code, $expiry_time, $email);
}
else//create new entery
{ 
    $sql = "INSERT INTO Recover_User (uEmail, varificationCode, expiry) VALUES (?, ?, ?)";
	$result = Try_Query($sql, "ssi", $email, $email_confirmation_code, $expiry_time);
}

//incrementing attempts
$sql = "UPDATE User SET resets=? WHERE uEmail=?";
$result = Try_Query($sql, "is", $trys, $email);


Send_Email($email, "Your recovery code is: $email_confirmation_code");
Finish("400");

