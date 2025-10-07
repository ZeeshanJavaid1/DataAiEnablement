import React, { useState } from 'react'; 
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
import { useNavigate } from "react-router-dom";
import "../assets/css/Course.css";
import { useQuery } from '@tanstack/react-query';
import { getCourses } from '../api/apiService';
import Banner from '../components/common/Banner';

const Course = () => {
  const [activeCard, setActiveCard] = useState(null);
const navigate = useNavigate();
  // React Query to fetch courses
  const { data, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const res = await getCourses();
      return res?.data || []; // ✅ unwrap data
    },
  });

  //learn more button
   const handleLearnMore = (course) => {
    navigate("/coursedetail", { state: { course } }); // ✅ send course object
  };

  return (
    <div className="courses-page">
      {/* Hero Section */}
      <Banner/>
     

      {/* Courses Section */}
      <section className="courses-overview course-light-section">
        <div className="course-container">
          <div className="course-section-header">
            <h2 className="course-section-title">Our Training Labs</h2>
            <p className="course-section-subtitle">
              Each lab is designed to solve specific organizational challenges and deliver measurable results
            </p>
          </div>

          <div className="courses-grid">
            {isLoading ? (
              <p>Loading courses...</p>
            ) : data.length > 0 ? (
              data.map((course, index) => {
                // ✅ build image src from base64
                const imageSrc = `data:${course.contentType};base64,${course.imageBytes}`;

                return (
                  <div 
                    key={course.id}
                    className={`course-card ${activeCard === course.id ? 'active' : ''}`}
                    onMouseEnter={() => setActiveCard(course.id)}
                    onMouseLeave={() => setActiveCard(null)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="course-image">
                      <img src={imageSrc} alt={course.title} />
                    </div>

                    <div className="course-content">
                      <div className="course-header">
                        <h3 className="course-title">{course.title}</h3>
                        <p className="course-subtitle">{course.subTitle}</p>
                      </div>

                      <div className="course-meta col-md-12">
                        <div className="course-meta-item">
                          <FaClock className="course-meta-icon" />
                          <span>{course.duration} {course.durationType}</span>
                        </div>
                        <div className="course-meta-item">
                          <FaBookOpen className="course-meta-icon" />
                          <span>{course.level}</span>
                        </div>
                        {course.audience && (
                          <div className="course-meta-item">
                            <FaUsers className="course-meta-icon" />
                            <span>{course.audienceType}</span>
                          </div>
                        )}
                      </div>

                      <div className="course-modules">
                        <h4>Course Description:</h4>
                        {course.courseDescription && (
                          <p>{course.courseDescription}</p>
                        )}
                      </div>

                      <div className="course-footer">
                        <button className="btn-course" onClick={() => handleLearnMore(course)}>
                          Learn More <FaArrowRight />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No courses found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Our Training Section */}
      <section className="course-why-choose course-medium-section">
        <div className="course-container">
          <div className="course-about-content course-image-left">
            <div className="course-about-image">
              <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Expert Training" />
              <div className="course-image-overlay"></div>
            </div>
            <div className="course-about-text">
              <h2 className="course-about-title">Why Choose Our Training Labs?</h2>
              <p className="course-about-description">
                Our training labs aren't just courses—they're transformation experiences. Each lab is designed around real organizational challenges, combining theoretical knowledge with hands-on practice and practical frameworks you can implement immediately.
              </p>
              <p className="course-about-description">
                With a proven track record of helping organizations achieve measurable improvements in data adoption, trust, and decision-making, our labs deliver results that go beyond traditional training.
              </p>
              <div className="course-about-features">
                <div className="course-feature-item">
                  <FaChartLine className="course-feature-icon" />
                  <span>Real-World Application</span>
                </div>
                <div className="course-feature-item">
                  <FaDatabase className="course-feature-icon" />
                  <span>Hands-On Practice</span>
                </div>
                <div className="course-feature-item">
                  <FaRobot className="course-feature-icon" />
                  <span>Immediate Implementation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Approach Section */}
      <section className="course-training-approach course-light-section">
        <div className="course-container">
          <div className="course-about-content course-image-right">
            <div className="course-about-text">
              <h2 className="course-about-title">Our Lab-Based Approach</h2>
              <p className="course-about-description">
                Each training lab follows our proven methodology: Diagnose, Design, Deploy, and Drive adoption. This ensures that every participant walks away not just with new skills, but with actionable plans for organizational transformation.
              </p>
              <p className="course-about-description">
                Our labs are designed for busy professionals who need practical solutions, not theoretical concepts. You'll work with real data, solve actual problems, and build frameworks you can use immediately in your organization.
              </p>
              <div className="course-about-stats">
                <div className="course-stat-item">
                  <h3>500+</h3>
                  <span>Professionals Trained</span>
                </div>
                <div className="course-stat-item">
                  <h3>95%</h3>
                  <span>Implementation Rate</span>
                </div>
                <div className="course-stat-item">
                  <h3>4.8/5</h3>
                  <span>Average Rating</span>
                </div>
              </div>
            </div>
            <div className="course-about-image">
              <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Training Approach" />
              <div className="course-image-overlay"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="course-company-vision">
        <div className="course-vision-overlay"></div>
        <div className="course-container">
          <div className="course-vision-content">
            <h2 className="course-vision-title">
              Ready to Transform Your Organization's Data Capabilities?
            </h2>
            <p className="course-vision-subtitle">
              Join hundreds of professionals who have successfully implemented data-driven transformation through our expert-led training labs.
            </p>
            <button className="btn btn-quote">
              START YOUR JOURNEY
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Course;