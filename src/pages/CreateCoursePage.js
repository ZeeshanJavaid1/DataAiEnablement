import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaUpload, FaImage, FaClock,
  FaBookOpen, FaUsers, FaGraduationCap, FaSave } from 'react-icons/fa';
import "../assets/css/CreateCoursePage.css";
import { createNewCourse, updateCourse } from "../redux/reducers/CourseSlice";
import { toast } from 'react-toastify';
import Banner from '../components/common/Banner';

const CreateCoursePage = () => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  
  const editCourse = location.state?.course;
  const isEditMode = location.state?.isEdit || false;

  const [courseData, setCourseData] = useState({
    title: '',
    subtitle: '',
    description: '',
    duration: '',
    durationType: 'days',
    level: 'beginner',
    prerequisites: '',
    audience: '',
    audienceType: '',
    price: '',
    outcome: '',
    image: null,
    imagePreview: null,
    modules: ['']
  });

  const [errors, setErrors] = useState({});

  // Populate form if editing
  useEffect(() => {
    if (isEditMode && editCourse) {
      const imageSrc = editCourse.imageBytes 
        ? `data:${editCourse.contentType};base64,${editCourse.imageBytes}` 
        : null;

      setCourseData({
        title: editCourse.title || '',
        subtitle: editCourse.subTitle || '',
        description: editCourse.courseDescription || '',
        duration: editCourse.duration?.toString() || '',
        durationType: editCourse.durationType || 'days',
        level: editCourse.level || 'beginner',
        prerequisites: editCourse.prerequisites || '',
        audience: editCourse.audience || '',
        audienceType: editCourse.audienceType || '',
        price: editCourse.price || '',
        outcome: editCourse.outcome || '',
        image: null,
        imagePreview: imageSrc,
        modules: editCourse.outlines && editCourse.outlines.length > 0 
          ? editCourse.outlines 
          : ['']
      });
    }
  }, [isEditMode, editCourse]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setCourseData(prev => ({
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

  // Handle module changes
  const handleModuleChange = (index, value) => {
    const newModules = [...courseData.modules];
    newModules[index] = value;
    setCourseData(prev => ({
      ...prev,
      modules: newModules
    }));
  };

  // Add new module field
  const addModuleField = () => {
    setCourseData(prev => ({
      ...prev,
      modules: [...prev.modules, '']
    }));
  };

  // Remove module field
  const removeModuleField = (index) => {
    if (courseData.modules.length > 1) {
      const newModules = courseData.modules.filter((_, i) => i !== index);
      setCourseData(prev => ({
        ...prev,
        modules: newModules
      }));
    }
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size should be less than 5MB'
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setCourseData(prev => ({
          ...prev,
          image: file,
          imagePreview: e.target.result
        }));
        setErrors(prev => ({
          ...prev,
          image: null
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!courseData.title.trim()) newErrors.title = 'Course title is required';
    if (!courseData.subtitle.trim()) newErrors.subtitle = 'Course subtitle is required';
    if (!courseData.description.trim()) newErrors.description = 'Course description is required';
    if (!courseData.duration.trim()) newErrors.duration = 'Duration is required';
    if (!courseData.price.trim()) newErrors.price = 'Course Fee is required';
    if (!courseData.audienceType.trim()) newErrors.audienceType = 'Audience Type is required';
    if (!courseData.imagePreview) newErrors.image = 'Course image is required';

    // Validate modules
    const validModules = courseData.modules.filter(module => module.trim());
    if (validModules.length === 0) newErrors.modules = 'At least one module is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();

    formData.append("title", courseData.title);
    formData.append("subtitle", courseData.subtitle);
    formData.append("description", courseData.description);
    formData.append("duration", parseInt(courseData.duration));
    formData.append("durationType", courseData.durationType);
    formData.append("level", courseData.level);
    if (courseData.prerequisites) formData.append("prerequisites", courseData.prerequisites);
    if (courseData.audience) formData.append("audience", courseData.audience);
    if (courseData.audienceType) formData.append("audienceType", courseData.audienceType);
    if (courseData.price) formData.append("price", courseData.price);
    if (courseData.outcome) formData.append("outcome", courseData.outcome);

    // Append modules
    const validModules = courseData.modules.filter((m) => m.trim());
    validModules.forEach((outline, index) => {
      formData.append(`outlines[${index}]`, outline);
    });

    // Append image file (only if new image uploaded)
    if (courseData.image) {
      formData.append("image", courseData.image);
    }

    try {
      if (isEditMode) {
        await dispatch(updateCourse({ 
          courseId: editCourse.id, 
          data: formData 
        })).unwrap();
        
        toast.success("✏️ Course updated successfully!", {
          position: "top-center",
          theme: "colored",
        });
      } else {
        await dispatch(createNewCourse({ data: formData })).unwrap();
        
        toast.success("🎉 Course created successfully!", {
          position: "top-center",
          theme: "colored",
        });
      }

      // Navigate back to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error(`❌ Failed to ${isEditMode ? 'update' : 'create'} course.`, {
        position: "top-center",
        theme: "colored",
      });
    }
  };

  return (
    <div className="create-course-page">
      <Banner />

      <section className="form-section light-section">
        <div className="container">
          <div className="form-container">
            <div className="form-header">
              <h2>{isEditMode ? 'Edit Course' : 'Create New Course'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="course-form">
              {/* Course Image Upload */}
              <div className="form-group full-width">
                <label className="form-label">
                  <FaImage className="label-icon" />
                  Course Image
                </label>
                <div className="image-upload-area">
                  {courseData.imagePreview ? (
                    <div className="image-preview">
                      <img src={courseData.imagePreview} alt="Course preview" />
                      <div className="image-overlay">
                        <button 
                          type="button"
                          className="change-image-btn"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <FaUpload /> Change Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="upload-placeholder"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FaUpload className="upload-icon" />
                      <p>Click to upload course image</p>
                      <span>Recommended: 1200x600px, max 5MB</span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </div>
                {errors.image && <span className="error-message">{errors.image}</span>}
              </div>

              {/* Course Title */}
              <div className="form-group full-width">
                <label className="form-label">Course Title</label>
                <input
                  type="text"
                  className={`form-input ${errors.title ? 'error' : ''}`}
                  placeholder="e.g., Adoption Lab: Turning Tableau into a Company-Wide Habit"
                  value={courseData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>

              {/* Course Subtitle */}
              <div className="form-group full-width">
                <label className="form-label">Course Subtitle</label>
                <input
                  type="text"
                  className={`form-input ${errors.subtitle ? 'error' : ''}`}
                  placeholder="e.g., Solve low adoption & business user engagement"
                  value={courseData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                />
                {errors.subtitle && <span className="error-message">{errors.subtitle}</span>}
              </div>

              {/* Course Description */}
              <div className="form-group full-width">
                <label className="form-label">Course Description</label>
                <textarea
                  className={`form-textarea ${errors.description ? 'error' : ''}`}
                  rows="4"
                  placeholder="Provide a detailed description of the course..."
                  value={courseData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
                {errors.description && <span className="error-message">{errors.description}</span>}
              </div>

              {/* Duration and Level */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <FaClock className="label-icon" />
                    Duration
                  </label>
                  <div className="duration-input">
                    <input
                      type="number"
                      min="1"
                      className={`form-input duration-number ${errors.duration ? 'error' : ''}`}
                      placeholder="5"
                      value={courseData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                    />
                    <select
                      className="form-select duration-type"
                      value={courseData.durationType}
                      onChange={(e) => handleInputChange('durationType', e.target.value)}
                    >
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                    </select>
                  </div>
                  {errors.duration && <span className="error-message">{errors.duration}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FaGraduationCap className="label-icon" />
                    Course Level
                  </label>
                  <select
                    className="form-select"
                    value={courseData.level}
                    onChange={(e) => handleInputChange('level', e.target.value)}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Prerequisites, Price, Audience Type, Target Audience */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Prerequisites</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., SQL basics, Excel"
                    value={courseData.prerequisites}
                    onChange={(e) => handleInputChange('prerequisites', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Course Fee</label>
                  <input
                    type="text"
                    className={`form-input ${errors.price ? 'error' : ''}`}
                    placeholder="e.g., Negotiable, 1000 $"
                    value={courseData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                  />
                  {errors.price && <span className="error-message">{errors.price}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Audience Group</label>
                  <input
                    type="text"
                    className={`form-input ${errors.audienceType ? 'error' : ''}`}
                    placeholder="e.g., Individual, Organization"
                    value={courseData.audienceType}
                    onChange={(e) => handleInputChange('audienceType', e.target.value)}
                  />
                  {errors.audienceType && <span className="error-message">{errors.audienceType}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FaUsers className="label-icon" />
                    Target Audience
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., IT / Technical Teams"
                    value={courseData.audience}
                    onChange={(e) => handleInputChange('audience', e.target.value)}
                  />
                </div>
              </div>

              {/* Course Modules */}
              <div className="form-group full-width">
                <label className="form-label">
                  <FaBookOpen className="label-icon" />
                  Course Modules
                </label>
                <div className="modules-container">
                  {courseData.modules.map((module, index) => (
                    <div key={index} className="module-input-group">
                      <input
                        type="text"
                        className="form-input module-input"
                        placeholder={`Module ${index + 1}: Enter module description...`}
                        value={module}
                        onChange={(e) => handleModuleChange(index, e.target.value)}
                      />
                      {courseData.modules.length > 1 && (
                        <button
                          type="button"
                          className="remove-module-btn"
                          onClick={() => removeModuleField(index)}
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-module-btn"
                    onClick={addModuleField}
                  >
                    <FaPlus className="btn-icon" />
                    Add Module
                  </button>
                </div>
                {errors.modules && <span className="error-message">{errors.modules}</span>}
              </div>

              {/* Course Outcome */}
              <div className="form-group full-width">
                <label className="form-label">Expected Outcome</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="Describe what participants will achieve after completing this course..."
                  value={courseData.outcome}
                  onChange={(e) => handleInputChange('outcome', e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <div className="form-actions-bottom">
                <button type="submit" className="btn btn-primary">
                  <FaSave className="btn-icon" />
                  {isEditMode ? 'Update Course' : 'Create Course'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary ms-3"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreateCoursePage;