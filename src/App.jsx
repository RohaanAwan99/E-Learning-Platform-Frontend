import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoginPage from './screens/loginpage';
import SignupPage from './screens/signuppage';
import Navbar from './components/Navbar';
import TutorialScreen from './screens/tutorialscreen';
import AttemptQuiz from './screens/attemptQuiz';
import HomeScreen from './screens/homescreen';
import TeacherCreateQuiz from "./screens/teachercreatequiz";
import ProtectedRoute from "./components/ProtectedRoute";
import { fetchCurrentUser } from "./store/slices/authSlice";

function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes (Any Authenticated User) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/course/:id" element={<TutorialScreen />} />
        </Route>

        {/* Protected Routes (Students Only) */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/quiz" element={<AttemptQuiz />} />
        </Route>

        {/* Protected Routes (Teachers Only) */}
        <Route element={<ProtectedRoute allowedRoles={['teacher', 'admin']} />}>
          <Route path="/teachercreatequiz" element={<TeacherCreateQuiz />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
