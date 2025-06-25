import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/user/home";
import "./App.css";
import LocationQuery from "./pages/user/LocationQuery";
import SignUp from "./pages/user/SignUp";
import Login from "./pages/user/login";
import AdminAddLocation from "./pages/admin/adminAddLocation";
import AdminDashboard from "./pages/admin/adminDashboard";
import UserProfile from "./pages/user/userProfile";
import AdminPlaceList from "./pages/admin/adminList";
import AuthenticateAdmin from "./pages/admin/authenticateAdmin";
import AuthenticateUser from "./pages/user/authenticateUser";
import About from "./pages/user/About";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route element={<AuthenticateUser />}>
            <Route path="/findPlaces" element={<LocationQuery />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>

          {/* admin side */}
          <Route element={<AuthenticateAdmin />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/addLocation" element={<AdminAddLocation />} />
            <Route path="/admin/locationList" element={<AdminPlaceList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
