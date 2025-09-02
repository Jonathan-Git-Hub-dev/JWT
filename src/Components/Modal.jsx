//import "./ComponentsCss/Modal.css";
import './ComponentsCSS/Modal.css'

export function modalOn(passedRef)
{
    passedRef.current.style.display = "flex";
}

export function modalOff(passedRef)
{
    passedRef.current.style.display = "none";
}



export function Modal(props)
{

    function modalClickOff(e)
    {
        if(props.clickOff)
        {//if clicking outside of the modal stop displaying modal when clickOff flag on
            if(e.target == props.passedRef.current)
            {
                modalOff(props.passedRef);
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
            <div ref={props.passedRef} className="modalBackground" onClick={modalClickOff}>
                <div>
                    {props.children}
                </div>
            </div>
        </>
    );
}