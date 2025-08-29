<?php
require_once "Utility.php";


function Generate_Refresh_Token($user_id)
{
    //get time to live for this token saved in a configuration file
    $token_info = Get_Configuration();
    $time_to_live = time() + ($token_info->refresh_token_life_time * 60);

    //generate the refresh token and the key for hashing access tokens
    $key = random_bytes(64);
    $token = random_bytes(128);

    //create entry or replace entry
    $sql = "SELECT * FROM Refresh_Tokens WHERE uId = ?"; 
    $result = Try_Query($sql, "i", $user_id);
    if ($result->num_rows > 0)//change code
    {
        $sql = "UPDATE Refresh_Tokens SET token=?, secret = ?, expiry = ? WHERE uId = ?";
        $result = Try_Query($sql, "ssii", $token, $key, $time_to_live, $user_id);
    }
    else
    { 
        $sql = "INSERT INTO Refresh_Tokens (token, uId, secret, expiry) VALUES (?, ?, ?, ?)";
        $result = Try_Query($sql, "sisi", $token, $user_id, $key, $time_to_live);
    }

    return $token;
}