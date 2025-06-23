import { useEffect, useState } from "react";
import api from "../../services/axiosInstance";
import "../../assets/css/admin/AdminAddLocation.css";

const AdminAddLocation = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "Hospital",
    phone: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const [userPicture, setUserPicture] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { name, type, address, latitude, longitude, phone } = formData;

    if (!name || !type || !address || !latitude || !longitude || !phone) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await api.post(
        "/api/admin/add/location",
        {
          name,
          type,
          address,
          phone,
          latitude: latitude,
          longitude: longitude,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        return setSuccess("Location uploaded successfully!");
      }
      setError(res.data.message);
    } catch (err) {
      console.error(err);
      return setError(err?.res?.data?.message || "Server error");
    } finally {
      setFormData({
        name: "",
        type: "Hospital",
        address: "",
        phone: "",
        latitude: "",
        longitude: "",
      });
    }
  };

  const getUserProfile = async () => {
    try {
      const res = await api.get("/user/profile", {
        withCredentials: true,
      });
      setUserPicture(res.data.user.picture);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <div className="adminDashboardContainer">
      {userPicture && (
        <div className="adminDashboardProfileWrapper">
          <img
            src={userPicture}
            alt="User Profile"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://www.gravatar.com/avatar/?d=mp&s=96";
            }}
            className="adminDashboardProfileImage"
          />
        </div>
      )}

      <div className="adminDashboardCard">
        <h2 className="adminDashboardTitle">Admin - Add Place</h2>

        <form onSubmit={handleSubmit} className="adminDashboardForm">
          <div className="adminDashboardFormGroup">
            <label className="adminDashboardLabel">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="adminDashboardInput"
              required
            />
          </div>

          <div className="adminDashboardFormGroup">
            <label className="adminDashboardLabel">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="adminDashboardInput"
              required
            >
              <option value="Hospital">Hospital</option>
              <option value="School">School</option>
              <option value="Police Station">Police Station</option>
              <option value="Fire Station">Fire Station</option>
            </select>
          </div>

          <div className="adminDashboardFormGroup">
            <label className="adminDashboardLabel">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="adminDashboardTextArea"
              required
            />
          </div>
          <div className="adminDashboardFormGroup">
            <label className="adminDashboardLabel">Phone</label>
            <textarea
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              rows={3}
              className="adminDashboardInput"
              required
            />
          </div>

          <div className="adminDashboardRow">
            <div>
              <label className="adminDashboardLabel">Latitude</label>
              <input
                type="number"
                step="any"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="adminDashboardInput"
                required
              />
            </div>
            <div>
              <label className="adminDashboardLabel">Longitude</label>
              <input
                type="number"
                step="any"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="adminDashboardInput"
                required
              />
            </div>
          </div>

          {error && <p className="adminDashboardError">{error}</p>}
          {success && <p className="adminDashboardSuccess">{success}</p>}

          <button type="submit" className="adminDashboardButton">
            Upload Place
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddLocation;
