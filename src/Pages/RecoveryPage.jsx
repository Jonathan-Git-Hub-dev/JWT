//import {useNavigate, useParams } from "react-router";
import { useRef,useContext, useState } from "react";
import Input from "../Components/Input.jsx";
import $ from 'jquery';
import {useNavigate, useParams } from "react-router";
import {Modal, modalOn, modalOff} from "../Components/Modal.jsx";
import { Url,server_error,data_error } from "../constants";
import {Validate_Password} from "../functions.js";
import { loggedinContext } from '../App';
import {Handle_Tokens} from "../functions.js";
import './PagesCSS/RecoveryPage.css'
import {Loading, Turn_On_Load_Animation, Turn_Off_Load_Animation} from "../Components/Loading.jsx";
import CooldownButton from "../Components/CooldownButton.jsx";






export default function RecoveryPage()
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
    //let pass_validation_output = useRef(null)
    const landing_page_return_label = "< Landing Page";

    function Redo_Password()
    {
        $.ajax({
            method: "post",
            url: Url + "Reset_Receive.php", 
            data: {email: email_input.current.value, password: password_input.current.value, code: code_input.current.value}
        })
        .done(function(data){
                const response = JSON.parse(data);    
                //console.log(data)
                if(response.Status == server_error || response.Status == data_error)
                {
                    setErrorModal("Server or data error");
                }
                else if(response.Status == "429")
                {
                    setErrorModal("Too many attemps contact admin");
                }
                else
                {
                    Handle_Tokens(response.Data);
                    setLoggin(true);
                    navigate('../user');
                    //console.log(body)
                }


        })
        .fail(function(data){
            setErrorModal("Communication Error");
        })
    }
    function Hide_Modal()
    {
        setCooldown(60);//so button will reactivate when cooldown is change back to 180
        modalOff(childRef);
    }

    function Initiate_Password_Reset()
    {
        setError("");
        Turn_On_Load_Animation(loading_ref);
        $.ajax({
            method: "post",
            url: Url + "Reset_Send.php",
            data: {email: email_input.current.value}
        })
        .done(function(data){
            //console.log(data)
            const response = JSON.parse(data);
            Turn_Off_Load_Animation(loading_ref);
            if(response.Status == server_error || response.Status == data_error)
            {
                setError("Server or data error");
                modalOff(childRef);
            }
            else if(response.Status == "429")
            {
                setError("Too many attemps contact admin");
                //modalOff(childRef);
            }
            else
            {
                //console.log(data)
                modalOn(childRef)
                setCooldown(180);//stop user requesting another code of a while
            }
        })
        .fail(function(data){
            setError("Communication error");
            //modalOff(childRef);
            Turn_Off_Load_Animation(loading_ref);
        })
    
    }
    function Move_To_Landing_Page()
    {
        navigate("../");
    }

  

    return (
        <div className="recovery_page_frame">
            <div className="recovery_page_hold_buttons">
                <button className="recovery_page_button_return" onClick={Move_To_Landing_Page}>{landing_page_return_label}</button>
            </div>

            <h2>Recover your account here.</h2>
            <p>Enter your email to recieve a recovery code</p>
            <Input label="email" passedRef={email_input} />
            
            <div className="recovery_page_padding"/>

            <button onClick={Initiate_Password_Reset}>send code</button>
            <div className="recovery_page_error" aria-live="polite">{error}</div>
            <br />
            <Loading height="30" width="300" passed_ref={loading_ref}/>
            
            <Modal passedRef={childRef} button={false}>
                <div className="recovery_page_modal">
                    <button onClick={Hide_Modal}>&lt; cancel</button>
                    <p>Please enter your recovery code and your new password.</p>
                    <Input label="Code" passedRef={code_input} />
                    <div className="recovery_page_padding"/>
                    <Input label="Password" passedRef={password_input} password={true} validate={Validate_Password}/>
                    
                    <div className="recovery_page_modal_hold_buttons">
                        <CooldownButton time={cooldown} label="Resend code" function={Initiate_Password_Reset}/>
                        <button onClick={Redo_Password}>Confirm</button>
                    </div>
                    <div className="recovery_page_error" aria-live="polite">{errorModal}</div>
                </div> 
            </Modal>
        </div>
    );
}