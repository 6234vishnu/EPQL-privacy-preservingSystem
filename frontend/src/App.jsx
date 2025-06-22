import { useState } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/user/home'
import './App.css'
import LocationQuery from './pages/user/LocationQuery'
import SignUp from './pages/user/SignUp'
import Login from './pages/user/login'
import AdminPage from './pages/admin/adminDashboard'

function App() {


  return (
    <>
     <BrowserRouter>
     <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/findPlaces" element={<LocationQuery/>}/>
      <Route path="/signUp" element={<SignUp/>}/>
      <Route path="/login" element={<Login/>}/>

      {/* admin side */}
      <Route path="/AdminDashboard" element={<AdminPage/>}/>
     </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
