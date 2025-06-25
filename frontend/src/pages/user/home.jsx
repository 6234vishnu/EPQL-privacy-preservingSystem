import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/css/user/Home.css";
import api from "../../services/axiosInstance";

const Home = () => {
  const [userExists, setUserExists] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await api.post(`/api/user/authenticateUser`);
        if (response.data.success) {
          setUserExists(true);
        } else {
          setUserExists(false);
        }
      } catch (error) {
        setUserExists(false);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await api.post("/api/user/logout");
      if (response.data.success) {
        setUserExists(false);
        return navigate("/login");
      }
      setErrorMessage(err?.response?.data?.message);
      return setErrorModal(true);
    } catch (err) {
      console.error("Logout failed");
      setErrorMessage(err?.response?.data?.message);
      return setErrorModal(true);
    }
  };

  if (isLoading) return null;

  return (
    <div className="homeContainer">
      <nav className="homeNavbar">
        <div className="homeLogo">EPLQ</div>
        <div className="homeNavLinks">
          <Link to="/about">About</Link>

          {userExists ? (
            <>
              <Link to="/profile">Profile</Link>
              <button
                className="logoutButton"
                onClick={() => setShowLogoutModal(true)}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </nav>

      <main className="homeContent">
        <h1 className="homeTitle">Welcome to EPLQ</h1>
        <p className="homeSubtitle">
          Efficient and Privacy-Preserving Location-based Query System.
        </p>

        {!userExists ? (
          <div className="homeButtons">
            <Link to="/signUp" className="registerBtn">
              Register
            </Link>
            <Link to="/login" className="loginBtn">
              Login
            </Link>
          </div>
        ) : (
          <div className="homeButtons">
            <Link to="/findPlaces" className="loginBtn">
              Search Location
            </Link>
          </div>
        )}
      </main>

      {showLogoutModal && (
        <div className="modalOverlay">
          <div className="logoutModal">
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to log out?</p>
            <div className="modalActions">
              <button onClick={handleLogout} className="confirmLogoutBtn">
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="cancelLogoutBtn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
