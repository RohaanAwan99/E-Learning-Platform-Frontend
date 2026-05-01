import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './screens/loginpage';
import SignupPage from './screens/signuppage';
import Navbar from './components/Navbar';
import TutorialScreen from './screens/tutorialscreen';
import AttemptQuiz from './screens/attemptQuiz';
import HomeScreen from './screens/homescreen';
import TeacherCreateQuiz from "./screens/teachercreatequiz";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/teachercreatequiz" element={<TeacherCreateQuiz />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomeScreen />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/tutorial" element={<TutorialScreen />} />
        <Route path="/quiz" element={<AttemptQuiz />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;