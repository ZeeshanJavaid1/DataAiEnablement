import { FaTwitter, FaLinkedinIn, FaFacebookF, FaInstagram } from "react-icons/fa";
import "../../assets/css/Footer.css";
import DevbasisLogo from '../../assets/images/devbasis.png';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          {/* About Section */}
          <div className="footer-column">
            <h3 className="footer-logo">The Data & <span>AI</span> Enablement Lab</h3>
            <p>
              Empowering organisations with the skills, tools, and strategies to
              unlock real value from their data.
            </p>
            <div className="social-links">
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaLinkedinIn /></a>
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaInstagram /></a>
            </div>
          </div>

          {/* Courses */}
          <div className="footer-column">
            <h3>Courses</h3>
            <ul>
              <li><a href="/Course">Data Science Bootcamp</a></li>
              <li><a href="/Course">AI & Machine Learning</a></li>
              <li><a href="/Course">Data Engineering</a></li>
              <li><a href="/Course">Business Intelligence</a></li>
              <li><a href="/Course">Short Courses</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-column">
            <h3>Resources</h3>
            <ul>
              {/* <li><a href="#">Blog</a></li>
              <li><a href="#">Events</a></li>
              <li><a href="#">Careers</a></li> */}
              <li><a href="/contact-us">ContactUs</a></li>
              {/* <li><a href="#">FAQ</a></li> */}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-column">
            <h3>Contact Us</h3>
            <ul>
              <li>Dubai, UAE</li>
              <li>Whatsapp: +92 303 5465552</li>
              <li>Email: azfarsk@hermesolutions.com</li>
              <li>
                <div className="devbasis-credit">
                  <span>A proud creation by <strong>Devbasis</strong></span>
                  <img src={DevbasisLogo} alt="Devbasis Logo" />
                </div>
              </li>

            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="copyright">
          <p>&copy; 2025 The Data and AI Enablement Lab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
