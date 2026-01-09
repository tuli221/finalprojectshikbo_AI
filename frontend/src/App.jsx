import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './page/LandingPage'
import InteractPage from './page/InteractPage'
import LoginPage from './page/LoginPage'
import RegisterPage from './page/RegisterPage'
import OtpVerifyPage from './page/OtpVerifyPage'
import ForgotPasswordPage from './page/ForgotPasswordPage'
import CourseDetailsPage from './page/CourseDetailsPage'
import CoursesPage from './page/CoursesPage'
import CourseCard from './component/sections/Course/CourseCard'
import AdminLayout from './page/admin/AdminLayout'
import DashboardPage from './page/admin/DashboardPage'
import UsersPage from './page/admin/StudentPage'
import AdminInstructorsPage from './page/admin/InstructorsPage'
import AdminCoursesPage from './page/admin/AdminCoursesPage'
import AdminProgramsPage from './page/admin/AdminProgramsPage'
import PaymentsPage from './page/admin/PaymentsPage'
import AnalyticsPage from './page/admin/AnalyticsPage'
import AddCoursePage from './page/admin/AddCoursePage'
import AddProgram from './page/admin/AddProgram'
import BookingPage from './page/BookingPage'
import AdminCourseView from './page/admin/AdminCourseView'
import AdminEditCourse from './page/admin/AdminEditCourse'
import AddCourseInformation from './page/admin/AddCourseInformation'
import EditCourseInformation from './page/admin/EditCourseInformation'
import InstructorLayout from './page/instructor/InstructorLayout'
import InstructorDashboard from './page/instructor/InstructorDashboard'
import InstructorRequest from './page/instructor/InstructorRequest'
import RequestPending from './page/instructor/RequestPending'

// Student imports
import StudentLayout from './page/student/StudentLayout'
import StudentDashboard from './page/student/StudentDashboard'
import MyCourses from './page/student/MyCourses'
import Community from './page/student/Community'
import Leaderboard from './page/student/Leaderboard'
import Settings from './page/student/Settings'

// Public pages
import PublicInstructorsPage from './page/InstructorsPage'
import LearningCenter from './page/LearningCenter'

function App() {
  return (
    <Routes>
      {/* Make the instructor request page full-window (outside layout) so users see only the form */}
      <Route path="/instructor/request" element={<InstructorRequest />} />
      <Route path="/instructor/request-pending" element={<RequestPending />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/interact" element={<InteractPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<OtpVerifyPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/course/:courseId" element={<CourseDetailsPage />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/instructors" element={<PublicInstructorsPage />} />
      <Route path="/learning-center" element={<LearningCenter />} />
      <Route path="booking/:id" element={<BookingPage />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="instructors" element={<AdminInstructorsPage />} />
        <Route path="courses" element={<AdminCoursesPage />} />
        <Route path="programs" element={<AdminProgramsPage />} />
        <Route path="programs/edit/:id" element={<AddProgram />} />
        <Route path="courses/add" element={<AddCoursePage />} />
        <Route path="programs/add" element={<AddProgram />} />
        <Route path="courses/:id" element={<AdminCourseView />} />
        <Route path="courses/edit/:id" element={<AdminEditCourse />} />
        <Route path="modules/add" element={<AddCourseInformation />} />
        <Route path="modules/edit/:id" element={<EditCourseInformation />} />
        
        <Route path="community" element={<Community />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>

      {/* Instructor Routes */}
      <Route path="/instructor" element={<InstructorLayout />}>
        <Route path="dashboard" element={<InstructorDashboard />} />
        <Route path="my-courses" element={<InstructorDashboard />} />
        <Route path="students" element={<InstructorDashboard />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="payments" element={<InstructorDashboard />} />
        <Route path="messages" element={<InstructorDashboard />} />
        <Route path="profile" element={<InstructorDashboard />} />
      </Route>

      {/* Student Routes: use layout so sidebar shows */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="my-courses" element={<MyCourses />} />
        <Route path="community" element={<Community />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App