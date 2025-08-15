//import {useNavigate, useParams } from "react-router";
import { useRef } from "react";
import Input from "../Components/Input";
//import $ from 'jquery';






export default function LoginPage()
{
    //let navigate = useNavigate();
    let email = useRef(null)
    let pass = useRef(null)


    function f1()
    {
        //console.log("User login with these details")
        //navigate("./login");
        //console.log(email.current.value)
    
        //validate (this also has to be done server side)
    
    }

    return (
        <div>
            <p>login page</p>
            <Input label="email" passedRef={email} />
            <Input label="pass" passedRef={pass} password={true}/>
            

            <button onClick={f1}>login</button>
        </div>
    );
}
/*
<div>
                <p></p>
                <input ref={name} type="text"></input>
            </div>
*/