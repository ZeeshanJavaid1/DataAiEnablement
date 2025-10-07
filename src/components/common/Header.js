import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, loadUserFromStorage } from "../../redux/reducers/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome, FaUser, FaGraduationCap, FaEnvelope, FaRocket,
  FaChevronDown, FaSignOutAlt
} from "react-icons/fa";
import Logo from "../../assets/images/weblogo.png";
import Sidebar from "../common/Sidebar";
import "../../assets/css/Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    dispatch(loadUserFromStorage());

    const auth = localStorage.getItem("auth");
    if (auth) {
      const { expiry } = JSON.parse(auth);
      const timeLeft = expiry - Date.now();
      if (timeLeft > 0) {
        const timeout = setTimeout(() => {
          dispatch(logout());
        }, timeLeft);
        return () => clearTimeout(timeout);
      } else {
        dispatch(logout());
      }
    }
  }, [dispatch]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      dispatch(logout());
      setDropdownOpen(false);
      navigate("/");
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`headerpage-header ${scrolled ? "headerpage-scrolled" : ""}`}>
        <div className="headerpage-container">
          <a href="/" className="headerpage-logo headerpage-text-logo">
            <div className="headerpage-logo-content">
              <div className="headerpage-logo-text">
                The Data & <span className="headerpage-highlight">AI</span> Coach
              </div>
            </div>
          </a>

          <a href="/" className="headerpage-logo headerpage-image-logo">
            <img src={Logo} alt="Website Logo" />
          </a>

          <div className="headerpage-mobile-menu-btn" onClick={toggleMenu}>
            <div className={`headerpage-hamburger ${menuOpen ? "headerpage-active" : ""}`}>
              <span></span><span></span><span></span>
            </div>
          </div>

          <nav className="headerpage-nav">
            <ul>
              <li>
                <a 
                  href="/" 
                  className={`headerpage-nav-link ${isActive('/') ? 'headerpage-nav-active' : ''}`}
                >
                  <FaHome /> <span className="headerpage-menu-label">Home</span>
                </a>
              </li>
              {user?.isAdmin && (
                <>
                  <li>
                    <a 
                      href="/dashboard" 
                      className={`headerpage-nav-link ${isActive('/dashboard') ? 'headerpage-nav-active' : ''}`}
                    >
                      <FaRocket /> <span className="headerpage-menu-label">Dashboard</span>
                    </a>
                  </li>
                  {/* <li>
                    <a 
                      href="/createCourse" 
                      className={`headerpage-nav-link ${isActive('/createCourse') ? 'headerpage-nav-active' : ''}`}
                    >
                      <FaGraduationCap /> <span className="headerpage-menu-label">Create Course</span>
                    </a>
                  </li> */}
                </>
              )}
              <li>
                <a 
                  href="/course" 
                  className={`headerpage-nav-link ${isActive('/course') ? 'headerpage-nav-active' : ''}`}
                >
                  <FaGraduationCap /> <span className="headerpage-menu-label">Courses</span>
                </a>
              </li>
              <li>
                <a 
                  href="/AboutPage" 
                  className={`headerpage-nav-link ${isActive('/about') ? 'headerpage-nav-active' : ''}`}
                >
                  <FaUser /> <span>About</span>
                </a>
              </li>
              <li>
                <a 
                  href="/contact-us" 
                  className={`headerpage-nav-link ${isActive('/contact') ? 'headerpage-nav-active' : ''}`}
                >
                  <FaEnvelope /> <span className="headerpage-menu-label">Contact</span>
                </a>
              </li>

              {user ? (
                <li className="headerpage-user-dropdown-container">
                  <div 
                    ref={dropdownRef}
                    className={`headerpage-user-dropdown ${dropdownOpen ? "headerpage-open" : ""}`}
                  >
                    <button className="headerpage-user-menu-btn" onClick={toggleDropdown}>
                      <div className="headerpage-user-avatar">
                        <FaUser />
                      </div>
                      <span className="headerpage-user-name">{user.userName}</span>
                      <FaChevronDown className={`headerpage-dropdown-arrow ${dropdownOpen ? "headerpage-open" : ""}`} />
                    </button>

                    {dropdownOpen && (
                      <div className="headerpage-dropdown-menu">
                        <ul>
                          <li onClick={handleLogout} className="headerpage-dropdown-item headerpage-logout-btn">
                            <FaSignOutAlt className="headerpage-logout-icon"/>
                            <span>Log Out</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </li>
              ) : (
                <li>
                  <a href="/loginPage" className="headerpage-btn headerpage-apply-btn">
                    <FaUser /> <span>Login</span>
                  </a>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      {/* Sidebar Component */}
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
    </>
  );
};

export default Header;