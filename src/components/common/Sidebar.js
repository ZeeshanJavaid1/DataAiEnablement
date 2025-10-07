import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/reducers/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaGraduationCap,
  FaEnvelope,
  FaRocket,
  FaSignOutAlt,
  FaTimes
} from "react-icons/fa";
import "../../assets/css/Sidebar.css";

const Sidebar = ({ menuOpen, setMenuOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      dispatch(logout());
      navigate("/");
    }
  };

  const handleLogin = () => {
    navigate("/loginPage");
  };

  const toggleMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <div className={`sidebar ${menuOpen ? "sidebar-active" : ""}`}>
        <div className="sidebar-header">
          <button className="sidebar-close-btn" onClick={toggleMenu}>
            <FaTimes />
          </button>

          <div className="sidebar-user-section">
            <div className="sidebar-user-avatar">
              <FaUser />
            </div>
            <div className="sidebar-user-name">
              {user ? user.userName : "Guest User"}
            </div>
          </div>
        </div>

        <div className="sidebar-content">
          <nav className="sidebar-nav">
            <ul>
              <li>
                <a href="/" className={`sidebar-nav-link ${isActive("/") ? "sidebar-nav-active" : ""}`}>
                  <FaHome />
                  <span>Home</span>
                </a>
              </li>
               {user?.isAdmin && (
                <>
                  <li>
                    <a href="/dashboard" className={`sidebar-nav-link ${isActive("/dashboard") ? "sidebar-nav-active" : ""}`}>
                     
                      <FaRocket />
                      <span>Dashboard</span>
                    </a>
                  </li>
                  {/* <li>
                    <a 
                      href="/createCourse" 
                      className={`sidebar-nav-link ${isActive('/createCourse') ? 'sidebar-nav-active' : ""}`}
                    >
                      <FaGraduationCap /> <span>Create Course</span>
                    </a>
                  </li> */}
                </>
              )}
              <li>
                <a href="/course" className={`sidebar-nav-link ${isActive("/course") ? "sidebar-nav-active" : ""}`}>
                  <FaGraduationCap />
                  <span>Courses</span>
                </a>
              </li>
              
              <li>
                <a href="/about" className={`sidebar-nav-link ${isActive("/about") ? "sidebar-nav-active" : ""}`}>
                  <FaUser />
                  <span>About</span>
                </a>
              </li>
              <li>
                <a href="/contact" className={`sidebar-nav-link ${isActive("/contact") ? "sidebar-nav-active" : ""}`}>
                  <FaEnvelope />
                  <span>Contact</span>
                </a>
              </li>

             
            </ul>
          </nav>

          <div className="sidebar-footer">
            {user ? (
              <button className="sidebar-auth-btn sidebar-logout-btn" onClick={handleLogout}>
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            ) : (
              <button className="sidebar-auth-btn sidebar-login-btn" onClick={handleLogin}>
                <FaSignOutAlt />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar overlay */}
      {menuOpen && <div className="sidebar-overlay" onClick={toggleMenu}></div>}
    </>
  );
};

export default Sidebar;
