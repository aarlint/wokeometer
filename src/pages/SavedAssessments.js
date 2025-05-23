import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { loadAssessmentsForShow, deleteAssessment, useCurrentUserId } from '../lib/supabase-db';
import { calculateScore, getWokenessCategory, QUESTIONS } from '../data';
import Modal from '../components/Modal';
import AssessmentSummary from '../components/AssessmentSummary';
import CommentsPanel from '../components/CommentsPanel';
import QuestionIconCard from '../components/QuestionIconCard';
import { 
  FaEdit, 
  FaTrash, 
  FaSortUp, 
  FaSortDown, 
  FaEye, 
  FaEllipsisV, 
  FaComments, 
  FaThLarge, 
  FaList,
  FaSearch,
  FaPlus,
  FaCheckCircle
} from 'react-icons/fa';

const SavedAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('showName');
  const [sortAscending, setSortAscending] = useState(true);
  const [viewMode, setViewMode] = useState('card');
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    assessmentId: null,
    showName: ''
  });
  const [summaryShow, setSummaryShow] = useState(null);
  const [commentsPanel, setCommentsPanel] = useState({
    isOpen: false,
    showName: null
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = useCurrentUserId();
  
  useEffect(() => {
    loadCatalog();
  }, []);
  
  const loadCatalog = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get all assessments
      const { data: allAssessments, error: assessmentsError } = await supabase
        .from('assessments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (assessmentsError) throw assessmentsError;
      
      // Get unique show names
      const uniqueShows = [...new Set(allAssessments.map(a => a.show_name))];
      
      // For each unique show, get all assessments and calculate average score
      const catalog = await Promise.all(
        uniqueShows.map(async (showName) => {
          const showAssessments = await loadAssessmentsForShow(showName);
          
          // Merge saved question data with full question data from data.js
          const mergedAssessments = showAssessments.map(assessment => {
            const mergedQuestions = assessment.questions.map(savedQ => {
              const fullQuestion = QUESTIONS.find(q => q.id === savedQ.id);
              return {
                ...fullQuestion,
                answer: savedQ.answer
              };
            });
            
            return {
              ...assessment,
              questions: mergedQuestions
            };
          });
          
          // Calculate scores for each assessment
          const scores = mergedAssessments.map(assessment => {
            let totalScore = 0;
            
            // Add points for each Yes answer based on weight
            assessment.questions.forEach(q => {
              if (q.answer === "Yes") {
                totalScore += 10 * q.weight;
              }
            });
            
            return Math.round(totalScore);
          });
          
          // Calculate average score across all assessments
          const averageScore = scores.length > 0 
            ? Math.round(scores.reduce((acc, score) => acc + score, 0) / scores.length)
            : 0;

          // Collect all unique woke elements from all assessments
          const allWokeElements = new Map();
          mergedAssessments.forEach(assessment => {
            assessment.questions.forEach(question => {
              if (question.answer === "Yes" && !allWokeElements.has(question.id)) {
                allWokeElements.set(question.id, question);
              }
            });
          });
          
          // Find user's assessment
          const userAssessment = userId ? mergedAssessments.find(a => a.user_id === userId) : null;
          console.log('Show:', showName, 'User ID:', userId, 'User Assessment:', userAssessment);
          
          return {
            showName,
            assessments: mergedAssessments,
            averageScore,
            totalAssessments: mergedAssessments.length,
            userAssessment,
            allWokeElements: Array.from(allWokeElements.values())
          };
        })
      );
      
      setAssessments(catalog);
    } catch (err) {
      setError('Failed to load catalog. Please try again.');
      console.error('Error loading catalog:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredAssessments = assessments
    .filter(item =>
      item.showName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const multiplier = sortAscending ? 1 : -1;
      switch (sortBy) {
        case 'showName':
          return multiplier * a.showName.localeCompare(b.showName);
        case 'score':
          return multiplier * (b.averageScore - a.averageScore);
        case 'assessments':
          return multiplier * (b.totalAssessments - a.totalAssessments);
        default:
          return 0;
      }
    });
  
  const getCategoryClass = (score) => {
    if (score === 0) return "text-category-based";
    if (score > 0 && score <= 20) return "text-category-limited";
    if (score > 20 && score <= 40) return "text-category-woke";
    if (score > 40 && score <= 60) return "text-category-very";
    if (score > 60) return "text-category-egregiously";
    return "";
  };

  const getScoreColorClass = (score) => {
    if (score >= 7) return "text-red-500";
    if (score >= 3) return "text-yellow-500";
    return "text-green-500";
  };

  const handleViewSummary = (show) => {
    setSummaryShow(show);
  };

  const handleCloseSummary = () => {
    setSummaryShow(null);
  };

  const handleViewAssessment = (assessmentId) => {
    navigate(`/view/${assessmentId}`);
  };

  const handleViewComments = (e, showName) => {
    e.stopPropagation();
    if (!userId) {
      navigate('/login', { state: { redirectTo: '/saved' } });
      return;
    }
    setCommentsPanel({
      isOpen: true,
      showName
    });
  };

  const handleCloseComments = () => {
    setCommentsPanel({
      isOpen: false,
      showName: null
    });
  };

  const handleDeleteClick = (e, assessmentId, showName) => {
    e.stopPropagation();
    if (!userId) {
      navigate('/login', { state: { redirectTo: '/saved' } });
      return;
    }
    setDeleteModal({
      isOpen: true,
      assessmentId,
      showName
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      setError(null);
      await deleteAssessment(userId, deleteModal.assessmentId);
      await loadCatalog(); // Reload catalog after deletion
      setDeleteModal({ isOpen: false, assessmentId: null, showName: '' });
    } catch (err) {
      setError('Failed to delete assessment. Please try again.');
      console.error('Error deleting assessment:', err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, assessmentId: null, showName: '' });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading catalog...</div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to <span className="text-primary">Woke-O-Meter</span></h1>
        <p className="text-gray-600 dark:text-dark-muted mb-6">
          The only media content assessment you'll ever need.
        </p>
        {userId ? (
          <button 
            onClick={() => navigate('/new')} 
            className="btn btn-primary text-lg px-8 py-3 flex items-center gap-2"
          >
            <FaPlus className="w-5 h-5" />
            Start New Assessment
          </button>
        ) : (
          <button 
            onClick={() => navigate('/login', { state: { redirectTo: '/saved' } })} 
            className="btn btn-primary text-lg px-8 py-3 flex items-center gap-2"
          >
            <FaPlus className="w-5 h-5" />
            Login to Start Assessing
          </button>
        )}
      </div>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-dark-text">Media Catalog</h2>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'card' ? 'table' : 'card')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-card-hover rounded-lg transition-colors"
              title={viewMode === 'card' ? "Switch to Table View" : "Switch to Card View"}
            >
              {viewMode === 'card' ? <FaList className="w-5 h-5 text-gray-700 dark:text-dark-text" /> : <FaThLarge className="w-5 h-5 text-gray-700 dark:text-dark-text" />}
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-700 dark:text-dark-text"
            >
              <option value="showName">Sort by Show Name</option>
              <option value="score">Sort by Score</option>
              <option value="assessments">Sort by Number of Assessments</option>
            </select>
            <button
              onClick={() => setSortAscending(!sortAscending)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-card-hover rounded-lg transition-colors"
              title={sortAscending ? "Sort Descending" : "Sort Ascending"}
            >
              {sortAscending ? <FaSortUp className="w-5 h-5 text-gray-700 dark:text-dark-text" /> : <FaSortDown className="w-5 h-5 text-gray-700 dark:text-dark-text" />}
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search Media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-700 dark:text-dark-text placeholder-gray-400 dark:placeholder-gray-500 pl-10"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {filteredAssessments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-dark-muted">No shows found</p>
        </div>
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAssessments.map((item) => (
            <div 
              key={item.showName}
              className="card cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-card-hover transition-colors relative bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border"
            >
              <div className="absolute top-0 right-0 z-10">
                {item.userAssessment && (
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const dropdown = e.currentTarget.nextElementSibling;
                        dropdown.classList.toggle('hidden');
                      }}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-dark-card-hover rounded-lg transition-colors"
                    >
                      <FaEllipsisV className="w-5 h-5 text-gray-700 dark:text-dark-text" />
                    </button>
                    <div className="hidden absolute right-0 top-12 w-48 bg-white dark:bg-dark-card rounded-lg shadow-lg z-10 border border-gray-200 dark:border-dark-border">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewAssessment(item.userAssessment.id);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark-card-hover flex items-center gap-2 text-gray-700 dark:text-dark-text"
                      >
                        <FaEye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/edit/${item.userAssessment.id}`);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark-card-hover flex items-center gap-2 text-gray-700 dark:text-dark-text"
                      >
                        <FaEdit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={(e) => handleDeleteClick(e, item.userAssessment.id, item.showName)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark-card-hover flex items-center gap-2 text-red-600 dark:text-red-400"
                      >
                        <FaTrash className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6">
                {/* First Row: Poster and Movie Info */}
                <div className="flex gap-6 mb-6 border-b border-gray-200 dark:border-dark-border pb-6">
                  {/* Left side - Poster */}
                  {item.assessments[0]?.show_details?.poster_path && (
                    <div className="flex-shrink-0">
                      <img
                        src={`https://image.tmdb.org/t/p/w342${item.assessments[0].show_details.poster_path}`}
                        alt={item.showName}
                        className="w-32 h-48 object-cover rounded-lg shadow-lg"
                      />
                    </div>
                  )}
                  {/* Right side - Movie Info */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-dark-text">{item.showName}</h3>
                      <button
                        onClick={(e) => handleViewComments(e, item.showName)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-dark-card-hover rounded-lg transition-colors"
                        title="View Comments"
                      >
                        <FaComments className="w-5 h-5 text-gray-700 dark:text-dark-text" />
                      </button>
                    </div>
                    
                    {item.assessments[0]?.show_details && (
                      <div className="space-y-2 text-sm text-gray-600 dark:text-dark-muted">
                        <p>
                          <span className="font-medium">Release Date:</span>{' '}
                          {item.assessments[0].show_details.release_date || item.assessments[0].show_details.first_air_date || 'N/A'}
                        </p>
                        <p>
                          <span className="font-medium">Rating:</span>{' '}
                          {item.assessments[0].show_details.vote_average ? `${item.assessments[0].show_details.vote_average.toFixed(1)}/10` : 'N/A'}
                        </p>
                        {item.assessments[0].show_details.overview && (
                          <p className="line-clamp-3">
                            <span className="font-medium">Overview:</span>{' '}
                            {item.assessments[0].show_details.overview}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Second Row: Score and Woke Elements */}
                <div className="space-y-6">
                  {/* Score and Category */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold mb-1 text-gray-800 dark:text-dark-text">Score: {item.averageScore}</p>
                      <p className={`text-lg ${getCategoryClass(item.averageScore)}`}>
                        {getWokenessCategory(item.averageScore)}
                      </p>
                    </div>
                    <div className="text-right text-sm text-gray-600 dark:text-dark-muted">
                      <div>{item.totalAssessments} assessment{item.totalAssessments !== 1 ? 's' : ''}</div>
                      {item.assessments[0]?.questions && (
                        <div>{item.assessments[0].questions.filter(q => q.answer && q.answer !== "" && q.answer !== "N/A").length} answered questions</div>
                      )}
                    </div>
                  </div>

                  {/* All Woke Elements */}
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-dark-text mb-2">Woke Elements:</h4>
                    {item.allWokeElements?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {item.allWokeElements.map((question) => (
                          <QuestionIconCard
                            key={question.id}
                            question={question}
                            size="small"
                            interactive={false}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <FaCheckCircle className="text-xl text-green-500" />
                        <span className="text-green-700 dark:text-green-400 font-medium">No woke elements!</span>
                      </div>
                    )}
                  </div>

                  {/* Assessment Button */}
                  {!item.userAssessment && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!userId) {
                          navigate('/login', { state: { redirectTo: '/saved' } });
                          return;
                        }
                        navigate('/new', { 
                          state: { 
                            showName: item.showName,
                            showDetails: item.assessments[0]?.show_details || null
                          } 
                        });
                      }}
                      className="btn btn-primary w-full mt-4"
                    >
                      {userId ? 'Assess Now' : 'Login to Assess'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg">
            <thead>
              <tr className="bg-gray-50 dark:bg-dark-card border-b border-gray-200 dark:border-dark-border">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Show</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Assessments</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
              {filteredAssessments.map((item) => (
                <tr key={item.showName} className="hover:bg-gray-50/50 dark:hover:bg-dark-card-hover/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.assessments[0]?.show_details?.poster_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${item.assessments[0].show_details.poster_path}`}
                          alt={item.showName}
                          className="h-16 w-12 object-cover rounded mr-4"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-dark-text">{item.showName}</div>
                        {item.assessments[0]?.show_details && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {item.assessments[0].show_details.release_date || item.assessments[0].show_details.first_air_date || 'N/A'}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {item.assessments[0]?.show_details?.overview || 'No description available'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-dark-text">{item.averageScore}</div>
                    {item.assessments[0]?.questions && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.assessments[0].questions.filter(q => q.answer && q.answer !== "" && q.answer !== "N/A").length} answered
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${getCategoryClass(item.averageScore)}`}>
                      {getWokenessCategory(item.averageScore)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {item.totalAssessments}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewSummary(item)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-dark-card-hover rounded-lg transition-colors"
                        title="View Summary"
                      >
                        <FaEye className="w-4 h-4 text-gray-700 dark:text-dark-text" />
                      </button>
                      <button
                        onClick={(e) => handleViewComments(e, item.showName)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-dark-card-hover rounded-lg transition-colors"
                        title="View Comments"
                      >
                        <FaComments className="w-4 h-4 text-gray-700 dark:text-dark-text" />
                      </button>
                      {item.userAssessment && (
                        <div className="relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const dropdown = e.currentTarget.nextElementSibling;
                              dropdown.classList.toggle('hidden');
                            }}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-card-hover rounded-lg transition-colors"
                          >
                            <FaEllipsisV className="w-4 h-4 text-gray-700 dark:text-dark-text" />
                          </button>
                          <div className="hidden absolute right-0 top-12 w-48 bg-white dark:bg-dark-card rounded-lg shadow-lg z-50 border border-gray-200 dark:border-dark-border">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewAssessment(item.userAssessment.id);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark-card-hover flex items-center gap-2 text-gray-700 dark:text-dark-text"
                            >
                              <FaEye className="w-4 h-4" />
                              <span>View</span>
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/edit/${item.userAssessment.id}`);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark-card-hover flex items-center gap-2 text-gray-700 dark:text-dark-text"
                            >
                              <FaEdit className="w-4 h-4" />
                              <span>Edit</span>
                            </button>
                            <button 
                              onClick={(e) => handleDeleteClick(e, item.userAssessment.id, item.showName)}
                              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark-card-hover flex items-center gap-2 text-red-600 dark:text-red-400"
                            >
                              <FaTrash className="w-4 h-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      )}
                      {!item.userAssessment && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!userId) {
                              navigate('/login', { state: { redirectTo: '/saved' } });
                              return;
                            }
                            navigate('/new', { 
                              state: { 
                                showName: item.showName,
                                showDetails: item.assessments[0]?.show_details || null
                              } 
                            });
                          }}
                          className="btn btn-primary text-sm"
                        >
                          {userId ? 'Assess' : 'Login to Assess'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AssessmentSummary
        show={summaryShow}
        onClose={handleCloseSummary}
      />
      
      <CommentsPanel
        showName={commentsPanel.showName}
        isOpen={commentsPanel.isOpen}
        onClose={handleCloseComments}
      />
      
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Assessment"
        message={`Are you sure you want to delete the assessment for "${deleteModal.showName}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default SavedAssessments;
