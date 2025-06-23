import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/axiosInstance";
import '../../assets/css/user/login.css'

 const Login = () => {
    const navigate=useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
      const url=import.meta.env.VITE_BACKEND_URL
   const handleGoogleLogin = () => {
    window.location.href = `${url}/api/user/google`;
  };
  

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    console.log("just print")
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/api/user/login", {
        email: formData.email,
        password: formData.password,
      });

      if(res.data.success){
        if(res.data.admin){
          return navigate("/admin/dashboard")
        }
        if(res.data.user){
          return navigate("/")
        }
      }
      setError(res.data.message)

    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setError(error?.response?.data?.message||"server error try later.");
    }
  };

  return (
    <div className="loginPageContainer">
  <div className="loginPageCard">
    <h2 className="loginPageTitle">
      Login to EPLQ
    </h2>

    <form onSubmit={handleSubmit} className="loginPageForm">
      <div className="loginPageFormGroup">
        <label className="loginPageLabel">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="loginPageInput"
        />
      </div>

      <div className="loginPageFormGroup">
        <label className="loginPageLabel">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="loginPageInput"
        />
      </div>

      {error && (
        <p className="loginPageError">{error}</p>
      )}

      <button type="submit" className="loginPageButton">
        Login
      </button>
    </form>

    <div className="loginPageDividerWrapper">
      <hr className="loginPageDivider" />
      <span className="loginPageDividerText">OR</span>
      <hr className="loginPageDivider" />
    </div>

    <button
      onClick={handleGoogleLogin}
      className="loginPageGoogleButton"
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google Logo"
        className="loginPageGoogleIcon"
      />
      Continue with Google
    </button>
  </div>
</div>

  );
};

export default Login