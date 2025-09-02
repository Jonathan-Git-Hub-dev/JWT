import { useEffect, useRef, useState, useContext} from "react";
import $ from 'jquery';
import { Url, server_error, data_error} from "../constants";
import Input from "../Components/Input.jsx";
import {Validate_Password} from "../functions.js";
import {useNavigate} from "react-router";
import { loggedinContext } from '../App';
import "./PagesCSS/UserPage.css"


export default function UserPage()
{
    const [loggin, setLoggin] = useContext(loggedinContext);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    let navigate = useNavigate();
    const success_code = "400";

    function Log_Out()
    {
        setLoggin(false);
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        sessionStorage.removeItem("user_id");
        navigate('../');
    }

    function Initial_Credentail_Check()
    {
         $.ajax({
        method: "post",
        url: Url + "Validate_Access_Token.php",
        data: {token : sessionStorage.getItem("accessToken")}
    })
    .done(function(data){
        const response = JSON.parse(data);
        //console.log("this is the result of initial: " + data)
        if(response.Status != success_code)
        {
            Log_Out();
        }
    }).fail(function(data){
        Log_Out();
    })
    }


    function consume()
    {
        $.ajax({
            method: "post",
            url: Url + "Validate_Access_Token.php",
            data: {token : sessionStorage.getItem("accessToken")}
        })
        .done(function(data){
            const response = JSON.parse(data);
            if(response.Status == success_code)
            {
                setError("");
                setSuccess("Validated");
            }
            else
            {
                setError("Server or Data error");
                setSuccess("");
            }
            
        }).fail(function(data){
            setError("Communication error");
            setSuccess("");
        })
    }

    useEffect(()=>{
        Initial_Credentail_Check();
    },[])

    return (
        <div className="user_page_frame">
            <h2>This is the user page</h2>
            <button onClick={consume}>This button uses your access token to varify you identiry</button>
            <div className="user_page_success" aria-live="polite">{success}</div>
            <div className="user_page_error" aria-live="polite">{error}</div>
        </div>
    );
}

/*
js code for changing user's password

    let pass = useRef(null);
    let pass_validation_output = useRef(null)

    <Input label="pass" passedRef={pass} password={true} validate={Validate_Password}/>
    <button onClick={Change_Password}>consume api</button>

 
php code
    <?php
    require_once "Utility.php";
    require_once "Validate_Access_Token.php";


    $new_password = Declared($_POST['password']);
    if(!Validate_Password($new_password))
    {
        Finish($error_code_bad_data);
    }


    $access_token = Declared($_POST["at"]);
    Validate_Access_Token($access_token);


    $sql = "UPDATE Users SET uPass = ?, resets= ? WHERE uId = ?";
    $result = Try_Query($sql, "sii", $newPassword, 0, $phpObject->uid);

*/