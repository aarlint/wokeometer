import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { loadAssessmentsForShow } from '../lib/supabase-db';
import { QUESTIONS } from '../data';
import { 
  FaSearch,
  FaSortUp, 
  FaSortDown, 
  FaEye,
  FaInfoCircle
} from 'react-icons/fa';

const SearchAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('showName');
  const [sortAscending, setSortAscending] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWokenessInfo, setShowWokenessInfo] = useState(false);
  const navigate = useNavigate();
  
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
            wokenessLevel: getWokenessLevel(averageScore)
          };
        })
      );
      
      setAssessments(catalog);
    } catch (err) {
      setError('Failed to load assessments. Please try again.');
      console.error('Error loading catalog:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
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
    .filter(item =>
      item.showName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mainCast.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.overview.toLowerCase().includes(searchQuery.toLowerCase())
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
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        {/* Sort Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => toggleSort('showName')}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Title
            {sortBy === 'showName' && (sortAscending ? <FaSortUp /> : <FaSortDown />)}
          </button>
          <button
            onClick={() => toggleSort('releaseDate')}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Release Date
            {sortBy === 'releaseDate' && (sortAscending ? <FaSortUp /> : <FaSortDown />)}
          </button>
          <button
            onClick={() => toggleSort('score')}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Wokeness Level
            {sortBy === 'score' && (sortAscending ? <FaSortUp /> : <FaSortDown />)}
          </button>
          <button
            onClick={() => toggleSort('assessments')}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            # Assessments
            {sortBy === 'assessments' && (sortAscending ? <FaSortUp /> : <FaSortDown />)}
          </button>
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
        
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
            <span className="text-blue-600 font-medium">Based Content</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-green-500 rounded-full"></span>
            <span className="text-green-600 font-medium">Limited Wokeness</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-yellow-500 rounded-full"></span>
            <span className="text-yellow-600 font-medium">Woke</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-orange-500 rounded-full"></span>
            <span className="text-orange-600 font-medium">Very Woke</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-red-500 rounded-full"></span>
            <span className="text-red-600 font-medium">Egregiously Woke</span>
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
      <div className="space-y-6">
        {filteredAssessments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {searchQuery ? 'No assessments found matching your search.' : 'No assessments available yet.'}
            </p>
          </div>
        ) : (
          filteredAssessments.map((item) => (
            <div key={item.showName} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Thumbnail */}
                {item.thumbnail && (
                  <div className="flex-shrink-0">
                    <img
                      src={item.thumbnail}
                      alt={item.showName}
                      className="w-32 h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {item.showName}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-1">
                        <strong>Release:</strong> {new Date(item.releaseDate).getFullYear()}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mb-1">
                        <strong>Cast:</strong> {item.mainCast}
                      </p>
                      {item.rating && (
                        <p className="text-gray-600 dark:text-gray-400 mb-1">
                          <strong>Rating:</strong> {item.rating} 
                          {item.ratingSource && ` (${item.ratingSource})`}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${item.wokenessLevel.bgColor} ${item.wokenessLevel.color}`}>
                        {item.wokenessLevel.level}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        {item.totalAssessments} assessment{item.totalAssessments !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                    {item.overview}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => navigate(`/view/${item.assessments[0]?.id}`)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                    >
                      <FaEye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchAssessments; 