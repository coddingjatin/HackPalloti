import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./components/Auth/Auth";
import Quiz from "./components/Quiz/Quiz";
import Security from "./components/Security_Help/Security";
import Help from "./components/Security_Help/Help";
import Setting from "./components/Security_Help/Setting";
import Layout from "./components/Layout"; // Import Layout
import Dash from "./components/Home/Dash";
import Calender from "./components/Calender/Calender"
import Path from "./components/LearningPath/Path";
import ProjectIdea from "./components/LearningPath/ProjectIdea";
import Report from "./components/Report/Report";
import Tree from "./components/Tree/Tree";
import Profile from "./components/Profile/Profile";
import LandingPage from "./components/Landing/LandingPage";
import PictoFlow from "./components/Pictoflow/PictoComponent";
import WorkflowComponent from "./components/Workflow/WorkflowComponent";
import Survey from './components/Survey/Survey';
import Bot from "./components/Chatobot/Bot";
import Meet from "./components/Meet/Meet";
import Room from "./components/Meet/Room";
import 'bootstrap/dist/css/bootstrap.min.css';
import StreaksQuestsPoints from "./components/Streaks/StreaksQuestsPoints";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userEmail = localStorage.getItem("email");
    if (userEmail) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
      
        <Route path="/" element={<Navigate to="/land" />} />
        <Route path="/land" element={<LandingPage/>}/>
        <Route path="/auth" element={<Auth/>}/>
        {/* Protected Routes inside Layout */}
        <Route element={<Layout> {/* Wrap routes with Layout */} </Layout>}>
          <Route path="/home" element={<Dash />} />
          <Route path="/streaks" element={<StreaksQuestsPoints />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/calendar" element={<Calender />} />
          <Route path="/security" element={<Security />} />
          <Route path="/help" element={<Help />} />
          <Route path="/settings" element={<Setting />} />
          <Route path="/path" element={<Path />} />
          <Route path="/tree" element={<Tree />} />
          <Route path="/projects" element={<ProjectIdea />} />
          <Route path="/reports" element={<Report />} />
          <Route path="/test" element={<Quiz />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/pictoflow" element={<PictoFlow />} />
          <Route path="/workflow" element={<WorkflowComponent/>} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/meet" element={<Meet />} />
          <Route path="/room/:roomId" element={<Room />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
