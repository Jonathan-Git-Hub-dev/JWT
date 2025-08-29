<?php
require_once "Utility.php";

function Check_Access_Token_Shape($access_token)
{
    //check for corrent number of feilds
    if(substr_count($access_token, ".") != 2)
    {
        Finish($GLOBALS['error_code_bad_data']);
    }

    $parts = explode('.', $access_token);

    //each feild must have some data
    if($parts[0] == NULL || $parts[1] == NULL || $parts[2] == NULL)
    {
        Finish($GLOBALS['error_code_bad_data']);
    }

    return $parts;
}

function Base64_Decode_Func($input)
{
    if(base64_decode($input, true) == false)
    {
	    Finish($GLOBALS['error_code_bad_data']);
    }

    return base64_decode($input);
}


function Validate_Access_Token($access_token)
{
    [$head, $body, $hash] = Check_Access_Token_Shape($access_token);

    $decoded_head = Base64_Decode_Func($head); 
    $decoded_body = Base64_Decode_Func($body);
    $decode_hash = Base64_Decode_Func($hash);
    
    $head_as_php_object = json_decode($decoded_head);
    $body_as_php_object = json_decode($decoded_body);

    //make sure token has nessesary feilds
    if(!property_exists($head_as_php_object, "alg"))
    {
        Finish($GLOBALS['error_code_bad_data']);
    }
    if(!property_exists($body_as_php_object, 'uid') || !property_exists($body_as_php_object, 'exp') || !property_exists($head_as_php_object, 'alg'))
    {
        Finish($GLOBALS['error_code_bad_data']);
    }

    //getting hashing secret
    $sql = "SELECT * FROM Refresh_Tokens WHERE uId = ?";
    $result = Try_Query($sql, "i", $body_as_php_object->uid);
    if($result->num_rows <= 0)
    {
        Finish($GLOBALS['error_code_bad_data']);
    }
    $temp = $result->fetch_assoc();
    $key = $temp['secret'];

    //checking hash
    $hmac_sha256;
    $token = $head . ".".$body;
    try
    {
        $hmac_sha256 = hash_hmac($head_as_php_object->alg, $token, $key, false);
    }
    catch (ValueError $e)
    {Finish($GLOBALS['error_code_bad_data']);}
    if($decode_hash != $hmac_sha256)
    {
        Finish($GLOBALS['error_code_bad_data']);
    }

    //token has expired
    if(time() > $body_as_php_object->exp)
    {
        Finish($GLOBALS['error_code_bad_data']);
    }
    
}//if all checks passed control is returned to calling function