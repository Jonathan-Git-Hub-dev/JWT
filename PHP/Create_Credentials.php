<?php
require_once "Utility.php";
require_once "Refresh_Token.php";
require_once "Access_Token.php";

function Generate_Credentials($uid)
{
    $refresh_token = Generate_Refresh_Token($uid);
    $access_token = Generate_Access_token($uid);
    echo $access_token . "," . base64_encode($refresh_token);
}