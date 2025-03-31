import { useState } from "react";
import Header from "./components/Header";
import LandingPage from "./Pages/LandingPage";
import Profile from "./Pages/ProfilePage";
import Login from "./Pages/Login";
import CreateAccount from "./Pages/CreateAccount";
import SearchPage from "./Pages/SearchPage";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import ProfilePage from "./Pages/ProfilePage";
import { GlobalProvider } from "./context/GlobalContext";


function App() {
  return (
    <BrowserRouter>
      
        <div>
          <GlobalProvider>
            <Routes>
              
              <Route path="/" element={<LandingPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/createaccount" element={<CreateAccount />} />
              <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>
          </GlobalProvider>
        </div>
    
    </BrowserRouter>
  );
}

export default App;
