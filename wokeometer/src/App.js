import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Home from './pages/Home';
import NewAssessment from './pages/NewAssessment';
import AssessmentWizard from './pages/AssessmentWizard';
import Results from './pages/Results';
import SavedAssessments from './pages/SavedAssessments';
import ViewAssessment from './pages/ViewAssessment';
import EditAssessment from './pages/EditAssessment';

function App() {
  const [currentAssessment, setCurrentAssessment] = useState(null);
  
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-200">
          <Header />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/new" 
                element={<NewAssessment setCurrentAssessment={setCurrentAssessment} />} 
              />
              <Route 
                path="/assessment" 
                element={
                  currentAssessment ? 
                  <AssessmentWizard 
                    currentAssessment={currentAssessment} 
                    setCurrentAssessment={setCurrentAssessment} 
                  /> : 
                  <Navigate to="/new" />
                } 
              />
              <Route 
                path="/results" 
                element={
                  currentAssessment ? 
                  <Results 
                    currentAssessment={currentAssessment} 
                    setCurrentAssessment={setCurrentAssessment} 
                  /> : 
                  <Navigate to="/new" />
                } 
              />
              <Route path="/saved" element={<SavedAssessments />} />
              <Route path="/view/:id" element={<ViewAssessment />} />
              <Route path="/edit/:id" element={<EditAssessment />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
