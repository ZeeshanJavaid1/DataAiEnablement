import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://40.65.191.202:3389/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
});

// Generic GET request
export const getApi = async (endpoint, params = {}) => {
  try {
    debugger
    const response = await apiClient.get(endpoint, { params });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Generic POST request
// Generic POST request with optional token in Authorization header
export const postApi = async (endpoint, data = {}, token = null) => {
  try {
      debugger
    const headers = {};

    // Set headers based on data type
    if (!(data instanceof FormData)) {
      // Only set Content-Type for JSON data
      headers['Content-Type'] = 'application/json';
    }

    // Add JWT token to the Authorization header if provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      headers,
      // Handle FormData properly by preventing automatic transformation
      transformRequest: data instanceof FormData ?
        [(data) => data] : // Don't transform FormData
        [(data) => JSON.stringify(data)] // Transform regular objects to JSON
    };
      debugger
    const response = await apiClient.post(endpoint, data, config);
    return response.data;
  } catch (error) {
    // Enhanced error logging
    if (error.response) {
      console.error('API Response Error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('API Request Error: No response received', error.request);
    } else {
      console.error('API Error:', error.message);
    }

    throw error; // Rethrow error for calling code to handle
  }
};

//new post api method 
export const newPostApi = async (endpoint, data = {}, token = null) => {
  try {
      
    // const headers = {
    //   'Content-Type': 'application/json',
    // };
    const headers = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await apiClient.post(endpoint, JSON.stringify(data), { headers });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('API Response Error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('API Request Error: No response received', error.request);
    } else {
      console.error('API Error:', error.message);
    }

    throw error;
  }
};



export const putApi = async (endpoint, data = {}, token = null) => {
  try {
    const headers = {};

    // Set Content-Type for JSON data
    if (!(data instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    // Add Authorization header if token is provided
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Configure the request
    const config = {
      headers,
      transformRequest: [
        (data) => (data instanceof FormData ? data : JSON.stringify(data)),
      ],
    };

    const response = await apiClient.put(endpoint, data, config);
    return response.data; // Return the response data
  } catch (error) {
    // Handle errors
    if (error.response) {
      console.error("API Response Error:", error.response);
    } else if (error.request) {
      console.error("API Request Error:", error.request);
    } else {
      console.error("API Error:", error.message);
    }
    throw error; // Rethrow the error
  }
};



// Generic DELETE request
export const deleteApi = async (endpoint, body = {}, token = null) => {
  try {
    const headers = {};

    // Add Authorization header if token is provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Configure the request
    const config = {
      headers,
      data: body, // Include body data if required for the DELETE request
    };

    const response = await apiClient.delete(endpoint, config);
    return response.data; // Return the response data
  } catch (error) {
    handleError(error); // Generic error handling function
    throw error; // Re-throw the error for further processing
  }
};

// Error handling function
const handleError = (error) => {
  console.error('API Error:', error);
  throw new Error(error.response?.data?.message || error.message);
};

// Specific API functions using the generic methods

// Login API (remains separate due to specific behavior)
export const loginApi = async (credentials) => {
  try {
    const userData = await postApi('/auth/login', credentials);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};



// Signup API for adding user data to Users table
export const signupApi = (userData) => postApi('/User/AddUser', userData);
//create new course

export const addCourse = (formData) => postApi("/Course/CreateCourse", formData);
// Update course - PUT request
export const updateCourseApi = (courseId, formData) => putApi(`/Course/EditCourse/${courseId}`, formData);

// Delete course - DELETE request
export const deleteCourseApi = (courseId) => deleteApi(`/Course/DeleteCourse/${courseId}`);
export const getCourses = () => getApi("/Course/GetAllCourses");
export const getMostSoldCourses = () => getApi("/Course/GetMostSoldCourses");
// export const addCourseEnrollment = (formData, token) => postApi("/Course/CreateEnrollment", formData, token);
export const addCourseEnrollment = (formData, token) => 
  postApi("/Enrollment/CreateEnrollment", formData, token);
//get enrollment stats for dashboard
export const getEnrolledUserStats = () => postApi("/Enrollment/GetEnrollmentStats"); 
export const updateEnrolledUserStatus = (formData) => putApi("/Enrollment/UpdateEnrollmentStatus", formData);

//ContactUs
export const sendEmailToCommpany = (formData) => postApi("/Profile/SendMessagetoCompany", formData);