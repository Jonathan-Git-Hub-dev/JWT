<?php
require_once "Utility.php";
require_once "Create_Credentials.php";


$email = Declared($_POST["email"]);
$code = Declared($_POST["code"]);
$password = Declared($_POST["password"]);

if(!Validate_Password($password))
{
    Finish($error_code_bad_data);
}

//get recovry attemp data
$sql = "SELECT * FROM Recover_User WHERE uEmail = ?";
$result = Try_Query($sql, "s", $email);
if ($result->num_rows <= 0)
{
    Finish($error_code_bad_data);//recovery process not started
}

$row = $result->fetch_assoc();//save row for later
$attempts = $row['attempts'] +1;


//limit times code can be attempted
$sql = "UPDATE Recover_User SET attempts=? WHERE uEmail=?";
$result = Try_Query($sql, "is", $attempts, $email);
$config = Get_Configuration();
if($row['attempts'] >= $config->max_guesses_per_code)
{
    Finish('{"Status":"429"}');//too many tries code
}

//check code and expiry
if($row['verificationCode'] != $code)
{
    Finish($error_code_bad_data);
}
if(time() > $row["expiry"])
{
    Finish($error_code_bad_data);
}


//generate new salt and hash for password
$salt = base64_encode(random_bytes(16));//generate salt
$hashed_password = crypt($password, '$2y$10$' . $salt . '$');
$max_password_length = 200;
$trimmed_password = substr($hashed_password, 0, $max_password_length);

//update password and attempts to reset password
//delete entry for reseting process
$sql = "UPDATE User SET uPass=?, salt=?, resets=? WHERE uEmail=?";
$result = Try_Query($sql, "ssis",  $trimmed_password, $salt, 0, $email);
$sql = "DELETE FROM Recover_User WHERE uEmail = ?";
$query_exec = Try_Query($sql, "s", $email);

//use user's id to generate access and refresh tokens for them
$sql = "SELECT * FROM User WHERE uEmail = ?";
$res = Try_Query($sql, "s", $email);
$row = $res->fetch_assoc();
Generate_Credentials($row['uId']);