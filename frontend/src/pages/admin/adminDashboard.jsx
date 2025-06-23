import React, { useEffect, useState } from 'react';
import '../../assets/css/admin/dashboard.css';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const [location, setLocation] = useState('New York HQ'); // example static location
  const navigate=useNavigate()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
  <div className="AdmindashboardContainer">
  <div className="AdmindashboardHeader">
    <h1 className="AdmindashboardTitle">Dashboard Data</h1>
  </div>

  <div className="AdmindashboardCards">
    <div className="AdmindashboardCard" onClick={() => navigate('/admin/addLocation')}>
      <h2>Generate New Location</h2>
      <p>Create a new operation location with coordinates and region.</p>
    </div>

    <div className="AdmindashboardCard" onClick={() => navigate('#')}>
      <h2>Edit Locations</h2>
      <p>Modify or delete existing location details in your database.</p>
    </div>
  </div>

  <div className="AdmindashboardInfo">
    <p><strong>Current Time:</strong> {currentTime}</p>

  </div>
</div>

  );
};

export default AdminDashboard;
