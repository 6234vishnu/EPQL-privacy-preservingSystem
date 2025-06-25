import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/axiosInstance";
import "../../assets/css/user/signUp.css";

const SignUp = () => {
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BACKEND_URL;

  const handleGoogleSignup = () => {
    window.open(`${url}/api/user/google`, "_self");
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");

    try {
      const res = await api.post("/api/user/userSignUp", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (res.data.success) {
        if (res.data.success) {
          if (res.data.admin) {
            return navigate("/admin/dashboard");
          }
          if (res.data.user) {
            return navigate("/");
          }
        }
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      setError(error?.response?.data?.message || "server error try later.");
    }
  };

  return (
    <div className="signUpPageContainer">
      <div className="signUpPageCard">
        <h2 className="signUpPageTitle">Register for EPLQ</h2>

        <form onSubmit={handleSubmit} className="signUpPageForm">
          <div className="signUpPageFormGroup">
            <label className="signUpPageLabel">User Name</label>
            <input
              type="text"
              name="name"
              className="signUpPageInput"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="signUpPageFormGroup">
            <label className="signUpPageLabel">Email</label>
            <input
              type="email"
              name="email"
              className="signUpPageInput"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="signUpPageFormGroup">
            <label className="signUpPageLabel">Password</label>
            <input
              type="password"
              name="password"
              className="signUpPageInput"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="signUpPageFormGroup">
            <label className="signUpPageLabel">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="signUpPageInput"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="signUpPageError">{error}</p>}

          <button type="submit" className="signUpPageButton">
            Sign up
          </button>

          <p className="signUpPageDivider">or</p>

          <button
            type="button"
            onClick={handleGoogleSignup}
            className="signUpPageGoogleButton"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google Logo"
              className="signUpPageGoogleIcon"
            />
            Sign up with Google
          </button>

          <p className="signUpPageFooterText">
            Already have an account?{" "}
            <a href="/login" className="signUpPageLoginLink">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};
export default SignUp;
