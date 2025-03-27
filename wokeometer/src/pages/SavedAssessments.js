import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { loadAssessmentsForShow, getAverageScoreForShow, deleteAssessment, useCurrentUserId } from '../lib/supabase-db';
import { getWokenessCategory } from '../data';
import Modal from '../components/Modal';
import AssessmentSummary from '../components/AssessmentSummary';
import { FaEdit, FaTrash, FaSort, FaSortUp, FaSortDown, FaEye, FaEllipsisV } from 'react-icons/fa';

const SavedAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('showName');
  const [sortAscending, setSortAscending] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    assessmentId: null,
    showName: ''
  });
  const [summaryShow, setSummaryShow] = useState(null);
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
          const averageScore = await getAverageScoreForShow(showName);
          
          return {
            showName,
            assessments: showAssessments,
            averageScore,
            totalAssessments: showAssessments.length,
            userAssessment: showAssessments.find(a => a.user_id === userId)
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
    if (score === 0) return "text-category-limited";
    if (score > 0 && score <= 30) return "text-category-limited";
    if (score > 30 && score <= 60) return "text-category-woke";
    if (score > 60 && score <= 120) return "text-category-very";
    if (score > 120) return "text-category-egregiously";
    return "";
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

  const handleDeleteClick = (e, assessmentId, showName) => {
    e.stopPropagation();
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
        <p className="text-dark-muted mb-6">
          The only media content assessment you'll ever need.
        </p>
        <button 
          onClick={() => navigate('/new')} 
          className="btn btn-primary text-lg px-8 py-3"
        >
          Start New Assessment
        </button>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Media Catalog</h2>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
            >
              <option value="showName">Sort by Show Name</option>
              <option value="score">Sort by Score</option>
              <option value="assessments">Sort by Number of Assessments</option>
            </select>
            <button
              onClick={() => setSortAscending(!sortAscending)}
              className="p-2 hover:bg-dark-card-hover rounded-lg transition-colors"
              title={sortAscending ? "Sort Descending" : "Sort Ascending"}
            >
              {sortAscending ? <FaSortUp className="w-5 h-5" /> : <FaSortDown className="w-5 h-5" />}
            </button>
          </div>
          <input
            type="text"
            placeholder="Search Media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
          />
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {filteredAssessments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-dark-muted">No shows found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAssessments.map((item) => (
            <div 
              key={item.showName}
              className="card cursor-pointer hover:bg-dark-card-hover transition-colors relative"
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
                      className="p-2 hover:bg-dark-card-hover rounded-lg transition-colors"
                    >
                      <FaEllipsisV className="w-5 h-5" />
                    </button>
                    <div className="hidden absolute right-0 top-12 w-48 bg-dark-card rounded-lg shadow-lg z-10">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewAssessment(item.userAssessment.id);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-dark-card-hover flex items-center gap-2"
                      >
                        <FaEye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/edit/${item.userAssessment.id}`);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-dark-card-hover flex items-center gap-2"
                      >
                        <FaEdit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={(e) => handleDeleteClick(e, item.userAssessment.id, item.showName)}
                        className="w-full px-4 py-2 text-left hover:bg-dark-card-hover flex items-center gap-2 text-red-400"
                      >
                        <FaTrash className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div 
                className="p-6"
                onClick={() => handleViewSummary(item)}
              >
                <div className="flex gap-6">
                  {item.assessments[0]?.show_details?.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w342${item.assessments[0].show_details.poster_path}`}
                      alt={item.showName}
                      className="w-32 h-48 object-cover rounded-lg shadow-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{item.showName}</h3>
                    
                    {item.assessments[0]?.show_details && (
                      <div className="space-y-1 text-sm text-dark-muted mb-4">
                        <p>
                          <span className="font-medium">Release Date:</span>{' '}
                          {item.assessments[0].show_details.release_date || item.assessments[0].show_details.first_air_date || 'N/A'}
                        </p>
                        <p>
                          <span className="font-medium">Rating:</span>{' '}
                          {item.assessments[0].show_details.vote_average ? `${item.assessments[0].show_details.vote_average.toFixed(1)}/10` : 'N/A'}
                        </p>
                        {item.assessments[0].show_details.overview && (
                          <p className="line-clamp-2">
                            <span className="font-medium">Overview:</span>{' '}
                            {item.assessments[0].show_details.overview}
                          </p>
                        )}
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <p className="text-2xl font-bold mb-1">Score: {item.averageScore}</p>
                      <p className={`text-lg ${getCategoryClass(item.averageScore)}`}>
                        {getWokenessCategory(item.averageScore)}
                      </p>
                    </div>
                    
                    <p className="text-dark-muted mb-4">
                      {item.totalAssessments} assessment{item.totalAssessments !== 1 ? 's' : ''}
                    </p>

                    {!item.userAssessment && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/new', { state: { showName: item.showName } });
                        }}
                        className="btn btn-primary w-full"
                      >
                        Assess Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AssessmentSummary
        show={summaryShow}
        onClose={handleCloseSummary}
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
