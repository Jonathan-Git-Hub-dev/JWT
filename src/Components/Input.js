import { useRef } from "react";
import './ComponentsCSS/Input.css'

export default function Input(props)
{
    let labelRef = useRef(null);
    function f1()
    {
        //console.log("blur")
        //checking if there is input
        if(props.passedRef.current.value == "")
        {
            labelRef.current.style.top = "-14px";
            labelRef.current.style.fontSize = "16px";
        }
    }
    function f2()
    {
        console.log("hll")
        labelRef.current.style.top = "-18px";
        labelRef.current.style.fontSize = "10px";
        //labelRef.current.style.left = "9px";
    }

    return(
        <div style={{position: "relative", backgroundColor: "red", margin: "10px"}}>
            <input onClick={f2} onBlur={f1} ref={props.passedRef} type={props.password!== undefined? "password" : "text"}></input>
            <p className="ex" ref={labelRef}>{props.label}</p>
        </div>
    );
}