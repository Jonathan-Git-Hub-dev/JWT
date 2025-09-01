<?php
require_once "Utility.php";
require_once "Validate_Access_Token_Function.php";

$access_token = Declared($_POST["token"]);

Validate_Access_Token($access_token);

finish($success_code_full);

