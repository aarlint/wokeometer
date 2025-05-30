import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QUESTIONS } from '../data';
import { FaFilm, FaTv, FaYoutube, FaBookOpen, FaEllipsisH, FaTimes } from 'react-icons/fa';
import { TMDB_API_KEY } from '../config/api';
import SecurityWarning from '../components/SecurityWarning';

const NewAssessment = ({ setCurrentAssessment }) => {
  const location = useLocation();
  const [showName, setShowName] = useState(location.state?.showName || '');
  const [showType, setShowType] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedShow, setSelectedShow] = useState(location.state?.showDetails || null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSelectingFromDropdown, setIsSelectingFromDropdown] = useState(false);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const navigate = useNavigate();
  
  const showTypes = [
    { id: 'Movie', icon: FaFilm, label: 'Movie' },
    { id: 'TV Show', icon: FaTv, label: 'TV Show' },
    { id: 'Web Series', icon: FaYoutube, label: 'Web Series' },
    { id: 'Documentary', icon: FaBookOpen, label: 'Documentary' },
    { id: 'Other', icon: FaEllipsisH, label: 'Other' }
  ];

  // If we have show details from state, set the show type
  useEffect(() => {
    if (location.state?.showDetails) {
      const mediaType = location.state.showDetails.media_type;
      if (mediaType === 'movie') {
        setShowType('Movie');
      } else if (mediaType === 'tv') {
        setShowType('TV Show');
      }
    }
  }, [location.state?.showDetails]);

  // Search TMDB for show/movie with additional details
  const searchTMDB = async (query) => {
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&include_adult=false`,
        {
          headers: {
            'Authorization': `Bearer ${TMDB_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        // Filter out adult content and sort by popularity
        const filteredResults = data.results
          .filter(result => !result.adult)
          .sort((a, b) => b.popularity - a.popularity);
        
        // Enhance results with cast information
        const enhancedResults = await Promise.all(
          filteredResults.slice(0, 10).map(async (result) => {
            try {
              const mediaType = result.media_type;
              const creditsResponse = await fetch(
                `https://api.themoviedb.org/3/${mediaType}/${result.id}/credits`,
                {
                  headers: {
                    'Authorization': `Bearer ${TMDB_API_KEY}`,
                    'Content-Type': 'application/json'
                  }
                }
              );
              const creditsData = await creditsResponse.json();
              const mainCast = creditsData.cast
                ?.slice(0, 3)
                .map(actor => actor.name)
                .join(', ') || 'Cast information unavailable';
              
              return {
                ...result,
                mainCast
              };
            } catch (error) {
              console.error('Error fetching cast for:', result.title || result.name, error);
              return {
                ...result,
                mainCast: 'Cast information unavailable'
              };
            }
          })
        );
        
        setSearchResults(enhancedResults);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching TMDB:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle show selection from search results
  const handleShowSelect = (show) => {
    setSelectedShow(show);
    setShowName(show.title || show.name);
    setShowType(show.media_type === 'movie' ? 'Movie' : 'TV Show');
    setSearchResults([]);
    setIsSelectingFromDropdown(false);
  };

  // Debounced search function
  useEffect(() => {
    if (isSelectingFromDropdown) return;
    
    const searchTimeout = setTimeout(() => {
      if (showName.trim() && !selectedShow) {
        searchTMDB(showName.trim());
      } else {
        setSearchResults([]);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(searchTimeout);
  }, [showName, isSelectingFromDropdown, selectedShow]);

  // If we have a show name from state but no show details, search for it
  useEffect(() => {
    if (location.state?.showName && !location.state?.showDetails) {
      searchTMDB(location.state.showName);
    }
  }, [location.state?.showName, location.state?.showDetails]);

  const handleInputChange = (e) => {
    setIsSelectingFromDropdown(false);
    setShowName(e.target.value);
  };

  const handleInputFocus = () => {
    setIsSelectingFromDropdown(false);
  };

  const handleClear = () => {
    setShowName('');
    setSelectedShow(null);
    setShowType('');
    setSearchResults([]);
    setIsSelectingFromDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!showName.trim()) {
      alert('Please enter a show name');
      return;
    }
    
    // Create new assessment object
    const newAssessment = {
      showName,
      showType,
      questions: [...QUESTIONS],
      showDetails: selectedShow || null // Include selected show details
    };
    
    setCurrentAssessment(newAssessment);
    navigate('/assessment');
  };

  const TypeSelector = () => (
    <div className="flex flex-col">
      <label className="text-light-text dark:text-dark-text font-medium mb-2">Type:</label>
      <div className="grid grid-cols-5 gap-4">
        {showTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => setShowType(type.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all ${
                showType === type.id
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'bg-light-card dark:bg-dark-card hover:bg-gray-100 dark:hover:bg-dark-card-hover border border-light-border dark:border-dark-border'
              }`}
            >
              <Icon className="text-2xl mb-2 text-light-text dark:text-dark-text" />
              <span className="text-sm text-light-text dark:text-dark-text">{type.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
  
  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-8 text-light-text dark:text-dark-text">New Assessment</h2>
      
      <SecurityWarning />
      
      <div className="max-w-2xl mx-auto card">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label htmlFor="showName" className="text-light-text dark:text-dark-text font-medium mb-2">Show/Movie Name:</label>
            <div className="relative">
              <input
                type="text"
                id="showName"
                className={`form-input bg-light-card dark:bg-dark-card border-light-border dark:border-dark-border text-light-text dark:text-dark-text w-full ${
                  selectedShow ? 'pr-10' : ''
                }`}
                value={showName}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                required
                placeholder="Enter show or movie name"
                placeholderClassName="text-light-muted dark:text-dark-muted"
                disabled={!!selectedShow}
              />
              {isSearching && !selectedShow && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                </div>
              )}
              {selectedShow && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <FaTimes className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>
            
            {/* Search Results Dropdown */}
            {searchResults.length > 0 && !selectedShow && (
              <div className="mt-2 bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-md shadow-lg max-h-96 overflow-y-auto">
                {searchResults.map((result) => {
                  const year = result.release_date 
                    ? new Date(result.release_date).getFullYear()
                    : result.first_air_date 
                    ? new Date(result.first_air_date).getFullYear()
                    : 'Year N/A';
                  
                  return (
                    <div
                      key={result.id}
                      className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-dark-card-hover cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                      onClick={() => handleShowSelect(result)}
                    >
                      {result.poster_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${result.poster_path}`}
                          alt={result.title || result.name}
                          className="w-12 h-18 object-cover rounded mr-3 flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-light-text dark:text-dark-text">
                          {result.title || result.name}, {year}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {result.mainCast}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Selected Show Details */}
          {selectedShow && (
            <div className="flex gap-4 p-6 bg-light-card dark:bg-dark-card rounded-lg border border-light-border dark:border-dark-border">
              {selectedShow.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w342${selectedShow.poster_path}`}
                  alt={selectedShow.title || selectedShow.name}
                  className="w-32 h-48 object-cover rounded-lg shadow-md flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-light-text dark:text-dark-text mb-3">
                  {selectedShow.title || selectedShow.name}
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Release Date:</span>{' '}
                    {selectedShow.release_date 
                      ? new Date(selectedShow.release_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : selectedShow.first_air_date 
                      ? new Date(selectedShow.first_air_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'N/A'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Rating:</span>{' '}
                    {selectedShow.vote_average 
                      ? `${selectedShow.vote_average.toFixed(1)}/10 (TMDB)` 
                      : 'N/A'}
                  </p>
                  {selectedShow.mainCast && (
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Main Cast:</span>{' '}
                      {selectedShow.mainCast}
                    </p>
                  )}
                  {selectedShow.overview && (
                    <div className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Overview:</span>{' '}
                      <div className={`mt-1 ${!showFullOverview ? 'line-clamp-3' : ''}`}>
                        {selectedShow.overview}
                      </div>
                      {selectedShow.overview.length > 200 && (
                        <button
                          type="button"
                          onClick={() => setShowFullOverview(!showFullOverview)}
                          className="text-primary hover:text-primary-hover text-sm font-medium mt-1 transition-colors"
                        >
                          {showFullOverview ? 'See less' : 'See more'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <TypeSelector />
          
          <button type="submit" className="btn btn-primary self-start">
            Start Assessment
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewAssessment;
