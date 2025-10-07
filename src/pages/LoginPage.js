import React, { useState } from 'react';
import "../assets/css/LoginPage.css";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaUserShield, FaKey } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../redux/reducers/authSlice";
import { toast } from "react-toastify";
import ForgotPasswordPage from "./ForgotPasswordPage";
import logo from '../assets/images/weblogo.png';

const MinimalLoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isAdmin: false,
    adminKey: ''
  });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!isLogin && !formData.name.trim()) newErrors.name = "Full name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin && !formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.isAdmin && !formData.adminKey.trim()) {
      newErrors.adminKey = "Admin key is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignInSignUp = async () => {
    if (!validateForm()) return;

    try {
      if (isLogin) {
        const result = await dispatch(
          login({ username: formData.email, password: formData.password, isAdmin: formData.isAdmin, adminKey: formData.adminKey })
        ).unwrap();

        toast.success(`Login successful`, { position: "top-center", autoClose: 3000, theme: "colored" });

        setTimeout(() => {
          toast.dismiss();
          navigate("/");
        }, 1000);

      } else {
        await dispatch(
          signup({
            userName: formData.name,
            email: formData.email,
            password: formData.password,
            isAdmin: formData.isAdmin,
            adminKey: formData.adminKey
          })
        ).unwrap();

        toast.success("Sign up successful!", { position: "top-center", theme: "colored" });
        setTimeout(() => {
          toast.dismiss();
          setIsLogin(true);
        }, 500);
      }
    } catch (error) {
      console.error(`${isLogin ? "Login" : "Signup"} failed:`, error);
      toast.error(isLogin ? "Your email or password is incorrect" : "Signup failed. Please try again later.", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      isAdmin: false,
      adminKey: ''
    });
    setErrors({});
  };

  return (
    <div className={`minimal-auth-page ${showForgotPassword ? "blur-background" : ""}`}>
      {/* Left Form Section */}
      <div className="minimal-auth-form">
        <div className="minimal-form-container">
          <div className="minimal-logo-section">
            <div className="minimal-logo-icon">
              <img src={logo} style={{width:'100px', height:'60px'}}/>
            </div>
          </div>

          <h2 className="minimal-form-title">{isLogin ? "Login to your account" : "Create your account"}</h2>

          {/* <div className="minimal-social-login">
            <button type="button" className="minimal-social-btn">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path fill="#4285F4" d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"/>
                <path fill="#34A853" d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z"/>
                <path fill="#FBBC05" d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z"/>
                <path fill="#EA4335" d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z"/>
              </svg>
            </button>
            <button type="button" className="minimal-social-btn">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="#1877F2">
                <path d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"/>
              </svg>
            </button>
          </div>

          <div className="minimal-divider">
            <span>Or continue with</span>
          </div> */}

          <div className="minimal-form-fields">
            {!isLogin && (
              <div className="minimal-input-group">
                <label className="minimal-input-label">Name</label>
                <div className="minimal-input-wrapper">
                  <FaUser className="minimal-input-icon" />
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={errors.name ? "error" : ""}
                  />
                </div>
                {errors.name && <span className="minimal-error-message">{errors.name}</span>}
              </div>
            )}

            <div className="minimal-input-group">
              <label className="minimal-input-label">Email</label>
              <div className="minimal-input-wrapper">
                <FaEnvelope className="minimal-input-icon" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "error" : ""}
                />
              </div>
              {errors.email && <span className="minimal-error-message">{errors.email}</span>}
            </div>

            <div className="minimal-input-group">
              <label className="minimal-input-label">Password</label>
              <div className="minimal-input-wrapper">
                <FaLock className="minimal-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={errors.password ? "error" : ""}
                />
                <span
                  className="minimal-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && <span className="minimal-error-message">{errors.password}</span>}
            </div>

            {isLogin && (
              <div className="minimal-forgot-password">
                <span onClick={() => setShowForgotPassword(true)}>
                  Forgot password?
                </span>
              </div>
            )}

            {!isLogin && (
              <div className="minimal-input-group">
                <label className="minimal-input-label">Confirm Password</label>
                <div className="minimal-input-wrapper">
                  <FaLock className="minimal-input-icon" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={errors.confirmPassword ? "error" : ""}
                  />
                  <span
                    className="minimal-password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.confirmPassword && <span className="minimal-error-message">{errors.confirmPassword}</span>}
              </div>
            )}

            {isLogin && (
              <>
                <div className="minimal-checkbox-group">
                  <label className="minimal-checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.isAdmin}
                      onChange={(e) => handleInputChange("isAdmin", e.target.checked)}
                    />
                    <span className="minimal-checkmark"></span>
                    <FaUserShield className="minimal-admin-icon" />
                    Sign in as Administrator
                  </label>
                </div>

                {formData.isAdmin && (
                  <div className="minimal-input-group">
                    <label className="minimal-input-label">Admin Key</label>
                    <div className="minimal-input-wrapper">
                      <FaKey className="minimal-input-icon" />
                      <input
                        type="text"
                        placeholder="Enter Admin Key"
                        value={formData.adminKey}
                        onChange={(e) => handleInputChange("adminKey", e.target.value)}
                        className={errors.adminKey ? "error" : ""}
                      />
                    </div>
                    {errors.adminKey && <span className="minimal-error-message">{errors.adminKey}</span>}
                  </div>
                )}
              </>
            )}

            <button
              type="button"
              className="minimal-submit-btn"
              onClick={handleSignInSignUp}
            >
              {isLogin ? "Login now" : "Sign up now"}
            </button>
          </div>

          <div className="minimal-auth-footer">
            {isLogin ? (
              <p>
                Don't have an account? <span onClick={toggleAuthMode}>SignUp now</span>
              </p>
            ) : (
              <p>
                Already have an account? <span onClick={toggleAuthMode}>Login now</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right Welcome Section */}
      <div className="minimal-auth-welcome">
        <div className="minimal-welcome-content">
          <h2 className="minimal-welcome-title">WELCOME BACK!</h2>
          <p className="minimal-welcome-text">
            You're just one step away from a high-quality scanning experience.
          </p>
          <div className="minimal-illustration">
            <div className="minimal-doc-icon">
              <svg width="120" height="140" viewBox="0 0 120 140" fill="none">
                <rect x="20" y="10" width="80" height="120" rx="4" fill="white" stroke="#10b981" strokeWidth="2"/>
                <line x1="30" y1="30" x2="90" y2="30" stroke="#10b981" strokeWidth="2"/>
                <line x1="30" y1="45" x2="90" y2="45" stroke="#10b981" strokeWidth="2"/>
                <line x1="30" y1="60" x2="75" y2="60" stroke="#10b981" strokeWidth="2"/>
                <rect x="50" y="80" width="20" height="30" rx="2" fill="#10b981"/>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="minimal-circle minimal-circle-1"></div>
        <div className="minimal-circle minimal-circle-2"></div>
        <div className="minimal-circle minimal-circle-3"></div>
        <div className="minimal-circle minimal-circle-4"></div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <ForgotPasswordPage
          onClose={() => setShowForgotPassword(false)}
        />
      )}
    </div>
  );
};

export default MinimalLoginPage;