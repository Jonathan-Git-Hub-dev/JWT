//import {useNavigate, useParams } from "react-router";
import { useRef, useContext, useState, useEffect } from "react";
import Input from "../Components/Input";
import $ from 'jquery';
import {useNavigate, useParams } from "react-router";
import {Modal, modalOn, modalOff} from "../Components/Modal";
import { Url, server_error, data_error } from "../constants";
import {Validate_Password, Validate_Email} from "../functions.js";
import { loggedinContext } from '../App';
import {Handle_Tokens} from "../functions.js";
import "./PagesCSS/CreateUserPage.css";
import {Loading, Turn_On_Load_Animation, Turn_Off_Load_Animation} from "../Components/Loading.js";
import CooldownButton from "../Components/CooldownButton.js";





export default function CreateUserPage()
{
    const [loggin, setLoggin] = useContext(loggedinContext);
    const [error, setError] = useState("");
    const [errorModal, setErrorModal] = useState("");
    const [cooldown, setCooldown] = useState(0);

    let navigate = useNavigate();
    let email_input = useRef(null)
    let password_input = useRef(null)
    let childRef = useRef(null);
    let code_input = useRef(null);
    const loading_ref = useRef(null);
    //const intref = useRef(null);
    
    //let email_validation_output = useRef(null)
    //let pass_validation_output = useRef(null)
    const landing_page_return_label = "< Landing Page";

    

    function Confirm_Validation_Code()
    {
        //Turn_On_Load_Animation();
        $.ajax({
            method: "post",
            url: Url + "Confirm_User.php",
            data: {email: email_input.current.value, code: code_input.current.value}
        })
        .done(function(data){
            //console.log(data)
            const response = JSON.parse(data);
            if(response.Status == server_error|| response.Status == data_error)
            {
                setErrorModal("Server or Data error");
            }
            else
            {
                //console.log(data)
                Handle_Tokens(response.Data);
                setLoggin(true);
                navigate('../user');
                //console.log(body)
            }
        })
        .fail(function(data){
            setErrorModal("Communication error");
        })
        //Turn_Off_Load_Animation();
    }
    function Hide_Modal()
    {
        setCooldown(60);//so button will reactivate when cooldown is change back to 180
        modalOff(childRef);
    }

    function Move_To_Log_In_Page()//moves to create account
    {
        navigate('../login');
    }
    function Create_User()
    { 
        //console.log("should t on");
        setError("")
        Turn_On_Load_Animation(loading_ref);

        $.ajax({
                method: "post",
                url: Url + "Create_User.php",
                data: {email: email_input.current.value, password: password_input.current.value}
            })
            .done(function(data){
                //console.log("data: " + data);
                const response = JSON.parse(data);
                Turn_Off_Load_Animation(loading_ref);
                if(response.Status == server_error || response.Status == data_error)
                {
                    setError("Server or data error")
                    //modalOff(childRef);
                }
                else
                {
                    modalOn(childRef);
                    setCooldown(180);//stop imidiate requesting of new code
                }
            })
            .fail(function(data){
                setError("Communication error")
                Turn_Off_Load_Animation(loading_ref);
                //modalOff(childRef);
            })
        }

        function Move_To_Landing_Page()
        {
            navigate("../");
        }
 
    /*useEffect(()=>{
        Turn_Off_Load_Animation();
    },[]);*/
    function temp()
    {
        console.log("ok send to server");
    }

    return (
        <div>
            <div className="create_user_page_nav_buttons">
                <button onClick={Move_To_Landing_Page}>{landing_page_return_label}</button>
                <button onClick={Move_To_Log_In_Page}>Have and account already?</button>
            </div>
            <div className="create_user_page_content">
                <h2>User Creation Page</h2>

                <Input label="email" passedRef={email_input} validate={Validate_Email}/>
                <Input label="pass" passedRef={password_input} password={true} validate={Validate_Password}/>
                

                <button onClick={Create_User}>Create Account</button>
                <div className="create_user_page_error" aria-live="polite">{error}</div>
                <Loading height="30" width="300" passed_ref={loading_ref}/>
                
            </div>
           
            
            <Modal passedRef={childRef} button={false}>
                <div className="create_user_page_modal">
                    <button onClick={Hide_Modal}>&lt; cancel</button>
                    <p>Enter the varification code</p>
                    <input className="create_user_page_modal_input" ref={code_input}/>
                    <div className="create_user_page_modal_buttons">
                        <CooldownButton time={cooldown} label="Resend code" function={Create_User}/>
                        <button onClick={Confirm_Validation_Code}>Confirm</button>
                    </div>
                    <div className="create_user_page_modal_error" aria-live="polite">{errorModal}</div>
                </div> 
            </Modal>
        </div>
    );
}