// import React, { useState } from 'react';
// import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserShield, FaUserPlus, FaSignInAlt } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
// import "../assets/css/RegisterPage.css";

// const RegisterPage = () => {
//   const [registerFormData, setRegisterFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     isAdmin: false
//   });
  
//   const [registerShowPassword, setRegisterShowPassword] = useState(false);
//   const [registerShowConfirmPassword, setRegisterShowConfirmPassword] = useState(false);
//   const [registerErrors, setRegisterErrors] = useState({});
//   const [registerIsSubmitting, setRegisterIsSubmitting] = useState(false);

//   const handleRegisterInputChange = (field, value) => {
//     setRegisterFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
    
//     // Clear error for this field when user starts typing
//     if (registerErrors[field]) {
//       setRegisterErrors(prev => ({
//         ...prev,
//         [field]: null
//       }));
//     }
//   };

//   const validateRegisterForm = () => {
//     const newErrors = {};
    
//     if (!registerFormData.name.trim()) {
//       newErrors.name = 'Full name is required';
//     } else if (registerFormData.name.trim().length < 2) {
//       newErrors.name = 'Name must be at least 2 characters';
//     }
    
//     if (!registerFormData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerFormData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }
    
//     if (!registerFormData.password.trim()) {
//       newErrors.password = 'Password is required';
//     } else if (registerFormData.password.length < 8) {
//       newErrors.password = 'Password must be at least 8 characters';
//     } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(registerFormData.password)) {
//       newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
//     }
    
//     if (!registerFormData.confirmPassword.trim()) {
//       newErrors.confirmPassword = 'Please confirm your password';
//     } else if (registerFormData.password !== registerFormData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }
    
//     setRegisterErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleRegisterSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateRegisterForm()) return;
    
//     setRegisterIsSubmitting(true);
    
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       console.log('Register Data:', registerFormData);
//       alert('Registration successful!');
      
//       // Reset form
//       setRegisterFormData({
//         name: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//         isAdmin: false
//       });
//     } catch (error) {
//       console.error('Registration error:', error);
//       alert('Registration failed. Please try again.');
//     } finally {
//       setRegisterIsSubmitting(false);
//     }
//   };

//   const getPasswordStrength = (password) => {
//     let strength = 0;
//     if (password.length >= 8) strength++;
//     if (/[a-z]/.test(password)) strength++;
//     if (/[A-Z]/.test(password)) strength++;
//     if (/\d/.test(password)) strength++;
//     if (/[^A-Za-z0-9]/.test(password)) strength++;
//     return strength;
//   };

//   const getPasswordStrengthLabel = (strength) => {
//     switch (strength) {
//       case 0:
//       case 1: return { label: 'Weak', color: '#ef4444' };
//       case 2: return { label: 'Fair', color: '#f59e0b' };
//       case 3: return { label: 'Good', color: '#10b981' };
//       case 4:
//       case 5: return { label: 'Strong', color: '#059669' };
//       default: return { label: 'Weak', color: '#ef4444' };
//     }
//   };

//   return (
//     <div className="register-page">
//       {/* Register Hero Section */}
//       <section 
//         className="register-hero"
//         style={{ 
//           backgroundImage: `url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80)`
//         }}
//       >
//         <div className="register-hero-overlay"></div>
//         <div className="register-hero-content">
//           <div className="register-hero-badge">
//             <FaUserPlus className="register-badge-icon" />
//             <span>Join Our Community</span>
//           </div>
//           <h1 className="register-hero-title">Create Your Account</h1>
//           <p className="register-hero-subtitle">
//             Join thousands of professionals advancing their careers through expert-led data analytics and AI training programs
//           </p>
//           <div className="register-hero-features">
//             <div className="register-feature">
//               <span className="register-feature-icon">🎯</span>
//               <span>Expert-Led Training</span>
//             </div>
//             <div className="register-feature">
//               <span className="register-feature-icon">📊</span>
//               <span>Hands-On Projects</span>
//             </div>
//             <div className="register-feature">
//               <span className="register-feature-icon">🏆</span>
//               <span>Industry Certification</span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Register Form Section */}
//       <section className="register-form-section">
//         <div className="register-container">
//           <div className="register-form-wrapper">
//             <div className="register-header">
//               <div className="register-header-content">
//                 <h2 className="register-title">Create New Account</h2>
//                 <p className="register-subtitle">Fill in your details to get started with your learning journey</p>
//               </div>
//             </div>

//             <form onSubmit={handleRegisterSubmit} className="register-form">
//               {/* Name Field */}
//               <div className="register-form-group">
//                 <label className="register-form-label">
//                   <FaUser className="register-label-icon" />
//                   Full Name
//                   <span className="register-required">*</span>
//                 </label>
//                 <div className="register-input-wrapper">
//                   <input
//                     type="text"
//                     className={`register-form-input ${registerErrors.name ? 'register-error' : ''}`}
//                     placeholder="Enter your full name"
//                     value={registerFormData.name}
//                     onChange={(e) => handleRegisterInputChange('name', e.target.value)}
//                   />
//                 </div>
//                 {registerErrors.name && <span className="register-error-message">{registerErrors.name}</span>}
//               </div>

