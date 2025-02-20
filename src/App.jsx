import { useState } from "react";

import Header from "./components/Header";
import LandingPage from "./Pages/LandingPage";
import Profile from "./Pages/ProfilePage";
import SearchPage from "./Pages/SearchPage";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import ProfilePage from "./Pages/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <div>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/search" element={<SearchPage/>} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
