//import "./ComponentsCss/Modal.css";
import './ComponentsCSS/Modal.css'

export default function Modal(props)
{
    function modalOn()
    {
        props.passedRef.current.style.display = "flex";
    }

    function modalOff(e)
    {
        if(props.clickOff)
        {//if clicking outside of the modal stop displaying modal when clickOff flag on
            if(e.target == props.passedRef.current)
            {
                props.passedRef.current.style.display = "none";
            }
        }
    }


    return (
        <>
            {/*Modal launching button*/}
            {props.button !== undefined && props.button != false ?<button className="modalButton" onClick={modalOn}>
                {props.buttonText}
            </button> : <></>}

            {/*Modal content*/}
            <div ref={props.passedRef} className="modalBackground" onClick={modalOff}>
                <div>
                    {props.children}
                </div>
            </div>
        </>
    );
}