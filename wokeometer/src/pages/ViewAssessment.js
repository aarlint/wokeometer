import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAssessment } from '../lib/supabase-db';

const ViewAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssessment();
  }, [id]);

  const loadAssessment = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAssessment(parseInt(id));
      if (!data) {
        setError('Assessment not found');
        return;
      }

      // Transform the data to match the expected format
      const transformedAssessment = {
        ...data,
        showName: data.show_name,
        showDetails: data.show_details
      };

      setAssessment(transformedAssessment);
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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-3xl font-bold text-center mb-8">
          Assessment for: <span className="text-primary">{assessment.showName}</span>
          {assessment.showType && ` (${assessment.showType})`}
        </h2>
        
        <div className="flex gap-6 mb-8">
          {assessment.showDetails?.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w342${assessment.showDetails.poster_path}`}
              alt={assessment.showName}
              className="w-48 h-72 object-cover rounded-lg shadow-lg"
            />
          )}
          <div className="flex-1">
            {assessment.showDetails && (
              <div className="space-y-2 text-sm text-dark-muted mb-4">
                <p>
                  <span className="font-medium">Release Date:</span>{' '}
                  {assessment.showDetails.release_date || assessment.showDetails.first_air_date || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Rating:</span>{' '}
                  {assessment.showDetails.vote_average ? `${assessment.showDetails.vote_average.toFixed(1)}/10` : 'N/A'}
                </p>
                {assessment.showDetails.overview && (
                  <p className="line-clamp-3">
                    <span className="font-medium">Overview:</span>{' '}
                    {assessment.showDetails.overview}
                  </p>
                )}
              </div>
            )}
            
            <div className="text-4xl font-bold mb-2">{assessment.score}</div>
            <div className={`text-xl font-medium ${getCategoryClass(assessment.category)}`}>
              {assessment.category}
            </div>
          </div>
        </div>
        
        <div className="mt-8 neoglass p-6">
          <h4 className="text-xl font-medium mb-6 text-primary">Assessment Questions</h4>
          
          <div className="text-left">
            {assessment.questions.map((question) => (
              <div key={question.id} className="mb-4 pb-4 border-b border-glass-border">
                <p className="font-medium mb-2">
                  {question.text}
                  <span className="ml-2 text-sm text-dark-muted">
                    (Weight: {(question.weight * 100)}%)
                  </span>
                </p>
                <p className={
                  question.answer === "Agree" || question.answer === "Strongly Agree" 
                  ? "text-category-very font-medium" 
                  : "text-dark-muted"
                }>
                  Answer: {question.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8">
          <button 
            onClick={() => navigate('/saved')} 
            className="btn btn-secondary"
          >
            Back to Saved Assessments
          </button>
        </div>
      </div>
    </div>
  );
};

const getCategoryClass = (category) => {
  if (category === "Limited Wokeness") return "text-category-limited";
  if (category === "Woke") return "text-category-woke";
  if (category === "Very Woke") return "text-category-very";
  if (category === "Egregiously Woke") return "text-category-egregiously";
  return "";
};

export default ViewAssessment;
