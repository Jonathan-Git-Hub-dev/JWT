import './App.css';
import { useEffect } from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import Header from './Components/Header';
import LandingPage from './Pages/LandingPage';
import LoginPage from './Pages/LoginPage';
import CreateUserPage from './Pages/CreateUserPage';

function App()
{
  
  /*useEffect(()=>{
    let intervalId;
    intervalId = setInterval(() => {
        //getNewChats();//update periodically
      console.log("hello");
      //do every min fro refresh token

    }, 5000)

    return () => {console.log("finishing chat page interaval"); clearInterval(intervalId);};
  },[])*/
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />}/>
          <Route path="/login/" element={<LoginPage />}/>
          <Route path="/create/" element={<CreateUserPage />}/>
          <Route path="/confirm/" element={<p>enter your code</p>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
//<Route path="*" element={<MissingPage />}/>