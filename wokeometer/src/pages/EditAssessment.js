import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAssessment, updateAssessment, useCurrentUserId } from '../lib/supabase-db';
import { calculateScore, getWokenessCategory } from '../data';
import AssessmentWizard from './AssessmentWizard';

const EditAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = useCurrentUserId();
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssessment();
  }, [id]);

  const loadAssessment = async () => {
    try {
      setLoading(true);
      setError(null);
      const assessment = await getAssessment(parseInt(id));
      if (!assessment) {
        setError('Assessment not found');
        return;
      }

      // Check if the user owns this assessment
      if (assessment.user_id !== userId) {
        setError('You do not have permission to edit this assessment');
        return;
      }

      // Prepare the assessment for the wizard - show all questions at once
      const wizardAssessment = {
        ...assessment,
        showName: assessment.show_name,
        showDetails: assessment.show_details,
        questionsPerPage: assessment.questions.length, // Show all questions at once
        currentPage: 1,
        totalPages: 1 // Only one page since we're showing all questions
      };

      setCurrentAssessment(wizardAssessment);
    } catch (err) {
      setError('Failed to load assessment. Please try again.');
      console.error('Error loading assessment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    try {
      setError(null);
      const score = calculateScore(currentAssessment.questions);
      const category = getWokenessCategory(score);
      
      await updateAssessment(
        userId,
        parseInt(id),
        currentAssessment.showName,
        currentAssessment.questions,
        category,
        currentAssessment.showDetails
      );
      
      navigate(`/view/${id}`);
    } catch (err) {
      setError('Failed to update assessment. Please try again.');
      console.error('Error updating assessment:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading assessment...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto card">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p className="text-dark-muted mb-6">{error}</p>
        <button 
          onClick={() => navigate('/')} 
          className="btn btn-primary"
        >
          Back to Saved Assessments
        </button>
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