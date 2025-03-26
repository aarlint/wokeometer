import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAssessment, updateAssessment, calculateScore, getWokenessCategory } from '../data';
import AssessmentWizard from './AssessmentWizard';

const EditAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const assessment = getAssessment(parseInt(id));
    if (!assessment) {
      setError('Assessment not found');
      return;
    }

    // Prepare the assessment for the wizard - show all questions at once
    const wizardAssessment = {
      ...assessment,
      questionsPerPage: assessment.questions.length, // Show all questions at once
      currentPage: 1,
      totalPages: 1 // Only one page since we're showing all questions
    };

    setCurrentAssessment(wizardAssessment);
  }, [id]);

  const handleFinish = () => {
    if (!currentAssessment) return;

    const score = calculateScore(currentAssessment.questions);
    const category = getWokenessCategory(score);

    updateAssessment(
      currentAssessment.id,
      currentAssessment.showName,
      currentAssessment.questions,
      score,
      category
    );

    navigate('/saved');
  };

  if (error) {
    return (
      <div className="max-w-2xl mx-auto card">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p className="text-dark-muted mb-6">{error}</p>
        <button 
          onClick={() => navigate('/saved')} 
          className="btn btn-primary"
        >
          Back to Saved Assessments
        </button>
      </div>
    );
  }

  if (!currentAssessment) {
    return (
      <div className="max-w-2xl mx-auto card">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AssessmentWizard
      currentAssessment={currentAssessment}
      setCurrentAssessment={setCurrentAssessment}
      onFinish={handleFinish}
    />
  );
};

export default EditAssessment; 