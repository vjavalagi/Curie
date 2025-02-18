import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import LandingPage from './Pages/LandingPage'
import Profile from './Pages/ProfilePage'
import SearchPage from './Pages/SearchPage'
import { BrowserRouter } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <div>
      <Header/>

      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/Profile" element={<Profile/>} />
        <Route path="/SearchPage" element={<SearchPage/>} />
        <Route path ='*' element={<h1>Not Found</h1>} />
      </Routes>
      </div>

      </BrowserRouter>
  )
}

export default App
