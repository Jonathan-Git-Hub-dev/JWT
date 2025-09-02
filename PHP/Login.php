<?php
require_once "Utility.php";
require_once "Create_Credentials.php";

$email = Declared($_POST["email"]);
$password = Declared($_POST["password"]);

//get salt from email to 

//check if credentials correct
$sql = "SELECT * FROM User WHERE uEmail = ?";
$result = Try_Query($sql, "s", $email);
if ($result->num_rows <= 0)
{
    Finish($error_code_bad_data);
}

//checking if password is correct with hash
$result_row = $result->fetch_assoc();
$salt = $result_row['salt'];
$hashed_password = crypt($password, '$2y$10$' . $salt . '$');
$max_password_length = 200;
$trimmed_password = substr($hashed_password, 0, $max_password_length);

if($hashed_password != $result_row['uPass'])
{
    Finish('{"Status":"408"}');//custom code for invalid login
}
 
//create tokens
$uid=$result_row['uId'];
Generate_Credentials($uid);
