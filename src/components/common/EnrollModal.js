import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { enrollInCourse } from "../../redux/reducers/CourseSlice"; // ✅ make sure this path is correct
import "../../assets/css/EnrollModal.css";
import { FaDollarSign, FaMoneyBill, FaPeopleArrows, FaTimes } from "react-icons/fa";
import { toast } from 'react-toastify';

const EnrollModal = ({ isOpen, onClose, course }) => {
  const { user, token } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
debugger
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.userName || "",
        email: user.email || "",
        phone: "",
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  //creating course enrollment
  const handleSubmit = async (e) => {
  e.preventDefault();

  // Validation
  if (!formData.phone) {
    alert("Phone number is required.");
    return;
  }

  // Create FormData instance
  const payload = {
  courseId: course.id,
  phoneNumber: formData.phone,
  status:"New"
};

  try {
    // Dispatch enroll action and unwrap the result
    await dispatch(enrollInCourse({ formData: payload, token })).unwrap();

    toast.success("🎉 Enrolled successfully!", {
      position: "top-center",
      theme: "colored",
    });

    // Optional: Close modal or reset form
    onClose?.();
  } catch (error) {
    console.error("Enrollment failed:", error);
    toast.error(error?.message || "❌ Enrollment failed", {
      position: "top-center",
      theme: "colored",
    });
  }
};


  return (
    <div className="enrollModel-overlay" onClick={onClose}>
      <div className="enrollModel-container" onClick={(e) => e.stopPropagation()}>
        <button className="enrollModel-close" onClick={onClose}>
          <FaTimes style={{ color: "red" }} />
        </button>

        <div className="enrollModel-preview">
          <h2 className="enrollModel-preview-title">Course Enrollment</h2>
        </div>

        <form onSubmit={handleSubmit} className="enrollModel-form">
          <div className="enrollModel-fields">
            <div className="enrollModel-row">
              <div className="enrollModel-group enrollModel-half">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} readOnly />
              </div>

              <div className="enrollModel-group enrollModel-half">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} readOnly />
              </div>
            </div>

            <div className="enrollModel-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          <h4 className="enrollModel-section-title">Course Detail</h4>
          {(course?.courseDescription || course?.price || course?.audienceType) && (
            <div className="enrollModel-course-details">
              <h5 className="enrollModel-course-title">{course?.title}</h5>
              <p className="enrollModel-course-subtitle">{course?.subTitle}</p>

              {course?.courseDescription && (
                <div>
                  <h5>Description</h5>
                  <p className="enrollModel-description">{course.courseDescription}</p>
                </div>
              )}

              <div className="enrollModel-meta">
                {course?.price && (
                  <div className="enrollModel-badge">
                    <span className="enrollModel-icon"><FaMoneyBill /></span>
                    <span>{course.price}</span>
                  </div>
                )}
                {course?.audienceType && (
                  <div className="enrollModel-badge">
                    <span className="enrollModel-icon"><FaPeopleArrows /></span>
                    <span>{course.audienceType}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="enrollModel-actions">
            <button type="button" className="enrollModel-btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="enrollModel-btn-submit">
              Enroll Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollModal;
