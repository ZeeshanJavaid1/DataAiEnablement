import React from "react";
import '../../assets/css/Banner.css';
import {
  FaChartLine,
  FaRobot,
  FaDatabase,
  FaClock,
  FaUsers,
  FaBookOpen,
  FaArrowRight,
  FaPlay
} from 'react-icons/fa';
import HeroImage from "../../assets/images/heroimage.png";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  const handleHomeClick = () => {
    navigate("/");
  };
  const handleContactUsClick = () => {
    navigate("/contact-us");
  };
  return (
    <div>


      {/* Hero Section */}
      <section
        className="hero"
        style={{ backgroundImage: `url(${HeroImage})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Expert-Led Training Programs</h1>
          <p className="hero-subtitle">
            Transform your organization's data capabilities with comprehensive, hands-on training designed by industry experts
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={handleHomeClick}>Read Our Narratives</button>
            <button className="btn btn-secondary" onClick={handleContactUsClick}>
              <FaPlay className="btn-icon"  />
              Schedule Consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
export default Banner;