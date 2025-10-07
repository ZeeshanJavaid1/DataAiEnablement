import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { sendCode, verifyCode, forgotPassword } from "../redux/reducers/resetPasswordSlice";
import "../assets/css/ForgotPasswordPage.css";
import { toast } from "react-toastify";

const ForgotPasswordPage = ({ onClose }) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSendCode = async () => {
    if (!formData.emailOrPhone) {
      toast.error("⚠️ Please enter your email.");
      return;
    }
    await dispatch(sendCode({ emailOrPhone: formData.emailOrPhone }));
    setStep(2);
  };

  const handleVerifyCode = async () => {
    await dispatch(
      verifyCode({ emailOrPhone: formData.emailOrPhone, code: formData.code })
    );
    setStep(3);
  };

  const handleSavePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("⚠️ Passwords do not match!");
      return;
    }
    try {
      await dispatch(
        forgotPassword({
          data: { email: formData.emailOrPhone, newPassword: formData.newPassword },
        })
      );
      toast.success("🎉 Password reset successful");
      onClose(); // ✅ close modal after success
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  return (
    <div className="forgotPassword-modal-overlay">
      <div className="forgotPassword-modal">
        {/* Close (X) */}
        <button onClick={onClose} className="modal-close-btn">
          ✖
        </button>

        {step === 1 && (
          <div className="modal-step">
            <h2>Forgot Your Password</h2>
            <p>Enter your registered email to continue</p>
            <input
              type="text"
              name="emailOrPhone"
              className="modal-input"
              placeholder="Enter your email"
              value={formData.emailOrPhone}
              onChange={handleChange}
            />
            <button onClick={handleSendCode} className="modal-btn">
              Send Code
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="modal-step">
            <h2>Verify Your Email</h2>
            <p>Enter the 6-digit verification code</p>
            <input
              type="text"
              name="code"
              className="modal-input"
              placeholder="Enter verification code"
              value={formData.code}
              onChange={handleChange}
            />
            <button onClick={handleVerifyCode} className="modal-btn">
              Continue
            </button>
            <button onClick={onClose} className="modal-cancel-btn">
              Cancel
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="modal-step">
            <h2>Reset Password</h2>
            <p>Enter your new password to continue</p>
            <input
              type="password"
              name="newPassword"
              className="modal-input"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleChange}
            />
            <input
              type="password"
              name="confirmPassword"
              className="modal-input"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button onClick={handleSavePassword} className="modal-btn">
              Change Password
            </button>
            <button onClick={onClose} className="modal-cancel-btn">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
