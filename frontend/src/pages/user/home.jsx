import { Link } from "react-router-dom";
import '../../assets/css/user/Home.css'

 const Home = () => {
  return (
   <div className="homePageContainer">
  <div className="homePageCard">
    <h1 className="homePageTitle">Welcome to EPLQ</h1>
    <p className="homePageDescription">
      Efficient and Privacy-preserving Location-based Query system.
    </p>

    <div className="homePageButtonGroup">
      <Link to="/signUp" className="homePageRegisterButton">
        Register
      </Link>
      <Link to="/login" className="homePageLoginButton">
        Login
      </Link>
    </div>
  </div>
</div>

  );
};
export default Home;