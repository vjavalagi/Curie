import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header'
import LandingPage from './Pages/LandingPage'
import Home from './Pages/Home'
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
        <Route path="/home" element={<h1>Home</h1>} />
        <Route path ='*' element={<h1>Not Found</h1>} />
      </Routes>
      

      </div>
      </BrowserRouter>
  )
}

export default App
