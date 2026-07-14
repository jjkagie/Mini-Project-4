import React from 'react'
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import Home from './Home.jsx'
import Signup from './Signup.jsx'
import Login from './Login.jsx'
import Edit from './Edit.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/edit' element={<Edit />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App