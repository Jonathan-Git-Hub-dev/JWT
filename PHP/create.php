<?php
require "utility.php";


$email = declared($_POST["email"]);
$pass = declared($_POST["password"]);
//echo $pass;
//check if user with email already exists
$sql = "SELECT * FROM Users WHERE uEmail = ?";
$result = tryQuery($sql, "s", $email);
if ($result->num_rows > 0){finish("email in use");}//could move them to the sign in page on the front end

//fine in incomplete user because we will just replac it
$sql = "SELECT * FROM incompleteUser WHERE uEmail = ?";
$result = tryQuery($sql, "s", $email);

$code = (string) rand(100000, 999999);


if ($result->num_rows > 0)
{
    //finish("email in use")
    //replace code

    echo "update" . $email . "<";
    

    $sql = "UPDATE incompleteUser SET uPass = ?, varificationCode = ? WHERE uEmail = ?";
    $result = tryQuery($sql, "sss", $pass, $code, $email);
}
else
{

    $sql = "insert into incompleteUser (uEmail, uPass, varificationCode) Values (?, ?, ?)";
	$result = tryQuery($sql, "sss", $email, $pass, $code);
}

//email the code out
sendEmail("waho27@yahoo.com.au", $code);




//create a tempary user