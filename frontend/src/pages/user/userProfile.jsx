import React, { useState, useEffect } from "react";
import "../../assets/css/user/profile.css";
import api from "../../services/axiosInstance";
import ErrorModal from "./ErrorModal";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userPicture, setUserPicture] = useState(
    "https://www.gravatar.com/avatar/?d=mp&s=96"
  );
  const [userData, setUserData] = useState(null);
  const [editData, setEditData] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [googleId, setGoogleId] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await api.get("/api/user/getUser");
      if (response.data.success) {
        setUserData(response.data.user);
        setGoogleId(response.data.user.googleId);

        return setEditData(response.data.user);
      }
      setError(response.data.message);
      return setErrorModal(true);
    } catch (error) {
      setError(error?.response?.data?.message || "Something went wrong");
      return setErrorModal(true);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditData({ ...userData });
      setError("");
      setSuccess("");
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!editData.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!editData.email.trim()) {
      setError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      const res = await api.patch("/api/user/update/profile", editData);
      if (res.data.success) {
        setSuccess("profile updated Successfully");
        return setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
      setError(res.data.message);
      return setErrorModal(true);
    } catch (error) {
      console.log("errror in profile update", error);

      setError(res.data.message);
      return setErrorModal(true);
    }
  };

  if (!userData) {
    return (
      <>
        {errorModal && (
          <ErrorModal
            message={"Couldn’t get user details, try again later."}
            onClose={() => setErrorModal(false)}
          />
        )}
        <div className="userProfileContainer">Sorry, try later...</div>
      </>
    );
  }

  return (
    <>
      <div className="userProfileContainer">
        <div className="userProfileCard">
          <div className="userProfileHeader">
            <div className="userProfileImageSection">
              <div className="userProfileImageWrapper">
                <img
                  src={userPicture}
                  alt="Profile"
                  className="userProfileImage"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://www.gravatar.com/avatar/?d=mp&s=96";
                  }}
                />
              </div>
            </div>

            <div className="userProfileHeaderInfo">
              <h1 className="userProfileName">{userData.name}</h1>
              <p className="userProfileEmail">{userData.email}</p>
            </div>

            <div className="userProfileActions">
              <button
                onClick={handleEditToggle}
                disabled={googleId}
                className={`userProfileButton ${
                  isEditing
                    ? "userProfileButtonSecondary"
                    : "userProfileButtonPrimary"
                } ${googleId ? "userProfileButtonDisabled" : ""}`}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>

          <div className="userProfileContent">
            {success && <div className="userProfileSuccess">{success}</div>}

            <form onSubmit={handleSave} className="userProfileForm">
              <div className="userProfileFormGrid">
                <div className="userProfileFormGroup">
                  <label className="userProfileLabel">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleInputChange}
                      className="userProfileInput"
                      placeholder="Enter your full name"
                      required
                    />
                  ) : (
                    <div className="userProfileValue">{userData.name}</div>
                  )}
                </div>

                <div className="userProfileFormGroup">
                  <label className="userProfileLabel">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleInputChange}
                      className="userProfileInput"
                      placeholder="Enter your email address"
                      required
                    />
                  ) : (
                    <div className="userProfileValue">{userData.email}</div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="userProfileSubmitSection">
                  <button
                    type="submit"
                    className="userProfileButton userProfileButtonPrimary userProfileSubmitButton"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {googleId && (
        <p className="userProfileNote">
          Editing is disabled for Google account users.
        </p>
      )}

      {errorModal && (
        <ErrorModal message={error} onClose={() => setErrorModal(false)} />
      )}
    </>
  );
};

export default UserProfile;
