<?php
require_once "Utility.php";
require_once "Create_Credentials.php";

$email = Declared($_POST["email"]);
$password = Declared($_POST["password"]);

//check if credentials correct
$sql = "SELECT * FROM User WHERE uEmail = ? AND uPass = ?";
$result = Try_Query($sql, "ss", $email, $password);
if ($result->num_rows <= 0)
{
    Finish('{"Status":"408"}');//custom code for invalid login
}
 
//create tokens
$temp = $result->fetch_assoc();
$uid=$temp['uId'];
Generate_Credentials($uid);
