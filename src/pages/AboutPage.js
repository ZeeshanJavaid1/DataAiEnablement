import React from 'react';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaGlobe, 
  FaChartLine, 
  FaUsers, 
  FaAward,
  FaLightbulb,
  FaRocket,
  FaHeart
} from 'react-icons/fa';
import "../assets/css/AboutPage.css";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();
  const locations = [
    {
      id: 1,
      company: "Hermes Intelligent Solutions Pvt. Ltd.",
      city: "Clifton, Karachi",
      country: "Pakistan",
      phone: "+92-3035465552",
      flag: "🇵🇰",
      color: "blue"
    },
    {
      id: 2,
      company: "Lunar Rock Technologies / Hermes Solutions",
      city: "Dubai Silicon Oasis, Dubai",
      country: "UAE",
      phone: null,
      flag: "🇦🇪",
      color: "green"
    },
    {
      id: 3,
      company: "Rawa Solutions",
      city: "Al-Khobar",
      country: "Kingdom of Saudi Arabia",
      phone: null,
      flag: "🇸🇦",
      color: "purple"
    }
  ];

  const stats = [
    { icon: FaUsers, number: "500+", label: "Students Trained" },
    { icon: FaChartLine, number: "50+", label: "Organizations Served" },
    { icon: FaAward, number: "98%", label: "Success Rate" },
    { icon: FaGlobe, number: "3", label: "Global Locations" }
  ];

  const values = [
    {
      icon: FaLightbulb,
      title: "Innovation",
      description: "Continuously evolving our training methods to incorporate the latest industry trends and technologies."
    },
    {
      icon: FaRocket,
      title: "Excellence",
      description: "Delivering world-class training that empowers professionals to excel in their data careers."
    },
    {
      icon: FaHeart,
      title: "Commitment",
      description: "Dedicated to the success of every student and organization we work with."
    }
  ];

  const handleCoursesClick = () => {
        navigate("/Course");
    };
    const handleContactUs = () => {
          navigate("/contact-us");
      };

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section 
        className="about-hero"
        style={{ 
          backgroundImage: `url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)`
        }}
      >
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <div className="about-hero-badge">
            <FaUsers className="about-badge-icon" />
            <span>About Us</span>
          </div>
          <h1 className="about-hero-title">Empowering Organizations Through Data Excellence</h1>
          <p className="about-hero-subtitle">
            Your trusted partner in data analytics and AI training, transforming professionals across the globe
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission-section">
        <div className="about-container">
          <div className="about-mission-content">
            <div className="about-mission-text">
              <h2 className="about-section-title">Our Mission</h2>
              <p className="about-mission-description">
                We are dedicated to empowering organizations and professionals with cutting-edge data analytics 
                and AI training. Our expert-led programs combine theoretical knowledge with hands-on experience, 
                ensuring participants gain practical skills that drive real business value.
              </p>
              <p className="about-mission-description">
                With a proven track record across multiple continents, we've helped hundreds of organizations 
                transform their data capabilities and accelerate their digital transformation journey. Our approach 
                focuses on creating lasting impact through comprehensive training, ongoing support, and a commitment 
                to excellence.
              </p>
            </div>
            <div className="about-mission-image">
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Team collaboration" 
              />
              <div className="about-image-overlay"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-stats-section">
        <div className="about-container">
          <div className="about-stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="about-stat-card">
                <div className="about-stat-icon">
                  <stat.icon />
                </div>
                <h3 className="about-stat-number">{stat.number}</h3>
                <p className="about-stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values-section">
        <div className="about-container">
          <div className="about-section-header">
            <h2 className="about-section-title">Our Core Values</h2>
            <p className="about-section-subtitle">
              The principles that guide everything we do
            </p>
          </div>
          <div className="about-values-grid">
            {values.map((value, index) => (
              <div key={index} className="about-value-card">
                <div className="about-value-icon">
                  <value.icon />
                </div>
                <h3 className="about-value-title">{value.title}</h3>
                <p className="about-value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="about-locations-section">
        <div className="about-container">
          <div className="about-section-header">
            <h2 className="about-section-title">Our Global Presence</h2>
            <p className="about-section-subtitle">
              Serving clients across three strategic locations in the Middle East and South Asia
            </p>
          </div>
          <div className="about-locations-grid">
            {locations.map((location) => (
              <div key={location.id} className={`about-location-card about-location-${location.color}`}>
                <div className="about-location-flag">{location.flag}</div>
                <div className="about-location-content">
                  <h3 className="about-location-company">{location.company}</h3>
                  <div className="about-location-details">
                    <div className="about-location-item">
                      <FaMapMarkerAlt className="about-location-icon" />
                      <div className="about-location-text">
                        <p className="about-location-city">{location.city}</p>
                        <p className="about-location-country">{location.country}</p>
                      </div>
                    </div>
                    {location.phone && (
                      <div className="about-location-item">
                        <FaPhone className="about-location-icon" />
                        <a href={`tel:${location.phone}`} className="about-location-phone">
                          {location.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <div className="about-location-decoration"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta-section">
        <div className="about-cta-overlay"></div>
        <div className="about-container">
          <div className="about-cta-content">
            <h2 className="about-cta-title">Ready to Transform Your Organization?</h2>
            <p className="about-cta-subtitle">
              Join hundreds of professionals who have accelerated their careers through our expert-led training programs
            </p>
            <div className="about-cta-buttons">
              <button className="about-btn about-btn-primary" onClick={handleCoursesClick}>
                Explore Our Courses
              </button>
              <button className="about-btn about-btn-secondary" onClick={handleContactUs}>
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;