// CourseDetailPage.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../assets/css/CourseDetail.css";
import Banner from "../components/common/Banner";
import EnrollModal from "../components/common/EnrollModal";
import { FaArrowLeft, FaArrowRight, FaClock, FaSignal, FaUsers, FaGraduationCap, FaDollarSign } from "react-icons/fa";

const CourseDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const course = state?.course;
  const [showModal, setShowModal] = useState(false);

  const { isLoggedIn } = useSelector((s) => s.auth);

  if (!course) {
    return (
      <div className="course-detail-container">
        <div className="no-course-card">
          <h2>No course selected.</h2>
          <button onClick={() => navigate(-1)} className="btn-back">
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  const imageSrc = `data:${course.contentType};base64,${course.imageBytes}`;

  const handleEnrollClick = () => {
    if (!isLoggedIn) {
      navigate("/loginPage");
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className="coursesdetail-page">
      <Banner />

      <div className="course-detail-container">
        <div className="course-detail-wrapper">
          <div className="course-detail-header">
            <div className="courseDetail-course-image-container">
              <img
                src={imageSrc}
                alt={course.title}
                className="course-detail-image"
              />
              <div className="courseDetail-image-overlay"></div>
            </div>
            
            <div className="course-detail-info">
              <div className="courseDetail-course-title-section">
                <h1 className="courseDetail-course-title">{course.title}</h1>
                <h3 className="courseDetail-course-subtitle">{course.subTitle}</h3>
              </div>

              <div className="courseDetail-course-meta-grid">
                <div className="courseDetail-meta-item">
                  <div className="courseDetail-meta-icon">
                    <FaClock />
                  </div>
                  <div className="courseDetail-meta-content">
                    <span className="courseDetail-meta-label">Duration</span>
                    <span className="courseDetail-meta-value">{course.duration} {course.durationType}</span>
                  </div>
                </div>

                <div className="courseDetail-meta-item">
                  <div className="courseDetail-meta-icon">
                    <FaSignal />
                  </div>
                  <div className="courseDetail-meta-content">
                    <span className="courseDetail-meta-label">Level</span>
                    <span className="courseDetail-meta-value">{course.level}</span>
                  </div>
                </div>

                {course.audience && (
                  <div className="courseDetail-meta-item">
                    <div className="courseDetail-meta-icon">
                      <FaUsers />
                    </div>
                    <div className="courseDetail-meta-content">
                      <span className="courseDetail-meta-label">Audience</span>
                      <span className="courseDetail-meta-value">{course.audience}</span>
                    </div>
                  </div>
                )}

                {course.audienceType && (
                  <div className="courseDetail-meta-item">
                    <div className="courseDetail-meta-icon">
                      <FaGraduationCap />
                    </div>
                    <div className="courseDetail-meta-content">
                      <span className="courseDetail-meta-label">Audience Type</span>
                      <span className="courseDetail-meta-value">{course.audienceType}</span>
                    </div>
                  </div>
                )}

                {course.price && (
                  <div className="courseDetail-meta-item price-item">
                    <div className="courseDetail-meta-icon">
                      <FaDollarSign />
                    </div>
                    <div className="courseDetail-meta-content">
                      <span className="courseDetail-meta-label">Course Fee</span>
                      <span className="courseDetail-meta-value price-value">{course.price}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="course-detail-body">
            <div className="courseDetail-content-section">
              <h2 className="courseDetail-section-title">About this course</h2>
              <p className="courseDetail-course-description">{course.courseDescription}</p>
            </div>

            {course.outlines?.length > 0 && (
              <div className="courseDetail-content-section">
                <h3 className="courseDetail-section-title">Course Outlines</h3>
                <ul className="courseDetail-course-outlines">
                  {course.outlines.map((outline, i) => (
                    <li key={i} className="courseDetail-outline-item">
                      <span className="courseDetail-outline-number">{i + 1}</span>
                      <span className="courseDetail-outline-text">{outline}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="courseDetail-action-buttons-bottom">
            <button className="btn-back" onClick={() => navigate(-1)}>
              <FaArrowLeft />
              <span>Back to Courses</span>
            </button>

            <button className="btn-enroll" onClick={handleEnrollClick}>
              <span>Enroll Now</span>
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>

      <EnrollModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        course={course}
      />
    </div>
  );
};

export default CourseDetail;