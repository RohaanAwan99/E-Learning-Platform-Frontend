import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './screens/loginpage'
import SignupPage from './screens/signuppage'
import VerifyEmail from './screens/VerifyEmail'
import HomeScreen from './screens/homescreen'
import BrowseCourses from './screens/student/BrowseCourses'
import CourseDetail from './screens/student/CourseDetail'
import TutorialScreen from './screens/tutorialscreen'
import AttemptQuiz from './screens/attemptQuiz'
import MyCertificates from './screens/student/MyCertificates'
import ProfilePage from './screens/ProfilePage'
import TeacherDashboard from './screens/teacher/TeacherDashboard'
import CreateCourse from './screens/teacher/CreateCourse'
import ManageCourse from './screens/teacher/ManageCourse'
import AddModule from './screens/teacher/AddModule'
import ManageQuiz from './screens/teacher/ManageQuiz'
import CreateBlog from './screens/teacher/CreateBlog'
import BlogList from './screens/BlogList'
import BlogDetail from './screens/BlogDetail'
import AdminDashboard from './screens/admin/AdminDashboard'
import UserManagement from './screens/admin/UserManagement'
import CertificateVerify from './screens/CertificateVerify'
import ContactPage from './screens/ContactPage'
import NotFoundPage from './screens/NotFoundPage'

function App() {
  const { user } = useSelector((state) => state.auth)

  const getRootRedirect = () => {
    if (!user) return <Navigate to="/login" replace />
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />
    if (user.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />
    return <Navigate to="/dashboard" replace />
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={getRootRedirect()} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/verify/:uuid" element={<CertificateVerify />} />

      {/* Student */}
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['student']}><HomeScreen /></ProtectedRoute>} />
      <Route path="/courses" element={<ProtectedRoute allowedRoles={['student','teacher']}><BrowseCourses /></ProtectedRoute>} />
      <Route path="/courses/:id" element={<ProtectedRoute allowedRoles={['student']}><CourseDetail /></ProtectedRoute>} />
      <Route path="/courses/:courseId/modules/:moduleId" element={<ProtectedRoute allowedRoles={['student']}><TutorialScreen /></ProtectedRoute>} />
      <Route path="/courses/:courseId/modules/:moduleId/quiz" element={<ProtectedRoute allowedRoles={['student']}><AttemptQuiz /></ProtectedRoute>} />
      <Route path="/certificates" element={<ProtectedRoute allowedRoles={['student']}><MyCertificates /></ProtectedRoute>} />

      {/* Teacher */}
      <Route path="/teacher/dashboard" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
      <Route path="/teacher/courses/new" element={<ProtectedRoute allowedRoles={['teacher']}><CreateCourse /></ProtectedRoute>} />
      <Route path="/teacher/courses/:id" element={<ProtectedRoute allowedRoles={['teacher']}><ManageCourse /></ProtectedRoute>} />
      <Route path="/teacher/courses/:id/modules/new" element={<ProtectedRoute allowedRoles={['teacher']}><AddModule /></ProtectedRoute>} />
      <Route path="/teacher/courses/:courseId/modules/:moduleId/quiz" element={<ProtectedRoute allowedRoles={['teacher']}><ManageQuiz /></ProtectedRoute>} />
      <Route path="/teacher/blogs/new" element={<ProtectedRoute allowedRoles={['teacher']}><CreateBlog /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />

      {/* Shared */}
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/blogs" element={<ProtectedRoute><BlogList /></ProtectedRoute>} />
      <Route path="/blogs/:id" element={<ProtectedRoute><BlogDetail /></ProtectedRoute>} />
      <Route path="/contact" element={<ContactPage />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App;
