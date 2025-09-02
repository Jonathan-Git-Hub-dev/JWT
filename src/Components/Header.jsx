import {useEffect, useContext, useState} from 'react';
import {useNavigate } from "react-router";
import { loggedinContext } from '../App';
import $ from 'jquery';
import { Url, server_error, data_error } from "../constants";
import userData from '../token_configuration.json';
import "./ComponentsCSS/Header.css"

const minutes = 60;
export default function Header(props)
{
  const [loggin, setLoggin] = useContext(loggedinContext);
  let navigate = useNavigate();

  const NOT_LOGGED_IN = null;

  function Move_To_Login_Page()
  {
        navigate("./login");
  }
  function Handle_Before_Unload()
  {//remove login credentials
    console.log("removed all data");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("user_id");
  }
  function Log_Out()
  {
      setLoggin(false)
      Handle_Before_Unload();
      navigate("../");
  }
  function Get_New_Access_Token()
  {
    if(sessionStorage.getItem('user_id') == NOT_LOGGED_IN)
    {
      return;
    }

    $.ajax({
      method: "post",
      url: Url + "Get_Access_Token.php",
      data: {refresh : sessionStorage.getItem("refreshToken"), uid: sessionStorage.getItem("user_id")}
    })
    .done(function(data){
      const response = JSON.parse(data);
      if(response.Status === server_error || response.Status === data_error || response.Status === "499")
      {
        Log_Out();
      }
      else//response 400
      {
        sessionStorage.setItem("accessToken", response.Data);
      }
    }).fail(function(data){
                console.log("error ajax" + data);
    })
  }
  

  

  useEffect(()=>{
    let intervalId = setInterval(() => {

      Get_New_Access_Token(); 
    }, userData['access_token_life_time_minus_2'] * minutes)//get new token before old one expires

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', Handle_Before_Unload);
    };
  },[])

  return (
    <div className="header_frame">
      <div className="header_banner">
        <div className="header_banner_content">
          <h1 className="header_title">Application Name</h1>
          {
            loggin
            ? <button className="header_button" onClick={Log_Out}>logout</button>
            : <button className="header_button" onClick={Move_To_Login_Page}>login Page</button>
          }
        </div>
      </div>
      {props.children}
    </div>
  );
} 
/*
old error handling code
<div  
          className="header_error"
          style={only consume space if error exists error=="" ? {minHeight: '0px',maxHeight: '0px'}:{}}
        >
          {error}
        </div>
*/