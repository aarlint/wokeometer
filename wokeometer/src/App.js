import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import NewAssessment from './pages/NewAssessment';
import AssessmentWizard from './pages/AssessmentWizard';
import Results from './pages/Results';
import SavedAssessments from './pages/SavedAssessments';
import ViewAssessment from './pages/ViewAssessment';

function App() {
  const [currentAssessment, setCurrentAssessment] = useState(null);
  
  return (
    <Router>
      <div className="min-h-screen bg-dark-bg">
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
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
