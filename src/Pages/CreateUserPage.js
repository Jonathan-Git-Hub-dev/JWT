//import {useNavigate, useParams } from "react-router";
import { useRef } from "react";
import Input from "../Components/Input";
import $ from 'jquery';
import {useNavigate, useParams } from "react-router";
import Modal from "../Components/Modal";






export default function CreateUserPage()
{
    //let navigate = useNavigate();
    let navigate = useNavigate();
    let email = useRef(null)
    let pass = useRef(null)
    let childRef = useRef(null);


    function f1()
    {
        //console.log("User login with these details")
        //navigate("./login");
        //console.log(email.current.value)
    
        //validate (this also has to be done server side)
        $.ajax({
                method: "post",
                url: "http://localhost/JWT/PHP/create.php",
                data: {email: email.current.value, password: pass.current.value}
            })
            .done(function(data){
                console.log(data)

                //check if no snags (email in use)
                //navigate("../confirm")
                childRef.current.style.display = "flex";

            })
            .fail(function(data){
                console.log("error ajax" + data);
            })
    
    }

    return (
        <div>
            <p>you can create a user here page</p>
            <Input label="email" passedRef={email} />
            <Input label="pass" passedRef={pass} password={true}/>
            

            <button onClick={f1}>login</button>
            
            <Modal passedRef={childRef} button={false}>
                <div>
                    <p>this is where athe code goes</p>
                    <input />
                </div>
            </Modal>
        </div>
    );
}
/*
<div>
                <p></p>
                <input ref={name} type="text"></input>
            </div>
*/