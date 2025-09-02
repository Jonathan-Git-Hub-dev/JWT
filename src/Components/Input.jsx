import { useRef } from "react";
import './ComponentsCSS/Input.css'

export default function Input(props)
{
    let label_ref = useRef(null);
    let validation_output = useRef(null);

    function Return_Label()
    {
        if(props.passedRef.current.value === "")
        {
            label_ref.current.style.animationName='move_label_back';
            
            //when input blank no need to supply and error message
            if(props.validate !== undefined)
            {
                validation_output.current.innerHTML = "";
            }
        }
    }
    function Move_Label()
    {
        label_ref.current.style.animationName='hovering_label';
    }
    function Do_Validate(e)
    {
        //if user has given a validator function
        if(props.validate !== undefined)
        {
            //get validation message and display it
            let message = props.validate(e.target.value);
            validation_output.current.innerHTML = message;
        }
    }

    return(
        <div className="input_frame">
            <div>
                <input
                    className="input_box"
                    onChange={Do_Validate}
                    onFocus={Move_Label}
                    onBlur={Return_Label}
                    ref={props.passedRef} 
                    aria-label={props.label}
                    type={props.password !== undefined ? "password" : "text"}
                />
                {
                    props.validate == undefined 
                    ? <></>
                    : <div className="error_feild" ref={validation_output}/>
                }
            </div>
            <p className="ex" ref={label_ref}>{props.label}</p>
        </div>
    );
}
//<div style={{position: "relative", backgroundColor: "red", margin: "10px"}}>