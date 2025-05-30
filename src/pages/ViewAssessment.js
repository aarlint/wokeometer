import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAssessment, deleteAssessment, useCurrentUserId, useCurrentUser } from '../lib/supabase-db';
import { getWokenessCategory, calculateScore, QUESTIONS } from '../data';
import { FaInfoCircle, FaArrowLeft, FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa';

const ViewAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const userId = useCurrentUserId();
  const userInfo = useCurrentUser();



  const loadAssessment = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load the assessment by ID
      const assessmentData = await getAssessment(parseInt(id));
      if (!assessmentData) {
        setError('Assessment not found');
        return;
      }

      // Merge saved question data with full question data from data.js
      const mergedQuestions = assessmentData.questions.map(savedQ => {
        const fullQuestion = QUESTIONS.find(q => q.id === savedQ.id);
        return {
          ...fullQuestion,
          answer: savedQ.answer
        };
      });

      // Calculate the score from the merged questions
      const calculatedScore = calculateScore(mergedQuestions);
      
      setAssessment({
        ...assessmentData,
        questions: mergedQuestions,
        score: calculatedScore
      });
    } catch (err) {
      setError('Failed to load assessment. Please try again.');
      console.error('Error loading assessment:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadAssessment();
  }, [id, loadAssessment]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading assessment...</div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">Assessment not found</div>
      </div>
    );
  }

  const isUserAssessment = assessment.user_id === userId;

  // Group questions by answer type (supporting both new and legacy formats)
  const getAnsweredQuestions = () => {
    return {
      stronglyAgree: assessment.questions.filter(q => q.answer === "Strongly Agree"),
      agree: assessment.questions.filter(q => q.answer === "Agree"),
      disagree: assessment.questions.filter(q => q.answer === "Disagree"),
      // Include legacy answers for backward compatibility
      legacy: assessment.questions.filter(q => q.answer === "Yes"),
      legacyNo: assessment.questions.filter(q => q.answer === "No"),
      notAnswered: assessment.questions.filter(q => q.answer === "N/A" || !q.answer)
    };
  };

  const answeredQuestions = getAnsweredQuestions();
  const totalAnswered = answeredQuestions.stronglyAgree.length + 
                       answeredQuestions.agree.length + 
                       answeredQuestions.disagree.length + 
                       answeredQuestions.legacy.length +
                       answeredQuestions.legacyNo.length;

  const getCategoryClass = (score) => {
    if (score === 0) return "text-green-600 dark:text-green-400";
    if (score > 0 && score <= 20) return "text-blue-600 dark:text-blue-400";
    if (score > 20 && score <= 40) return "text-yellow-600 dark:text-yellow-400";
    if (score > 40 && score <= 60) return "text-orange-600 dark:text-orange-400";
    if (score > 60) return "text-red-600 dark:text-red-400";
    return "";
  };

  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);
      setError(null);
      setShowDeleteModal(false); // Close modal
      await deleteAssessment(userId, parseInt(id), userInfo);
      navigate('/search');
    } catch (err) {
      setError('Failed to delete assessment. Please try again.');
      console.error('Error deleting assessment:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4 py-8">
      {/* Header */}
      <div className="space-y-4">
        <button 
          onClick={() => navigate('/search')} 
          className="flex items-center gap-2 text-primary hover:text-primary-hover transition-colors"
        >
          <FaArrowLeft />
          Back to Search Assessments
        </button>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{assessment.show_name}</h1>
            {isUserAssessment && (
              <div className="bg-primary text-white px-3 py-1 rounded-lg text-sm font-medium">
                Your Assessment
              </div>
            )}
          </div>
          
          {/* Edit and Delete buttons for user's own assessments */}
          {isUserAssessment && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                <FaEdit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors font-medium"
              >
                <FaTrash className="w-4 h-4" />
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Assessed on {new Date(assessment.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 p-4">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Show Details Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-6 shadow-sm">
        <div className="flex gap-6">
          {assessment.show_details?.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w342${assessment.show_details.poster_path}`}
              alt={assessment.show_name}
              className="w-32 h-48 object-cover rounded-lg shadow-md flex-shrink-0"
            />
          )}
          <div className="flex-1">
            {assessment.show_details && (
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <p>
                  <span className="font-medium">Release Date:</span>{' '}
                  {assessment.show_details.release_date 
                    ? new Date(assessment.show_details.release_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : assessment.show_details.first_air_date 
                    ? new Date(assessment.show_details.first_air_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Rating:</span>{' '}
                  {assessment.show_details.vote_average 
                    ? `${assessment.show_details.vote_average.toFixed(1)}/10 (TMDB)` 
                    : 'N/A'}
                </p>
                {assessment.show_details.overview && (
                  <p className="line-clamp-3">
                    <span className="font-medium">Overview:</span>{' '}
                    {assessment.show_details.overview}
                  </p>
                )}
              </div>
            )}
            
            {/* Wokeness Score Display - Always Visible */}
            <div className="space-y-3">
              <div className="text-center p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-600">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Wokeness Assessment
                </div>
                <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                  {assessment.score}
                </div>
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-xl font-bold ${getCategoryClass(assessment.score)} bg-white dark:bg-gray-900 border-2 border-current`}>
                  {getWokenessCategory(assessment.score)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                  Based on {totalAnswered} answered questions
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <FaInfoCircle className="text-primary" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Assessment Details
          </h3>
        </div>

        <div className="space-y-6">
          {/* Strongly Woke Elements */}
          {(answeredQuestions.stronglyAgree.length > 0 || answeredQuestions.legacy.length > 0) && (
            <div className="space-y-3">
              <h4 className="font-medium text-red-700 dark:text-red-400 text-lg">
                Strongly Woke Elements ({answeredQuestions.stronglyAgree.length + answeredQuestions.legacy.length})
              </h4>
              <div className="space-y-2">
                {[...answeredQuestions.stronglyAgree, ...answeredQuestions.legacy].map((question) => (
                  <div key={question.id} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">{question.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-red-600 dark:text-red-400">{question.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Moderate Woke Elements */}
          {answeredQuestions.agree.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-yellow-700 dark:text-yellow-400 text-lg">
                Moderate Woke Elements ({answeredQuestions.agree.length})
              </h4>
              <div className="space-y-2">
                {answeredQuestions.agree.map((question) => (
                  <div key={question.id} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">{question.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-yellow-600 dark:text-yellow-400">{question.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Non-Woke Elements */}
          {(answeredQuestions.disagree.length > 0 || answeredQuestions.legacyNo.length > 0) && (
            <div className="space-y-3">
              <h4 className="font-medium text-green-700 dark:text-green-400 text-lg">
                Non-Woke Elements ({answeredQuestions.disagree.length + answeredQuestions.legacyNo.length})
              </h4>
              <div className="space-y-2">
                {[...answeredQuestions.disagree, ...answeredQuestions.legacyNo].map((question) => (
                  <div key={question.id} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">{question.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-green-600 dark:text-green-400">{question.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unanswered Questions */}
          {answeredQuestions.notAnswered.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700 dark:text-gray-400 text-lg">
                Unanswered Questions ({answeredQuestions.notAnswered.length})
              </h4>
              <div className="space-y-2">
                {answeredQuestions.notAnswered.map((question) => (
                  <div key={question.id} className="p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{question.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-600 dark:text-gray-400">{question.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={cancelDelete}>
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <FaExclamationTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Delete Assessment
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to delete your assessment for{' '}
                <span className="font-semibold">"{assessment.show_name}"</span>?
              </p>
              
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors font-medium"
                >
                  <FaTrash className="w-4 h-4" />
                  {deleteLoading ? 'Deleting...' : 'Delete Assessment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAssessment;
