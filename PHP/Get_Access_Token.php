<?php
require_once "Utility.php";
require_once "Access_Token.php";
require_once "Validate_Access_Token_Function.php";

$user_id = Declared($_POST["uid"]);

$refresh_token = Declared($_POST["refresh"]);
$refresh_token = Base64_Decode_Func($refresh_token); 

//check refresh tokens validity and expirey
$sql = "SELECT * FROM Refresh_Tokens WHERE token = ? AND uId = ?";
$result = Try_Query($sql, "si", $refresh_token, $user_id);

//check if this id and refresh token are real
if ($result->num_rows <= 0)
{
    Finish($error_code_bad_data);
}

$row = $result->fetch_assoc();
if($row['expiry'] < time())
{
    Finish('{"Status":"499"}');//custom error code for expired refresh token
}

//send new code to user
$token = Generate_Access_Token($user_id);
$response = '{'.$success_code.', "Data":"' .$token . '"}'; 
Finish($response);

