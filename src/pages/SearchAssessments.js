import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { loadAssessmentsForShow, deleteAssessment, useCurrentUserId, useCurrentUser } from '../lib/supabase-db';
import { QUESTIONS } from '../data';
import { 
  FaSearch,
  FaSortUp, 
  FaSortDown, 
  FaEye,
  FaInfoCircle,
  FaFilm,
  FaTv,
  FaCheckCircle,
  FaEdit,
  FaTrash,
  FaPlus,
  FaExclamationTriangle,
  FaTable,
  FaTh
} from 'react-icons/fa';

const SearchAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('showName');
  const [sortAscending, setSortAscending] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWokenessInfo, setShowWokenessInfo] = useState(false);
  const [showMyAssessmentsOnly, setShowMyAssessmentsOnly] = useState(false);
  const [viewMode, setViewMode] = useState('cards'); // 'table' or 'cards'
  const [deleteLoading, setDeleteLoading] = useState(null); // Track which assessment is being deleted
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(null); // { assessmentId, showName } or null
  const navigate = useNavigate();
  const userId = useCurrentUserId();
  const userInfo = useCurrentUser();
  
  const loadCatalog = useCallback(async () => {
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
          
          // Get show details from first assessment
          const firstAssessment = mergedAssessments[0];
          
          // Check if current user has an assessment for this show
          const userAssessment = mergedAssessments.find(assessment => assessment.user_id === userId);
          
          // Debug logging
          if (showName === mergedAssessments[0]?.show_name) {
            console.log(`Debug for "${showName}":`, {
              currentUserId: userId,
              userAssessmentFound: !!userAssessment,
              allUserIds: mergedAssessments.map(a => a.user_id),
              userAssessmentId: userAssessment?.id
            });
          }
          
          return {
            showName,
            releaseDate: firstAssessment?.release_date || 'Unknown',
            mainCast: firstAssessment?.main_cast || 'Unknown',
            overview: firstAssessment?.overview || 'No description available.',
            thumbnail: firstAssessment?.thumbnail || null,
            rating: firstAssessment?.rating || null,
            ratingSource: firstAssessment?.rating_source || null,
            assessments: mergedAssessments,
            averageScore,
            totalAssessments: mergedAssessments.length,
            wokenessLevel: getWokenessLevel(averageScore),
            userAssessment: userAssessment || null
          };
        })
      );
      
      setAssessments(catalog);
      
      // Debug: Log total assessments and user assessments count
      const userAssessmentCount = catalog.filter(item => item.userAssessment).length;
      console.log('Assessment loading complete:', {
        totalShows: catalog.length,
        currentUserId: userId,
        userAssessmentCount: userAssessmentCount,
        showsWithUserAssessments: catalog.filter(item => item.userAssessment).map(item => item.showName)
      });
    } catch (err) {
      setError('Failed to load assessments. Please try again.');
      console.error('Error loading catalog:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);
  
  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);
  
  const getWokenessLevel = (score) => {
    if (score === 0) return { level: 'Based Content', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score > 0 && score <= 20) return { level: 'Limited Wokeness', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score > 20 && score <= 40) return { level: 'Woke', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    if (score > 40 && score <= 60) return { level: 'Very Woke', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    if (score > 60) return { level: 'Egregiously Woke', color: 'text-red-600', bgColor: 'bg-red-100' };
    return { level: 'Unrated', color: 'text-gray-600', bgColor: 'bg-gray-100' };
  };
  
  const filteredAssessments = assessments
    .filter(item => {
      // Text search filter
      const matchesSearch = item.showName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mainCast.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.overview.toLowerCase().includes(searchQuery.toLowerCase());
      
      // My assessments filter
      const matchesMyFilter = !showMyAssessmentsOnly || (userId && item.userAssessment);
      
      // Debug logging for filtering
      if (showMyAssessmentsOnly && item.userAssessment) {
        console.log(`Found user assessment for "${item.showName}":`, {
          userAssessment: item.userAssessment,
          userId: userId,
          matchesMyFilter: matchesMyFilter
        });
      }
      
      return matchesSearch && matchesMyFilter;
    })
    .sort((a, b) => {
      const multiplier = sortAscending ? 1 : -1;
      switch (sortBy) {
        case 'showName':
          return multiplier * a.showName.localeCompare(b.showName);
        case 'score':
          return multiplier * (b.averageScore - a.averageScore);
        case 'assessments':
          return multiplier * (b.totalAssessments - a.totalAssessments);
        case 'releaseDate':
          return multiplier * new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
        default:
          return 0;
      }
    });
  
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortAscending(!sortAscending);
    } else {
      setSortBy(field);
      setSortAscending(true);
    }
  };

  const handleDeleteAssessment = (assessmentId, showName) => {
    setDeleteConfirmModal({ assessmentId, showName });
  };

  const confirmDeleteAssessment = async () => {
    if (!deleteConfirmModal) return;

    const { assessmentId } = deleteConfirmModal;

    try {
      setDeleteLoading(assessmentId);
      setError(null);
      setDeleteConfirmModal(null); // Close modal
      await deleteAssessment(userId, assessmentId, userInfo);
      
      // Reload the catalog to refresh the list
      await loadCatalog();
    } catch (err) {
      setError('Failed to delete assessment. Please try again.');
      console.error('Error deleting assessment:', err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const cancelDeleteAssessment = () => {
    setDeleteConfirmModal(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Search Assessments
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Explore community assessments of TV shows and movies to find content that aligns with your values.
        </p>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by title, cast, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-base"
          />
        </div>
        
        {/* Sort Controls and Filters */}
        <div className="space-y-4 mb-6">
          {/* Sort Controls */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort by:</h3>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-4">
              <button
                onClick={() => toggleSort('showName')}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white text-sm sm:text-base"
              >
                Title
                {sortBy === 'showName' && (sortAscending ? <FaSortUp /> : <FaSortDown />)}
              </button>
              <button
                onClick={() => toggleSort('releaseDate')}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white text-sm sm:text-base"
              >
                Release Date
                {sortBy === 'releaseDate' && (sortAscending ? <FaSortUp /> : <FaSortDown />)}
              </button>
              <button
                onClick={() => toggleSort('score')}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white text-sm sm:text-base"
              >
                Wokeness Level
                {sortBy === 'score' && (sortAscending ? <FaSortUp /> : <FaSortDown />)}
              </button>
              <button
                onClick={() => toggleSort('assessments')}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white text-sm sm:text-base"
              >
                # Assessments
                {sortBy === 'assessments' && (sortAscending ? <FaSortUp /> : <FaSortDown />)}
              </button>
            </div>
          </div>

          {/* Filter Controls - Only show when user is logged in */}
          {userId && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter:</h3>
              <button
                onClick={() => setShowMyAssessmentsOnly(!showMyAssessmentsOnly)}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 border rounded-lg transition-colors text-sm sm:text-base ${
                  showMyAssessmentsOnly
                    ? 'bg-primary text-white border-primary hover:bg-primary-hover'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                My Assessments
                {showMyAssessmentsOnly && <FaCheckCircle className="w-4 h-4" />}
              </button>
            </div>
          )}

          {/* View Mode Toggle */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">View:</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 border rounded-lg transition-colors text-sm sm:text-base ${
                  viewMode === 'table'
                    ? 'bg-primary text-white border-primary hover:bg-primary-hover'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <FaTable className="w-4 h-4" />
                Table
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 border rounded-lg transition-colors text-sm sm:text-base ${
                  viewMode === 'cards'
                    ? 'bg-primary text-white border-primary hover:bg-primary-hover'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <FaTh className="w-4 h-4" />
                Cards
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wokeness Level Legend */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Wokeness Levels</h3>
          <button
            onClick={() => setShowWokenessInfo(!showWokenessInfo)}
            className="text-primary hover:text-primary-hover"
          >
            <FaInfoCircle className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-blue-500 rounded-full flex-shrink-0"></span>
            <span className="text-blue-600 font-medium text-sm sm:text-base">Based Content</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></span>
            <span className="text-green-600 font-medium text-sm sm:text-base">Limited Wokeness</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-yellow-500 rounded-full flex-shrink-0"></span>
            <span className="text-yellow-600 font-medium text-sm sm:text-base">Woke</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-orange-500 rounded-full flex-shrink-0"></span>
            <span className="text-orange-600 font-medium text-sm sm:text-base">Very Woke</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></span>
            <span className="text-red-600 font-medium text-sm sm:text-base">Egregiously Woke</span>
          </div>
        </div>
        
        {showWokenessInfo && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Our wokeness levels are calculated based on community assessments across multiple categories. 
              Scores range from 0 (no woke content detected) to 100+ (heavily ideological content). 
              These ratings help viewers make informed decisions about content that aligns with their values.
            </p>
          </div>
        )}
      </div>
      
      {/* Results */}
      {filteredAssessments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {searchQuery ? 'No assessments found matching your search.' : 'No assessments available yet.'}
          </p>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Show
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Release Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Wokeness Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Assessments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Woke Elements
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                {filteredAssessments.map((item) => (
                  <tr key={item.showName} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.assessments[0]?.show_details?.poster_path && (
                          <div className="flex-shrink-0 h-16 w-12 mr-4">
                            <img
                              className="h-16 w-12 object-cover rounded"
                              src={`https://image.tmdb.org/t/p/w92${item.assessments[0].show_details.poster_path}`}
                              alt={item.showName}
                            />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {item.showName}
                            </div>
                            {item.assessments[0]?.show_details?.media_type && (
                              <div className="flex items-center">
                                {item.assessments[0].show_details.media_type === 'movie' ? (
                                  <FaFilm className="text-sm text-gray-400" title="Movie" />
                                ) : (
                                  <FaTv className="text-sm text-gray-400" title="TV Show" />
                                )}
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {item.assessments[0]?.show_details?.vote_average 
                              ? `${item.assessments[0].show_details.vote_average.toFixed(1)}/10 TMDB` 
                              : 'No rating'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {item.assessments[0]?.show_details?.release_date 
                        ? new Date(item.assessments[0].show_details.release_date).getFullYear()
                        : item.assessments[0]?.show_details?.first_air_date 
                        ? new Date(item.assessments[0].show_details.first_air_date).getFullYear()
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.wokenessLevel.bgColor} ${item.wokenessLevel.color}`}>
                        {item.wokenessLevel.level}
                      </span>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Score: {item.averageScore}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {item.totalAssessments}
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-40">
                        {(() => {
                          const stronglyWoke = item.assessments[0]?.questions?.filter(q => q.answer === "Strongly Agree" || q.answer === "Yes") || [];
                          const moderateWoke = item.assessments[0]?.questions?.filter(q => q.answer === "Agree") || [];
                          const hasWokeElements = stronglyWoke.length > 0 || moderateWoke.length > 0;

                          if (!hasWokeElements) {
                            return (
                              <div className="flex items-center gap-1">
                                <FaCheckCircle className="text-green-500 text-xs" />
                                <span className="text-xs text-green-600 dark:text-green-400">Clean</span>
                              </div>
                            );
                          }

                          return (
                            <div className="space-y-1">
                              {stronglyWoke.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                  <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                                    {stronglyWoke.length} Strong
                                  </span>
                                </div>
                              )}
                              {moderateWoke.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                  <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                                    {moderateWoke.length} Moderate
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {/* View Details Button */}
                        <button
                          onClick={() => navigate(`/view/${item.assessments[0]?.id}`)}
                          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                          title="View Details"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        
                        {/* User-specific actions */}
                        {userId ? (
                          item.userAssessment ? (
                            <>
                              <button
                                onClick={() => navigate(`/edit/${item.userAssessment.id}`)}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                title="Edit Assessment"
                              >
                                <FaEdit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAssessment(item.userAssessment.id, item.showName)}
                                disabled={deleteLoading === item.userAssessment.id}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:text-red-400"
                                title="Delete Assessment"
                              >
                                <FaTrash className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => navigate('/new', { 
                                state: { 
                                  showName: item.showName,
                                  showDetails: item.assessments[0]?.show_details || null
                                } 
                              })}
                              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                              title="Assess This Show"
                            >
                              <FaPlus className="w-4 h-4" />
                            </button>
                          )
                        ) : (
                          <button
                            onClick={() => navigate('/login', { state: { redirectTo: '/search' } })}
                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                            title="Login to Assess"
                          >
                            <FaPlus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card View */
        <div className="space-y-6">
          {filteredAssessments.map((item) => (
            <div key={item.showName} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
              <div className="flex flex-col gap-4 sm:gap-6">
                {/* First Row: Poster and Details */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {/* Poster */}
                  {item.assessments[0]?.show_details?.poster_path && (
                    <div className="flex-shrink-0 self-center sm:self-start">
                      <img
                        src={`https://image.tmdb.org/t/p/w342${item.assessments[0].show_details.poster_path}`}
                        alt={item.showName}
                        className="w-24 h-36 sm:w-32 sm:h-48 object-cover rounded-lg shadow-lg"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {item.showName}
                          </h3>
                          {/* Movie/TV Show Icon */}
                          {item.assessments[0]?.show_details?.media_type && (
                            <div className="flex items-center">
                              {item.assessments[0].show_details.media_type === 'movie' ? (
                                <FaFilm className="text-lg text-gray-600 dark:text-gray-400" title="Movie" />
                              ) : (
                                <FaTv className="text-lg text-gray-600 dark:text-gray-400" title="TV Show" />
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Show Details */}
                        {item.assessments[0]?.show_details && (
                          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
                            <p>
                              <span className="font-medium">Release Date:</span>{' '}
                              {item.assessments[0].show_details.release_date 
                                ? new Date(item.assessments[0].show_details.release_date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })
                                : item.assessments[0].show_details.first_air_date 
                                ? new Date(item.assessments[0].show_details.first_air_date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })
                                : 'N/A'}
                            </p>
                            <p>
                              <span className="font-medium">Rating:</span>{' '}
                              {item.assessments[0].show_details.vote_average 
                                ? `${item.assessments[0].show_details.vote_average.toFixed(1)}/10 (TMDB)` 
                                : 'N/A'}
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
                      
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${item.wokenessLevel.bgColor} ${item.wokenessLevel.color}`}>
                          {item.wokenessLevel.level}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                          {item.totalAssessments} assessment{item.totalAssessments !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second Row: Woke Elements */}
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Woke Elements:</h4>
                  {(() => {
                    const stronglyWoke = item.assessments[0]?.questions?.filter(q => q.answer === "Strongly Agree" || q.answer === "Yes") || [];
                    const moderateWoke = item.assessments[0]?.questions?.filter(q => q.answer === "Agree") || [];
                    const hasWokeElements = stronglyWoke.length > 0 || moderateWoke.length > 0;

                    if (!hasWokeElements) {
                      return (
                        <div className="flex items-center justify-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <FaCheckCircle className="text-xl text-green-500" />
                          <span className="text-green-700 dark:text-green-400 font-medium">No woke elements detected!</span>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-3">
                        {/* Strongly Woke Elements */}
                        {stronglyWoke.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="font-medium text-red-700 dark:text-red-400 text-sm">
                              Strongly Woke ({stronglyWoke.length})
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {stronglyWoke.slice(0, 3).map((question) => {
                                const fullQuestion = QUESTIONS.find(fq => fq.id === question.id);
                                return fullQuestion ? (
                                  <div key={question.id} className="px-2 py-1 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                                    <span className="text-xs font-medium text-red-800 dark:text-red-200">{fullQuestion.text}</span>
                                  </div>
                                ) : null;
                              })}
                              {stronglyWoke.length > 3 && (
                                <div className="px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded border border-red-200 dark:border-red-800">
                                  <span className="text-xs text-red-600 dark:text-red-400">+{stronglyWoke.length - 3} more</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Moderate Woke Elements */}
                        {moderateWoke.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="font-medium text-yellow-700 dark:text-yellow-400 text-sm">
                              Moderate Woke ({moderateWoke.length})
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {moderateWoke.slice(0, 3).map((question) => {
                                const fullQuestion = QUESTIONS.find(fq => fq.id === question.id);
                                return fullQuestion ? (
                                  <div key={question.id} className="px-2 py-1 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                                    <span className="text-xs font-medium text-yellow-800 dark:text-yellow-200">{fullQuestion.text}</span>
                                  </div>
                                ) : null;
                              })}
                              {moderateWoke.length > 3 && (
                                <div className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded border border-yellow-200 dark:border-yellow-800">
                                  <span className="text-xs text-yellow-600 dark:text-yellow-400">+{moderateWoke.length - 3} more</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* View Details Button - Always Present */}
                    <button
                      onClick={() => navigate(`/view/${item.assessments[0]?.id}`)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium text-sm min-h-[44px]"
                    >
                      <FaEye className="w-4 h-4" />
                      View Details
                    </button>
                    
                    {/* User-specific action buttons */}
                    {userId ? (
                      item.userAssessment ? (
                        <>
                          {/* Edit Button */}
                          <button
                            onClick={() => navigate(`/edit/${item.userAssessment.id}`)}
                            className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm min-h-[44px]"
                          >
                            <FaEdit className="w-4 h-4" />
                            Edit Assessment
                          </button>
                          
                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteAssessment(item.userAssessment.id, item.showName)}
                            disabled={deleteLoading === item.userAssessment.id}
                            className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium text-sm min-h-[44px]"
                          >
                            <FaTrash className="w-4 h-4" />
                            {deleteLoading === item.userAssessment.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </>
                      ) : (
                        // New Assessment Button
                        <button
                          onClick={() => navigate('/new', { 
                            state: { 
                              showName: item.showName,
                              showDetails: item.assessments[0]?.show_details || null
                            } 
                          })}
                          className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors font-medium text-sm min-h-[44px] sm:col-span-2"
                        >
                          <FaPlus className="w-4 h-4" />
                          Assess This Show
                        </button>
                      )
                    ) : (
                      // Login Button
                      <button
                        onClick={() => navigate('/login', { state: { redirectTo: '/search' } })}
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors font-medium text-sm min-h-[44px] sm:col-span-2"
                      >
                        <FaPlus className="w-4 h-4" />
                        Login to Assess
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 w-full h-full overflow-hidden" onClick={cancelDeleteAssessment}>
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
                <span className="font-semibold">"{deleteConfirmModal.showName}"</span>?
              </p>
              
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={cancelDeleteAssessment}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAssessment}
                  disabled={deleteLoading === deleteConfirmModal.assessmentId}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors font-medium"
                >
                  <FaTrash className="w-4 h-4" />
                  {deleteLoading === deleteConfirmModal.assessmentId ? 'Deleting...' : 'Delete Assessment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAssessments; 