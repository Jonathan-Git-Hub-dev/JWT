import { useState, useRef, useEffect } from "react";

export default function CooldownButton(props)
{
    const interval_ref = useRef();
    const cooldown_period_seconds = 180; 
    const [label, setLabel] = useState(props.label);
    const [time_left, setTime_left] = useState(0);


    function Activate_Interval()
    {
        clearInterval(interval_ref.current);

        interval_ref.current = setInterval(()=>{
            setTime_left((prev)=> {
                if(prev <= 0)
                {
                    clearInterval(interval_ref.current);
                }
                return prev-1
            });
                
        }, 1000);
    }

    //allows parent process to set the count down
    useEffect(()=>{
        setTime_left(Number(props.time));
        Activate_Interval();
    },[props.time])


    

    function Do_Or_Wait()
    {
        if(time_left <= 0)
        {
            props.function();
            setTime_left(cooldown_period_seconds);
            Activate_Interval();
        }
    }

    return (
        <button onClick={Do_Or_Wait}>
            {
                time_left <= 0 
                ? label
                : "Cooldown: " + Math.floor(Number(time_left)/60)+"m, "+Math.floor(Number(time_left)%60) +"s"
            }</button>
    );

}