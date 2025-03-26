import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadAssessments, deleteAssessment, exportAssessments, importAssessments } from '../data';
import Modal from '../components/Modal';

const SavedAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    assessmentId: null,
    showName: ''
  });
  const [importError, setImportError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load saved assessments
    const savedAssessments = loadAssessments();
    setAssessments(savedAssessments);
  }, []);
  
  const filteredAssessments = assessments.filter(assessment =>
    assessment.showName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getCategoryClass = (category) => {
    if (category === "Limited Wokeness") return "text-category-limited";
    if (category === "Woke") return "text-category-woke";
    if (category === "Very Woke") return "text-category-very";
    if (category === "Egregiously Woke") return "text-category-egregiously font-bold";
    return "";
  };
  
  const handleViewAssessment = (id) => {
    navigate(`/view/${id}`);
  };

  const handleEditAssessment = (e, id) => {
    e.stopPropagation(); // Prevent triggering the card's onClick
    navigate(`/edit/${id}`);
  };

  const handleDeleteClick = (e, id, showName) => {
    e.stopPropagation(); // Prevent triggering the card's onClick
    setDeleteModal({
      isOpen: true,
      assessmentId: id,
      showName
    });
  };

  const handleDeleteConfirm = () => {
    deleteAssessment(deleteModal.assessmentId);
    setAssessments(loadAssessments()); // Reload assessments after deletion
    setDeleteModal({ isOpen: false, assessmentId: null, showName: '' });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, assessmentId: null, showName: '' });
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  const handleExport = () => {
    exportAssessments();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        importAssessments(e.target.result);
        setAssessments(loadAssessments()); // Reload assessments after import
        setImportError(null);
      } catch (error) {
        setImportError(error.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Saved Assessments</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search assessments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
          />
          <button
            onClick={handleExport}
            className="btn btn-secondary flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export
          </button>
          <label className="btn btn-secondary flex items-center gap-2 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>
      
      {importError && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
          Error importing assessments: {importError}
        </div>
      )}
      
      {filteredAssessments.length === 0 ? (
        <div className="text-center card">
          <p className="text-dark-muted mb-6">No saved assessments found.</p>
          <button 
            onClick={() => navigate('/new')} 
            className="btn btn-primary"
          >
            Create New Assessment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
          {filteredAssessments.map((assessment) => (
            <div 
              key={assessment.id} 
              className="bg-dark-card rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer border border-dark-border hover:border-dark-border-hover"
              onClick={() => handleViewAssessment(assessment.id)}
            >
              <div className="space-y-4">
                {assessment.showDetails?.poster_path && (
                  <div className="flex justify-center mb-4">
                    <img
                      src={`https://image.tmdb.org/t/p/w342${assessment.showDetails.poster_path}`}
                      alt={assessment.showName}
                      className="w-32 h-48 object-cover rounded-lg shadow-md"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold text-white truncate">{assessment.showName}</h3>
                  <span className={`font-medium ${getCategoryClass(assessment.category)} text-lg`}>
                    {assessment.score} ({assessment.category})
                  </span>
                </div>
                {assessment.showDetails && (
                  <div className="text-sm text-dark-muted space-y-1">
                    <p>
                      <span className="font-medium">Release Date:</span>{' '}
                      {assessment.showDetails.release_date || assessment.showDetails.first_air_date || 'N/A'}
                    </p>
                    <p>
                      <span className="font-medium">Rating:</span>{' '}
                      {assessment.showDetails.vote_average ? `${assessment.showDetails.vote_average.toFixed(1)}/10` : 'N/A'}
                    </p>
                  </div>
                )}
                <div className="text-sm text-dark-muted">
                  {formatDate(assessment.date)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => handleEditAssessment(e, assessment.id)}
                    className="flex-1 btn btn-secondary btn-sm flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(e, assessment.id, assessment.showName)}
                    className="flex-1 btn btn-danger btn-sm flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
