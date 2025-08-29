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
function App()
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

export default App;
//<Route path="*" element={<MissingPage />}/>

//<Route path="/confirm/" element={<p>enter your code</p>}/>