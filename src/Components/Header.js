import { useEffect } from 'react';

export default function Header(props)
{
  useEffect(()=>{
    let intervalId;
    intervalId = setInterval(() => {
        //getNewChats();//update periodically
      console.log("interval proc");
      //do every min fro refresh token

    }, 10000)

    return () => {console.log("finishing chat page interaval"); clearInterval(intervalId);};
  },[])


  return (
    <div>
        <h3>Header</h3>
        {props.children}
    </div>
  );
}