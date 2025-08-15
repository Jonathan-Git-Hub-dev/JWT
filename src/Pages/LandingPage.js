import {useNavigate, useParams } from "react-router";






export default function LandingPage()
{
    let navigate = useNavigate();

    function f1()
    {
        //console.log("button press")
        navigate("./login");
    }

    return (
        <div>
            <button onClick={f1}>login</button>
        </div>
    );
}