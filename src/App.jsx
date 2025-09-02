import './App.css';
import { createContext, useContext, useState } from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import Header from './Components/Header';
import LandingPage from './Pages/LandingPage';
import LoginPage from './Pages/LoginPage';
import CreateUserPage from './Pages/CreateUserPage';
import UserPage from './Pages/UserPage';
import RecoveryPage from './Pages/RecoveryPage';

//global sign in / out
export const loggedinContext = createContext(null);
export default function App()
{
  const [loggin, setLoggin] = useState(sessionStorage.getItem("user_id"));//

  return (
    <div className="App">
      <BrowserRouter>
        <loggedinContext.Provider value={[loggin, setLoggin]}>
        <Header>
        <Routes>
          <Route path="/" element={<LandingPage />}/>
          <Route path="/login/" element={<LoginPage />}/>
          <Route path="/create/" element={<CreateUserPage />}/>
          <Route path="/user/" element={<UserPage />}/>
          <Route path="/recovery/" element={<RecoveryPage />}/>
        </Routes>
        </ Header>
        </loggedinContext.Provider> 
      </BrowserRouter>
    </div>
  );
}
/*import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App*/
