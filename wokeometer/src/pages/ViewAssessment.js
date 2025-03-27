import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAssessment, useCurrentUserId } from '../lib/supabase-db';
import { getWokenessCategory } from '../data';

const ViewAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = useCurrentUserId();

  useEffect(() => {
    loadAssessment();
  }, [id]);

  const loadAssessment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load the assessment by ID
      const assessmentData = await getAssessment(parseInt(id));
      if (!assessmentData) {
        setError('Assessment not found');
        return;
      }
      
      setAssessment(assessmentData);
    } catch (err) {
      setError('Failed to load assessment. Please try again.');
      console.error('Error loading assessment:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading assessment...</div>
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <button 
          onClick={() => navigate('/')} 
          className="btn btn-secondary mb-4"
        >
          ← Back to Catalog
        </button>
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-4xl font-bold">{assessment.show_name}</h1>
          {isUserAssessment && (
            <div className="bg-primary text-white px-3 py-1 rounded-lg text-sm font-medium">
              Your Assessment
            </div>
          )}
        </div>
        <p className="text-dark-muted">
          Assessed on {new Date(assessment.created_at).toLocaleDateString()}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
          {error}
        </div>
      )}

      <div className="card">
        <div className="p-6">
          <div className="flex gap-6 mb-6">
            {assessment.show_details?.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w342${assessment.show_details.poster_path}`}
                alt={assessment.show_name}
                className="w-48 h-72 object-cover rounded-lg shadow-lg"
              />
            )}
            <div className="flex-1">
              {assessment.show_details && (
                <div className="space-y-2 text-sm text-dark-muted mb-4">
                  <p>
                    <span className="font-medium">Release Date:</span>{' '}
                    {assessment.show_details.release_date || assessment.show_details.first_air_date || 'N/A'}
                  </p>
                  <p>
                    <span className="font-medium">Rating:</span>{' '}
                    {assessment.show_details.vote_average ? `${assessment.show_details.vote_average.toFixed(1)}/10` : 'N/A'}
                  </p>
                  {assessment.show_details.overview && (
                    <p className="line-clamp-3">
                      <span className="font-medium">Overview:</span>{' '}
                      {assessment.show_details.overview}
                    </p>
                  )}
                </div>
              )}
              <h2 className="text-2xl font-bold mb-2">Score: {assessment.score}</h2>
              <p className={`text-xl ${getCategoryClass(assessment.score)}`}>
                {getWokenessCategory(assessment.score)}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {assessment.questions.map((q, index) => (
              <div key={index} className="border-b border-dark-border pb-4 last:border-0">
                <p className="font-medium mb-2">{q.text}</p>
                <p className="text-dark-muted">Answer: {q.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const getCategoryClass = (score) => {
  if (score === 0) return "text-category-limited";
  if (score > 0 && score <= 30) return "text-category-limited";
  if (score > 30 && score <= 60) return "text-category-woke";
  if (score > 60 && score <= 120) return "text-category-very";
  if (score > 120) return "text-category-egregiously";
  return "";
};

export default ViewAssessment;
