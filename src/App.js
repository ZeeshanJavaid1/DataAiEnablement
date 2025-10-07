import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from '../src/components/Layout';
import Homepage from '../src/pages/Homepage';
import Course from '../src/pages/Course';
import CreateCourse from "../src/pages/CreateCoursePage";
import Dashboard from "../src/pages/Dashboard";
import './App.css';
import { ToastContainer } from 'react-toastify';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CourseDetail from './pages/CourseDetail';
import AboutPage from "./pages/AboutPage";
import ContactUs from "./pages/ContactUs";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

function App() {
  return (
    <Router>
      {/* ✅ Place ToastContainer inside the Router/ThemeProvider */}
      <ToastContainer
        position="top-right"
        // autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        <Route path="/loginPage"
          element={
            <LoginPage/>
          }/>
          <Route path="/registerPage"
          element={
            <RegisterPage/>
          }/>
        <Route path="/"
          element={
            <Layout>
              <Homepage />
            </Layout>
          }/>
           <Route path="/Dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }/>
          <Route path="/Course"
          element={
            <Layout>
              <Course />
            </Layout>
          }/>
          <Route path="/coursedetail"
          element={
            <Layout>
              <CourseDetail/>
            </Layout>
          }/>
          <Route path="/CreateCourse"
          element={
            <Layout>
              <CreateCourse />
            </Layout>
          }/>
          <Route path="/AboutPage"
          element={
            <Layout>
              <AboutPage />
            </Layout>
          }/>
          <Route path="/contact-us"
          element={
            <Layout>
              <ContactUs />
            </Layout>
          }/>
          <Route path="/forgot-password"
          element={
              <ForgotPasswordPage />
          }/>
      </Routes>
    </Router>
  );
}

export default App;
