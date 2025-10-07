import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../components/common/Banner";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import "../assets/css/Dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useQuery } from '@tanstack/react-query';
import { getEnrolledUserStats, getCourses, getMostSoldCourses } from '../api/apiService';
import { useDispatch } from "react-redux";
import { updateEnrolledUser, deleteCourse } from "../redux/reducers/CourseSlice";
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const Dashboard = () => {
  const [newEnrollPage, setNewEnrollPage] = useState(1);
  const [acceptedPage, setAcceptedPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const [rejectedPage, setRejectedPage] = useState(1);
  const [coursePage, setCoursePage] = useState(1);
  const pageSize = 10;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch enrollment stats
  const { data, isLoading, isError } = useQuery({
    queryKey: ['enrolledUsers'],
    queryFn: async () => {
      const response = await getEnrolledUserStats();
      return response || null;
    },
  });

  // Fetch all courses
  const { data: coursesData, isLoading: coursesLoading, refetch: refetchCourses } = useQuery({
    queryKey: ['allCourses'],
    queryFn: async () => {
      const res = await getCourses();
      return res?.data || [];
    },
  });

   // Fetch all courses
  const { data: soldCoursesData, isLoading: soldCoursesLoading, refetch: refetchSoldCourses } = useQuery({
    queryKey: ['mostSoldCourses'],
    queryFn: async () => {
      const res = await getMostSoldCourses();
      return res?.data || [];
    },
  });

  // Mock data for graphs
  const dailyTraffic = [
    { date: "Mon", visits: 400 },
    { date: "Tue", visits: 600 },
    { date: "Wed", visits: 700 },
    { date: "Thu", visits: 500 },
    { date: "Fri", visits: 900 },
    { date: "Sat", visits: 750 },
    { date: "Sun", visits: 1000 },
  ];

  // Extract data from API response
  const stats = data?.stats || { totalUsers: 0, enrolledUsers: 0, enrollmentPercentage: 0 };
  const newEnrollmentRequests = data?.newEnrollmentRequests || [];
  const acceptedEnrollments = data?.acceptedEnrollments || [];
  const completedCourses = data?.completedCourses || [];
  const rejectedEnrollments = data?.rejectedEnrollments || [];
  const courses = coursesData || [];
  const bestSellingcourses = soldCoursesData || [];
debugger
  // Pagination calculations
  const getPageData = (dataArray, currentPage) => {
    const totalPages = Math.ceil(dataArray.length / pageSize);
    const start = (currentPage - 1) * pageSize;
    const pageData = dataArray.slice(start, start + pageSize);
    return { pageData, totalPages };
  };

  const newEnrollPaginated = useMemo(() =>
    getPageData(newEnrollmentRequests, newEnrollPage),
    [newEnrollmentRequests, newEnrollPage]
  );

  const acceptedPaginated = useMemo(() =>
    getPageData(acceptedEnrollments, acceptedPage),
    [acceptedEnrollments, acceptedPage]
  );

  const completedPaginated = useMemo(() =>
    getPageData(completedCourses, completedPage),
    [completedCourses, completedPage]
  );

  const rejectedPaginated = useMemo(() =>
    getPageData(rejectedEnrollments, rejectedPage),
    [rejectedEnrollments, rejectedPage]
  );

  const coursesPaginated = useMemo(() =>
    getPageData(courses, coursePage),
    [courses, coursePage]
  );

  // Handle enrollment actions
  const handleAccept = async (enrollmentId) => {
    try {
      await dispatch(updateEnrolledUser({
        formData: { enrollmentId, status: "Accepted" }
      })).unwrap();
      toast.success("✅ Enrollment accepted");
    } catch (error) {
      toast.error("❌ Failed to accept enrollment");
    }
  };

  const handleReject = async (enrollmentId) => {
    try {
      await dispatch(updateEnrolledUser({
        formData: { enrollmentId, status: "Rejected" }
      })).unwrap();
      toast.success("🚫 Enrollment rejected");
    } catch (error) {
      toast.error("❌ Failed to reject enrollment");
    }
  };

  const handleCompleted = async (enrollmentId) => {
    try {
      await dispatch(updateEnrolledUser({
        formData: { enrollmentId, status: "Completed" }
      })).unwrap();
      toast.success("🎓 Course marked as completed");
    } catch (error) {
      toast.error("❌ Failed to mark course as completed");
    }
  };

  // Handle course actions
  const handleEditCourse = (course) => {
    navigate("/CreateCourse", { state: { course, isEdit: true } });
  };
const handleCreateCourse = () => {

  // Or if you redirect to a course creation page:
  navigate("/CreateCourse");
};
  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await dispatch(deleteCourse({ courseId })).unwrap();
        toast.success("🗑️ Course deleted successfully");
        refetchCourses();
      } catch (error) {
        toast.error("❌ Failed to delete course");
      }
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (isLoading || coursesLoading) {
    return (
      <div className="container-fluid p-3">
        <div className="text-center mt-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container-fluid p-3">
        <div className="alert alert-danger">
          Error loading dashboard data. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-3">
      <Banner />

      {/* Stats Cards */}
      <div className="row my-4 text-center">
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h5>Total Registered Users</h5>
            <h3>{stats.totalUsers}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h5>Enrolled Users</h5>
            <h3>{stats.enrolledUsers}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h5>Enrollment %</h5>
            <h3>{stats.enrollmentPercentage?.toFixed(1) || 0}%</h3>
          </div>
        </div>
      </div>

      {/* Graphs */}
      <div className="row my-4">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5>Daily Traffic</h5>
            <Line
              data={{
                labels: dailyTraffic.map((d) => d.date),
                datasets: [
                  {
                    label: "Visits",
                    data: dailyTraffic.map((d) => d.visits),
                    borderColor: "blue",
                    backgroundColor: "lightblue",
                  },
                ],
              }}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5>Most Sold Courses</h5>
            <Bar
              data={{
                labels: bestSellingcourses.map((c) => c.title),
                datasets: [
                  {
                    label: "Sales",
                    data: bestSellingcourses.map((c) => c.bestSellingcourses),
                    backgroundColor: "#28a745",
                  },
                ],
              }}
            />
          </div>
        </div>
      </div>

      {/* All Courses Management */}
      <div className="card my-4 p-3 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
    <h5 className="mb-0">All Courses ({courses.length})</h5>
    <button className="btn btn-primary" onClick={handleCreateCourse}>
      + Create Course
    </button>
  </div>
        {courses.length === 0 ? (
          <p className="text-muted">No courses available</p>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Subtitle</th>
                    <th>Duration</th>
                    <th>Level</th>
                    <th>Price</th>
                    <th>Audience</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coursesPaginated.pageData.map((course) => (
                    <tr key={course.id}>
                      <td>{course.title}</td>
                      <td>{course.subTitle}</td>
                      <td>{course.duration} {course.durationType}</td>
                      <td>{course.level}</td>
                      <td>{course.price}</td>
                      <td>{course.audienceType}</td>
                      <td>
                        <div className="dashboard-button-group">
                          <button
                            className="dashboard-icon-button edit"
                            onClick={() => handleEditCourse(course)}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="dashboard-icon-button delete"
                            onClick={() => handleDeleteCourse(course.id)}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>


                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn btn-secondary"
                disabled={coursePage === 1}
                onClick={() => setCoursePage(coursePage - 1)}
              >
                Previous
              </button>
              <span>Page {coursePage} of {coursesPaginated.totalPages}</span>
              <button
                className="btn btn-secondary"
                disabled={coursePage === coursesPaginated.totalPages}
                onClick={() => setCoursePage(coursePage + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* New Enrollment Requests */}
      <div className="card my-4 p-3 shadow-sm">
        <h5>New Enrollment Requests ({newEnrollmentRequests.length})</h5>
        {newEnrollmentRequests.length === 0 ? (
          <p className="text-muted">No pending enrollment requests</p>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Phone Number</th>
                    <th>Course</th>
                    <th>Level</th>
                    <th>Request Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {newEnrollPaginated.pageData.map((req) => (
                    <tr key={req.id}>
                      <td>{req.phoneNumber}</td>
                      <td>{req.courseTitle}</td>
                      <td>{req.courseLevel}</td>
                      <td>{formatDate(req.createdDate)}</td>
                      <td>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleAccept(req.id)}
                        >
                          Accept
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleReject(req.id)}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn btn-secondary"
                disabled={newEnrollPage === 1}
                onClick={() => setNewEnrollPage(newEnrollPage - 1)}
              >
                Previous
              </button>
              <span>Page {newEnrollPage} of {newEnrollPaginated.totalPages}</span>
              <button
                className="btn btn-secondary"
                disabled={newEnrollPage === newEnrollPaginated.totalPages}
                onClick={() => setNewEnrollPage(newEnrollPage + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Accepted Enrollments */}
      <div className="card my-4 p-3 shadow-sm">
        <h5>Accepted Enrollments ({acceptedEnrollments.length})</h5>
        {acceptedEnrollments.length === 0 ? (
          <p className="text-muted">No accepted enrollments</p>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Phone Number</th>
                    <th>Course</th>
                    <th>Level</th>
                    <th>Enrolled Date</th>
                    <th>Status Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {acceptedPaginated.pageData.map((enr) => (
                    <tr key={enr.id}>
                      <td>{enr.phoneNumber}</td>
                      <td>{enr.courseTitle}</td>
                      <td>{enr.courseLevel}</td>
                      <td>{formatDate(enr.createdDate)}</td>
                      <td>{formatDate(enr.statusUpdatedDate)}</td>
                      <td>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleCompleted(enr.id)}
                        >
                          Completed
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn btn-secondary"
                disabled={acceptedPage === 1}
                onClick={() => setAcceptedPage(acceptedPage - 1)}
              >
                Previous
              </button>
              <span>Page {acceptedPage} of {acceptedPaginated.totalPages}</span>
              <button
                className="btn btn-secondary"
                disabled={acceptedPage === acceptedPaginated.totalPages}
                onClick={() => setAcceptedPage(acceptedPage + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Completed Courses */}
      <div className="card my-4 p-3 shadow-sm">
        <h5>Completed Courses ({completedCourses.length})</h5>
        {completedCourses.length === 0 ? (
          <p className="text-muted">No completed courses</p>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-success table-striped">
                <thead>
                  <tr>
                    <th>Phone Number</th>
                    <th>Course</th>
                    <th>Level</th>
                    <th>Enrolled Date</th>
                    <th>Completed Date</th>
                  </tr>
                </thead>
                <tbody>
                  {completedPaginated.pageData.map((course) => (
                    <tr key={course.id}>
                      <td>{course.phoneNumber}</td>
                      <td>{course.courseTitle}</td>
                      <td>{course.courseLevel}</td>
                      <td>{formatDate(course.createdDate)}</td>
                      <td>{formatDate(course.statusUpdatedDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn btn-secondary"
                disabled={completedPage === 1}
                onClick={() => setCompletedPage(completedPage - 1)}
              >
                Previous
              </button>
              <span>Page {completedPage} of {completedPaginated.totalPages}</span>
              <button
                className="btn btn-secondary"
                disabled={completedPage === completedPaginated.totalPages}
                onClick={() => setCompletedPage(completedPage + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Rejected Enrollments */}
      <div className="card my-4 p-3 shadow-sm">
        <h5>Rejected Enrollments ({rejectedEnrollments.length})</h5>
        {rejectedEnrollments.length === 0 ? (
          <p className="text-muted">No rejected enrollments</p>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-danger table-striped">
                <thead>
                  <tr>
                    <th>Phone Number</th>
                    <th>Course</th>
                    <th>Level</th>
                    <th>Request Date</th>
                    <th>Rejected Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rejectedPaginated.pageData.map((rejected) => (
                    <tr key={rejected.id}>
                      <td>{rejected.phoneNumber}</td>
                      <td>{rejected.courseTitle}</td>
                      <td>{rejected.courseLevel}</td>
                      <td>{formatDate(rejected.createdDate)}</td>
                      <td>{formatDate(rejected.statusUpdatedDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn btn-secondary"
                disabled={rejectedPage === 1}
                onClick={() => setRejectedPage(rejectedPage - 1)}
              >
                Previous
              </button>
              <span>Page {rejectedPage} of {rejectedPaginated.totalPages}</span>
              <button
                className="btn btn-secondary"
                disabled={rejectedPage === rejectedPaginated.totalPages}
                onClick={() => setRejectedPage(rejectedPage + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;