import { useState } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/user/home'
import './App.css'
import LocationQuery from './pages/user/LocationQuery'

function App() {


  return (
    <>
     <BrowserRouter>
     <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/findPlaces" element={<LocationQuery/>}/>
     </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