//               {/* Email Field */}
//               <div className="register-form-group">
//                 <label className="register-form-label">
//                   <FaEnvelope className="register-label-icon" />
//                   Email Address
//                   <span className="register-required">*</span>
//                 </label>
//                 <div className="register-input-wrapper">
//                   <input
//                     type="email"
//                     className={`register-form-input ${registerErrors.email ? 'register-error' : ''}`}
//                     placeholder="Enter your email address"
//                     value={registerFormData.email}
//                     onChange={(e) => handleRegisterInputChange('email', e.target.value)}
//                   />
//                 </div>
//                 {registerErrors.email && <span className="register-error-message">{registerErrors.email}</span>}
//               </div>

//               {/* Password Field */}
//               <div className="register-form-group">
//                 <label className="register-form-label">
//                   <FaLock className="register-label-icon" />
//                   Password
//                   <span className="register-required">*</span>
//                 </label>
//                 <div className="register-input-wrapper">
//                   <input
//                     type={registerShowPassword ? 'text' : 'password'}
//                     className={`register-form-input ${registerErrors.password ? 'register-error' : ''}`}
//                     placeholder="Create a strong password"
//                     value={registerFormData.password}
//                     onChange={(e) => handleRegisterInputChange('password', e.target.value)}
//                   />
//                   <button
//                     type="button"
//                     className="register-password-toggle"
//                     onClick={() => setRegisterShowPassword(!registerShowPassword)}
//                   >
//                     {registerShowPassword ? <FaEyeSlash /> : <FaEye />}
//                   </button>
//                 </div>
//                 {registerFormData.password && (
//                   <div className="register-password-strength">
//                     <div className="register-strength-bar">
//                       {[1, 2, 3, 4, 5].map(level => (
//                         <div
//                           key={level}
//                           className={`register-strength-segment ${
//                             level <= getPasswordStrength(registerFormData.password) ? 'register-strength-active' : ''
//                           }`}
//                           style={{
//                             backgroundColor: level <= getPasswordStrength(registerFormData.password) 
//                               ? getPasswordStrengthLabel(getPasswordStrength(registerFormData.password)).color 
//                               : '#e2e8f0'
//                           }}
//                         />
//                       ))}
//                     </div>
//                     <span 
//                       className="register-strength-label"
//                       style={{ color: getPasswordStrengthLabel(getPasswordStrength(registerFormData.password)).color }}
//                     >
//                       {getPasswordStrengthLabel(getPasswordStrength(registerFormData.password)).label}
//                     </span>
//                   </div>
//                 )}
//                 <div className="register-input-hint">
//                   Password must contain at least 8 characters with uppercase, lowercase, and numbers
//                 </div>
//                 {registerErrors.password && <span className="register-error-message">{registerErrors.password}</span>}
//               </div>

//               {/* Confirm Password Field */}
//               <div className="register-form-group">
//                 <label className="register-form-label">
//                   <FaLock className="register-label-icon" />
//                   Confirm Password
//                   <span className="register-required">*</span>
//                 </label>
//                 <div className="register-input-wrapper">
//                   <input
//                     type={registerShowConfirmPassword ? 'text' : 'password'}
//                     className={`register-form-input ${registerErrors.confirmPassword ? 'register-error' : ''}`}
//                     placeholder="Confirm your password"
//                     value={registerFormData.confirmPassword}
//                     onChange={(e) => handleRegisterInputChange('confirmPassword', e.target.value)}
//                   />
//                   <button
//                     type="button"
//                     className="register-password-toggle"
//                     onClick={() => setRegisterShowConfirmPassword(!registerShowConfirmPassword)}
//                   >
//                     {registerShowConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//                   </button>
//                 </div>
//                 {registerFormData.confirmPassword && registerFormData.password === registerFormData.confirmPassword && (
//                   <div className="register-success-message">
//                     ✓ Passwords match
//                   </div>
//                 )}
//                 {registerErrors.confirmPassword && <span className="register-error-message">{registerErrors.confirmPassword}</span>}
//               </div>

//               {/* Admin Checkbox */}
//               <div className="register-form-group">
//                 <div className="register-checkbox-wrapper">
//                   <input
//                     type="checkbox"
//                     id="registerIsAdmin"
//                     className="register-checkbox"
//                     checked={registerFormData.isAdmin}
//                     onChange={(e) => handleRegisterInputChange('isAdmin', e.target.checked)}
//                   />
//                   <label htmlFor="registerIsAdmin" className="register-checkbox-label">
//                     <FaUserShield className="register-admin-icon" />
//                     Register as Administrator
//                     <span className="register-admin-note">
//                       (Admin accounts have additional privileges and management capabilities)
//                     </span>
//                   </label>
//                 </div>
//               </div>

//               {/* Terms and Conditions */}
//               <div className="register-terms">
//                 <p>
//                   By creating an account, you agree to our{' '}
//                   <Link to="/terms" className="register-terms-link">Terms of Service</Link>{' '}
//                   and{' '}
//                   <Link to="/privacy" className="register-terms-link">Privacy Policy</Link>
//                 </p>
//               </div>

//               {/* Submit Button */}
//               <div className="register-form-actions">
//                 <button 
//                   type="submit" 
//                   className="register-btn register-btn-primary"
//                   disabled={registerIsSubmitting}
//                 >
//                   <FaUserPlus className="register-btn-icon" />
//                   {registerIsSubmitting ? 'Creating Account...' : 'Create Account'}
//                 </button>
//               </div>

//               {/* Login Link */}
//               <div className="register-login-link">
//                 <p>Already have an account?</p>
//                 <Link to="/login" className="register-link-button">
//                   <FaSignInAlt className="register-link-icon" />
//                   Sign In to Your Account
//                 </Link>
//               </div>
//             </form>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default RegisterPage;