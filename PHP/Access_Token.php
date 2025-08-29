<?php
require_once "Utility.php";

function Generate_Access_Token($user_id)
{
    //get secret for hashing
    $sql = "SELECT * FROM Refresh_Tokens WHERE uId = ?";
    $result = Try_Query($sql, "i", $user_id);

    //result can be assumed because of pre funciton checking
    $row = $result->fetch_assoc(); 
    $max_time = $row['expiry'];
    $key = $row['secret'];

    if($max_time <= time())//refresh token too old
    {
        Finish($GLOBALS['error_code_standard']);
    }

    //get time to live for this token saved in a configuration file
    $token_info = Get_Configuration();
    $time_to_live = time() + ($token_info->access_token_life_time * 60);
    
    //create token
    $token_header = base64_encode('{"alg":"sha256"}');
    $token_body = base64_encode('{"uid":"' . $user_id .  '","exp":"' . $time_to_live . '"}');
    $token_header_body = $token_header . "." . $token_body;

    //create hash
    $hmac_sha256 = hash_hmac('sha256', $token_header_body, $key, false);

    return $token_header_body . "." . base64_encode($hmac_sha256);
}