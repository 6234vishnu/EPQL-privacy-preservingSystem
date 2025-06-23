import { useState } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/user/home'
import './App.css'
import LocationQuery from './pages/user/LocationQuery'
import SignUp from './pages/user/SignUp'
import Login from './pages/user/login'
import AdminAddLocation from './pages/admin/adminAddLocation'
import AdminDashboard from './pages/admin/adminDashboard'
import UserProfile from './pages/user/userProfile'

function App() {


  return (
    <>
     <BrowserRouter>
     <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/findPlaces" element={<LocationQuery/>}/>
      <Route path="/signUp" element={<SignUp/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/profile" element={<UserProfile/>}/>

      {/* admin side */}
      <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
      <Route path="/admin/addLocation" element={<AdminAddLocation/>}/>
     </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
