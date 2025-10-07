import { FaChartLine, FaRobot, FaDatabase, FaArrowRight, FaPlay } from 'react-icons/fa';
import "../assets/css/HomePage.css";
import HeroImage from "../assets/images/tableau3.jpg";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();

  const handleCoursesClick = () => navigate("/Course");
  const handleContactUsClick = () => navigate("/contact-us");

  return (
    <div className="homePage">
      {/* HERO SECTION */}
      <section
        className="homePage-hero"
        style={{ backgroundImage: `url(${HeroImage})` }}
      >
        <div className="homePage-hero-overlay"></div>
        <div className="homePage-hero-content">
          <h1 className="homePage-hero-title">
            Your partner in Data & AI adoption, training, and success.
          </h1>
          <p className="homePage-hero-subtitle">
            Empowering organisations with the skills, tools, and strategies to unlock real value from their data assets.
          </p>
          <div className="homePage-hero-buttons">
            <button className="homePage-btn btn-primary" onClick={handleCoursesClick}>
              Explore Services
            </button>
            <button className="homePage-btn btn-secondary" onClick={handleContactUsClick}>
              <FaPlay className="btn-icon" /> Speak to an Advisor
            </button>
          </div>
        </div>
      </section>

      {/* EXPERT TRAINING SECTION */}
      <section className="homePage-section light-section">
        <div className="homePage-container homePage-zigzag">
          <div className="homePage-image">
            <img
              src="https://images.unsplash.com/photo-1551434678-e076c223a692"
              alt="Expert Training"
            />
          </div>
          <div className="homePage-text">
            <h2>Expert-Led Training Programs</h2>
            <p>
              As an experienced instructor specializing in Power BI and Tableau, I provide comprehensive training programs designed to transform your organization's data capabilities.
            </p>
            <p>
              My training combines theory and real-world projects, ensuring you gain the confidence to create impactful BI solutions.
            </p>
            <div className="homePage-feature-list">
              <div><FaChartLine /> Power BI Expertise</div>
              <div><FaDatabase /> Tableau Mastery</div>
              <div><FaRobot /> Hands-on Learning</div>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOM TRAINING SECTION */}
      <section className="homePage-section dark-section">
        <div className="homePage-container homePage-zigzag reverse">
           <div className="homePage-image">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978"
              alt="Corporate Training"
            />
          </div>
          <div className="homePage-text">
            <h2>Customized Corporate Training</h2>
            <p>
              Organizations worldwide trust my expertise to upskill their teams in data analytics and visualization. I tailor programs to fit your goals and industry needs.
            </p>
            <p>
              From bootcamps to mentorship programs, I provide flexible solutions to empower your team with data excellence.
            </p>
            <div className="homePage-stats">
              <div><h3>500+</h3><p>Students Trained</p></div>
              <div><h3>50+</h3><p>Organizations</p></div>
              <div><h3>98%</h3><p>Success Rate</p></div>
            </div>
          </div>
         
        </div>
      </section>

      {/* OUR COURSES SECTION */}
      <section className="homePage-courses">
        <div className="homePage-container">
          <div className="homePage-header">
            <h2>Our Courses</h2>
            <p>
              Designed by industry experts to kickstart your digital transformation journey.
            </p>
          </div>
          <div className="homePage-course-grid">
            <div className="homePage-course-card">
              <div className="homePage-course-icon"><FaChartLine /></div>
              <h3>Tableau Bootcamp</h3>
              <p>Master Tableau for Business Intelligence with hands-on projects and analytics dashboards.</p>
              <a href="#" className="homePage-course-link">Learn More <FaArrowRight /></a>
            </div>

            <div className="homePage-course-card">
              <div className="homePage-course-icon"><FaRobot /></div>
              <h3>AI & Machine Learning</h3>
              <p>Learn neural networks, NLP, and deep learning to build intelligent data solutions.</p>
              <a href="#" className="homePage-course-link">Learn More <FaArrowRight /></a>
            </div>

            <div className="homePage-course-card">
              <div className="homePage-course-icon"><FaDatabase /></div>
              <h3>Data Engineering</h3>
              <p>Build robust data pipelines and cloud data solutions with modern tools and practices.</p>
              <a href="#" className="homePage-course-link">Learn More <FaArrowRight /></a>
            </div>
          </div>
        </div>
      </section>

      {/* Company Vision Section */}
      <section className="company-vision">
        <div className="vision-overlay"></div>
        <div className="container">
          <div className="vision-content">
            <h2 className="vision-title">
              We provide high quality services & innovative solutions for reliable growth
            </h2>
            <p className="vision-subtitle">
              Transforming organizations through data literacy and empowering teams with the skills to make data-driven decisions that drive business success.
            </p>
            <button className="btn btn-quote">
              GET A QUOTE
            </button>
          </div>
          <div className="vision-features">
            <div className="vision-item">
              <div className="vision-icon">
                <FaChartLine />
              </div>
              <h3>Vision</h3>
              <p>Empowering every organization to become data-driven through expert training and mentorship.</p>
            </div>
            <div className="vision-item">
              <div className="vision-icon">
                <FaDatabase />
              </div>
              <h3>Mission</h3>
              <p>Delivering world-class BI training that transforms teams and accelerates business growth.</p>
            </div>
            <div className="vision-item">
              <div className="vision-icon">
                <FaRobot />
              </div>
              <h3>Goals</h3>
              <p>Creating a community of skilled data professionals who drive innovation and success.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Partner Logos Section */}
      <section className="partner-logos">
        <div className="container">
          <h2 className="section-title">Our Partners</h2>
          <div className="logo-slider" >
            <div className="logo-track">
              <img src={require("../assets/images/weblogo.png")} alt="Partner 1" />
              <img src={require("../assets/images/logo1.jpg")} alt="Partner 2" />
              <img src={require("../assets/images/logo2.jpg")} alt="Partner 3" />
              <img src={require("../assets/images/logo3.jpg")} alt="Partner 4" />
              <img src={require("../assets/images/weblogo.png")} alt="Partner 5" />
              <img src={require("../assets/images/devbasis.png")} alt="Partner 6" />
              {/* duplicate logos for smooth infinite loop */}
              <img src={require("../assets/images/weblogo.png")} alt="Partner 1" />
              <img src={require("../assets/images/logo1.jpg")} alt="Partner 2" />
              <img src={require("../assets/images/logo2.jpg")} alt="Partner 3" />
              <img src={require("../assets/images/logo3.jpg")} alt="Partner 4" />
              <img src={require("../assets/images/devbasis.png")} alt="Partner 5" />
              <img src={require("../assets/images/weblogo.png")} alt="Partner 2" />
              <img src={require("../assets/images/logo1.jpg")} alt="Partner 2" />
              <img src={require("../assets/images/logo2.jpg")} alt="Partner 3" />
              <img src={require("../assets/images/logo3.jpg")} alt="Partner 4" />
              <img src={require("../assets/images/devbasis.png")} alt="Partner 5" />
              <img src={require("../assets/images/weblogo.png")} alt="Partner 3" />
              <img src={require("../assets/images/logo1.jpg")} alt="Partner 2" />
              <img src={require("../assets/images/logo2.jpg")} alt="Partner 3" />
              <img src={require("../assets/images/logo3.jpg")} alt="Partner 4" />
              <img src={require("../assets/images/devbasis.png")} alt="Partner 5" />
              <img src={require("../assets/images/weblogo.png")} alt="Partner 4" />
              <img src={require("../assets/images/logo1.jpg")} alt="Partner 2" />
              <img src={require("../assets/images/logo2.jpg")} alt="Partner 3" />
              <img src={require("../assets/images/logo3.jpg")} alt="Partner 4" />
              <img src={require("../assets/images/devbasis.png")} alt="Partner 5" />
              
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Homepage;