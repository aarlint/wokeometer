import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { auth0Config } from './auth/auth0-config';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import SearchAssessments from './pages/SearchAssessments';
import FeaturedReleases from './pages/FeaturedReleases';
import Donate from './pages/Donate';
import SavedAssessments from './pages/SavedAssessments';
import NewAssessment from './pages/NewAssessment';
import AssessmentWizard from './pages/AssessmentWizard';
import Results from './pages/Results';
import ViewAssessment from './pages/ViewAssessment';
import EditAssessment from './pages/EditAssessment';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const location = useLocation();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    loginWithRedirect({
      appState: { returnTo: location.pathname }
    });
    return null;
  }

  return children;
};

// Login page component
const LoginPage = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-light-bg dark:bg-dark-bg">
      <div className="text-center p-12 bg-light-card dark:bg-dark-card rounded-lg shadow-xl max-w-md w-full mx-4">
        <h1 className="text-4xl font-bold mb-6 text-light-text dark:text-dark-text">Woke-O-Meter</h1>
        <p className="mb-8 text-lg text-light-text dark:text-dark-text">Make Media Great Again! Rate garbage media!</p>
        <button
          onClick={() => loginWithRedirect()}
          className="w-full px-6 py-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-lg font-semibold"
        >
          Log In
        </button>
      </div>
    </div>
  );
};

// Main app layout component
const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-200">
      <Header />
      <div className="container">
        {children}
      </div>
    </div>
  );
};

function App() {
  const [currentAssessment, setCurrentAssessment] = useState(null);
  
  return (
    <Auth0Provider {...auth0Config}>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/" 
              element={
                <AppLayout>
                  <Home />
                </AppLayout>
              } 
            />
            <Route 
              path="/about" 
              element={
                <AppLayout>
                  <About />
                </AppLayout>
              } 
            />
            <Route 
              path="/search" 
              element={
                <AppLayout>
                  <SearchAssessments />
                </AppLayout>
              } 
            />
            <Route 
              path="/featured" 
              element={
                <AppLayout>
                  <FeaturedReleases />
                </AppLayout>
              } 
            />
            <Route 
              path="/donate" 
              element={
                <AppLayout>
                  <Donate />
                </AppLayout>
              } 
            />
            <Route 
              path="/saved" 
              element={
                <AppLayout>
                  <SavedAssessments />
                </AppLayout>
              } 
            />
            <Route 
              path="/new" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <NewAssessment setCurrentAssessment={setCurrentAssessment} />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/assessment" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    {currentAssessment ? 
                      <AssessmentWizard 
                        currentAssessment={currentAssessment} 
                        setCurrentAssessment={setCurrentAssessment} 
                      /> : 
                      <Navigate to="/new" />
                    }
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/results" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    {currentAssessment ? 
                      <Results 
                        currentAssessment={currentAssessment} 
                        setCurrentAssessment={setCurrentAssessment} 
                      /> : 
                      <Navigate to="/new" />
                    }
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/view/:id" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ViewAssessment />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit/:id" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <EditAssessment />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </Auth0Provider>
  );
}

export default App;
