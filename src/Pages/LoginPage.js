import {useNavigate} from "react-router";
import { useRef, useContext, useState } from "react";
import Input from "../Components/Input";
import { Url, server_error, data_error } from "../constants";

import {Handle_Tokens} from "../functions.js";
import $ from 'jquery';
import { loggedinContext } from '../App';
import "./PagesCSS/LoginPage.css"





export default function LoginPage()
{
    const [loggin, setLoggin] = useContext(loggedinContext);
    const [error, setError] = useState("");
    const landing_page_return_label = "< Landing Page";
    let navigate = useNavigate();
    let email = useRef(null)
    let pass = useRef(null)
    

    function Move_To_Create_Account_Page()
    {
        navigate('../create');
    }
    function Move_To_Recover_Page()
    {
        navigate('../recovery');
    }

    function Log_In(e)
    {
        e.preventDefault();
        
        $.ajax({
            method: "post",
            url: Url + "Login.php",
            data: {email: email.current.value, password: pass.current.value}
        })
        .done(function(data){
            console.log(data)
            if(data == server_error || data == data_error)
            {
                setError("Server or data error");
            }
            else if(data == "408")
            {
                setError("Invalid credentials");
            }
            else
            {
                Handle_Tokens(data)

                setLoggin(true);
                navigate('../user');
            }
        })
        .fail(function(data){
            setError("Communication error");
        })
    
    }

    function f10()
    {
        navigate("../");
    }

    return (
        <div className="login_page_frame">
            <br />
            <button className="login_page_button_a" onClick={f10}>{landing_page_return_label}</button>
            <div className="login_page_content">
                <h2 className="login_page_title">login page</h2>
                <form onSubmit={Log_In}>
                    <Input label="email" passedRef={email} />
                    <div className="login_page_padding"/>
                    <Input label="pass" passedRef={pass} password={true} />
                    <input type="submit" hidden />
                </form>
                <div className="login_page_padding"/>
                <button onClick={Log_In}>login</button>
                <div className="login_page_error" aria-live="polite">{error}</div>
             
                <div className="login_page_button_hold">
                    <button onClick={Move_To_Recover_Page}>forgot password</button>
                    <button onClick={Move_To_Create_Account_Page}>Dont have an account</button>
                </div>
            </div>
        </div>
    ); 
}
//<div className="login_page_padding"/>