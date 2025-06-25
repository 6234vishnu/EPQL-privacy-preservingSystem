import React, { useEffect, useState } from "react";
import "../../assets/css/admin/dashboard.css";
import { useNavigate } from "react-router-dom";
import api from "../../services/axiosInstance";
import ErrorModal from "../user/ErrorModal";

const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const [showModal, setShowModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await api.post("/api/admin/logout");
      if (response.data.success) {
        return navigate("/login");
      }
      setErrorMessage(response.data.message);
      return setErrorModal(true);
    } catch (err) {
      console.error("Logout failed", err);
      setErrorMessage(err?.response?.data?.message);
      return setErrorModal(true);
    }
  };

  return (
    <>
      <div className="AdmindashboardContainer">
        <div className="AdmindashboardHeader">
          <h1 className="AdmindashboardTitle">Dashboard Data</h1>
          <button
            className="AdmindashboardLogoutButton"
            onClick={() => setShowModal(true)}
          >
            Logout
          </button>
        </div>

        <div className="AdmindashboardCards">
          <div
            className="AdmindashboardCard"
            onClick={() => navigate("/admin/addLocation")}
          >
            <h2>Generate New Location</h2>
            <p>Create a new operation location with coordinates and region.</p>
          </div>

          <div className="AdmindashboardCard" onClick={() => navigate("#")}>
            <h2>Edit Locations</h2>
            <p>Modify or delete existing location details in your database.</p>
          </div>
        </div>

        <div className="AdmindashboardInfo">
          <p>
            <strong>Current Time:</strong> {currentTime}
          </p>
        </div>

        {showModal && (
          <div className="LogoutModalOverlay">
            <div className="LogoutModal">
              <h3>Are you sure you want to logout?</h3>
              <div className="LogoutModalButtons">
                <button className="ConfirmButton" onClick={handleLogout}>
                  Yes, Logout
                </button>
                <button
                  className="CancelButton"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {errorModal && (
        <ErrorModal message={error} onClose={() => setErrorModal(false)} />
      )}
    </>
  );
};

export default AdminDashboard;
