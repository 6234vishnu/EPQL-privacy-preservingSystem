import "../../assets/css/user/About.css";

const About = () => {
  return (
    <div className="aboutContainer">
      <div className="aboutCard">
        <h1 className="aboutTitle">About EPLQ</h1>
        <p className="aboutDescription">
          EPLQ (Efficient Privacy-Preserving Location-based Query) is a system
          designed to help users securely and efficiently query location data
          without compromising their exact location privacy.
        </p>

        <h2 className="aboutSectionTitle">Common Conditions</h2>
        <ul className="aboutList">
          <li>No need to reveal your exact location.</li>
          <li>Only authorized users can access location-based queries.</li>
          <li>Location data is encrypted and never stored without consent.</li>
        </ul>

        <h2 className="aboutSectionTitle">Instructions</h2>
        <ul className="aboutList">
          <li>Register or log in to your account to access the system.</li>
          <li>
            Navigate to the query page and input your desired locations latitude
            and longitude and the institution you want to find.
          </li>
          <li>View results based on encrypted location logic.</li>
          <li>Log out when not in use to maintain data integrity.</li>
        </ul>

        <h2 className="aboutSectionTitle">Contact & Support</h2>
        <p className="aboutContact">
          📧 Email: <a href="mailto:support@eplq.app">support@eplq.app</a>
        </p>
        <p className="aboutContact">
          ☎️ Phone: <a href="tel:+919876543210">+91 7012143978</a>
        </p>
        <p className="aboutContact">
          🕐 Support Hours: 9:00 AM – 6:00 PM IST, Monday to Saturday
        </p>
      </div>
    </div>
  );
};

export default About;
