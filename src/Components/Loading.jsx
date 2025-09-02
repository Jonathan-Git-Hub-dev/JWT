import "./ComponentsCSS/Loading.css";
//import { useRef } from "react";

export function Turn_On_Load_Animation(ref)
{
    //loading_ref.current.animationName = 'load_animation';
    ref.current.style.display="flex";
}

export function Turn_Off_Load_Animation(ref)
{
    ref.current.style.display="none";
    //loading_ref.current.animationName = 'none';
}

export function Loading(props)
{
    //const ex = useRef(null); 
    return (
        <div ref={props.passed_ref}
            style={{borderRadius:props.height/2+'px',minHeight: props.height+'px', maxHeight: props.height+'px', minWidth: props.width+'px', maxWidth: props.width+'px'}}
            className="fra"
        >
            <div 
                className="mov" 
                style={{minHeight: (props.height*0.8)+'px', maxHeight: (props.height*0.8)+'px', minWidth: (props.height*0.8)+'px', maxWidth: (props.height*0.8)+'px'}}
            />
        </div>
    );
}