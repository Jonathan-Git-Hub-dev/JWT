<?php
header("Access-Control-Allow-Origin: *");//can be changed to be more specific
require "config.php";


//php mailer
require "vendor/autoload.php";
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
 
$error_code_standard = '{"Status":"500"}';
$error_code_bad_data = '{"Status":"403"}';
$success_code_full = '{"Status":"400"}';//not encapsulated because data might also be sent
$success_code = '"Status":"400"';//not encapsulated because data will also be sent 


//sql connections
$server_name = $config["database"]["server_name"];
$username = $config["database"]["username"];
$password = $config["database"]["password"];
$database = $config["database"]["database"];

$conn = new mysqli($server_name, $username, $password, $database);
if ($conn->connect_error)
{
    echo $GLOBALS['error_code_standard'];
    exit();
}

function Finish($str)//sends message to calling process
{
    echo $str;
    $GLOBALS['conn']->close();
    exit();
}

function Declared($var)//check post variables
{
    if(!isset($var))
    {
        finish($GLOBALS['error_code_bad_data']);//arbitrary error code;
    } 
    //should never recieve null data 
    if($var == NULL)
    {
        finish($GLOBALS['error_code_bad_data']);//arbitrary error code;
    } 
    return $var;//used for assignment
}

//exectues a structured query
function Try_Query($sql, $numVars, ...$vars)
{
    $stmt = $GLOBALS['conn']->prepare($sql);
    if(!$stmt)
    {
        finish($GLOBALS['error_code_standard']);
    }
    if(!$stmt->bind_param($numVars, ...$vars))
    {
        finish($GLOBALS['error_code_standard']);
    }
    if(!($stmt->execute()))
    {
        finish($GLOBALS['error_code_standard']);
    }
    return $stmt->get_result();
}

function Validate_Email($email)
{
    if(filter_var($email, FILTER_VALIDATE_EMAIL) && strlen($email) <= 100) 
    {
        return true;
    }
    return false;
}

function Validate_Password($password)
{
    //password must be atleast 10 chars long, with max length of 30
    if(is_string($password) && strlen($password) >= 10 && strlen($password) <= 30)
    {
        return true;
    }
    return false;
}

function Get_Configuration()
{
    //path hard coded as only a single config file
    $json_string = file_get_contents('C:\xampp\htdocs\JWT\src\token_configuration.json');
    if ($json_string === false)
    {
        Finish($GLOBALS['error_code_standard']);
    }
    return json_decode($json_string);  
}


function Send_Email($email, $message)
{
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->SMTPAuth = true;
    $mail->Host = "smtp.gmail.com";//using google's smtp
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    
    //your google accound credentials here
    $mail->Username = $GLOBALS['config']["mail_credentials"]["username"];
    $mail->Password = $GLOBALS['config']["mail_credentials"]["password"];

    $mail->setFrom("noReply@gmail.com", "account");
    $mail->isHTML(false);
    $mail->Subject = "Account creation code";

    $name = "name";
    $mail->addAddress($email, "name");
    $mail->Body = $message;

    if(!$mail->send())
    {
        finish($GLOBALS['error_code_standard']);
    }
}
