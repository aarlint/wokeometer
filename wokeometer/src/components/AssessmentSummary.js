import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { getWokenessCategory } from '../data';

const AssessmentSummary = ({ show, onClose }) => {
  if (!show) return null;

  const calculateQuestionAverages = () => {
    const questionAverages = {};
    const questionCounts = {};

    // Initialize question tracking
    show.assessments.forEach(assessment => {
      assessment.questions.forEach(q => {
        if (!questionAverages[q.text]) {
          questionAverages[q.text] = 0;
          questionCounts[q.text] = 0;
        }
      });
    });

    // Calculate averages
    show.assessments.forEach(assessment => {
      assessment.questions.forEach(q => {
        const weight = q.weight || 1;
        questionAverages[q.text] += weight;
        questionCounts[q.text]++;
      });
    });

    // Calculate final averages
    Object.keys(questionAverages).forEach(question => {
      questionAverages[question] = questionAverages[question] / questionCounts[question];
    });

    return questionAverages;
  };

  const questionAverages = calculateQuestionAverages();
  const getCategoryClass = (score) => {
    if (score === 0) return "text-category-limited";
    if (score > 0 && score <= 30) return "text-category-limited";
    if (score > 30 && score <= 60) return "text-category-woke";
    if (score > 60 && score <= 120) return "text-category-very";
    if (score > 120) return "text-category-egregiously";
    return "";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-dark-card rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-bold">{show.showName}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-dark-card-hover rounded-lg transition-colors"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          <div className="flex gap-6 mb-8">
            {show.assessments[0]?.show_details?.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w342${show.assessments[0].show_details.poster_path}`}
                alt={show.showName}
                className="w-48 h-72 object-cover rounded-lg shadow-lg"
              />
            )}
            <div className="flex-1">
              <div className="mb-4">
                <h3 className="text-2xl font-bold mb-2">Overall Score: {show.averageScore}</h3>
                <p className={`text-xl ${getCategoryClass(show.averageScore)}`}>
                  {getWokenessCategory(show.averageScore)}
                </p>
              </div>
              <p className="text-dark-muted">
                Based on {show.totalAssessments} assessment{show.totalAssessments !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Question Averages</h3>
            {Object.entries(questionAverages).map(([question, average]) => (
              <div key={question} className="border-b border-dark-border pb-4 last:border-0">
                <p className="font-medium mb-2">{question}</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-dark-card-hover rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(average / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-dark-muted">{average.toFixed(1)}/5</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentSummary; 