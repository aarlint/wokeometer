import React, { useState, useEffect, useCallback } from 'react';
import { loadCommentsForShow, addComment, deleteComment, useCurrentUserId } from '../lib/supabase-db';
import { FaTimes, FaTrash } from 'react-icons/fa';

const CommentsPanel = ({ showName, isOpen, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = useCurrentUserId();

  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const showComments = await loadCommentsForShow(showName);
      setComments(showComments);
    } catch (err) {
      setError('Failed to load comments. Please try again.');
      console.error('Error loading comments:', err);
    } finally {
      setLoading(false);
    }
  }, [showName]);

  useEffect(() => {
    if (isOpen && showName) {
      loadComments();
    }
  }, [isOpen, showName, loadComments]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      setError(null);
      const comment = await addComment(userId, showName, newComment.trim());
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (err) {
      setError('Failed to add comment. Please try again.');
      console.error('Error adding comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      setError(null);
      await deleteComment(userId, commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      setError('Failed to delete comment. Please try again.');
      console.error('Error deleting comment:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Comments Panel */}
      <div className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-dark-card shadow-lg transform transition-transform duration-300 ease-in-out z-50">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-dark-border flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-dark-text">Comments for {showName}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-card-hover rounded-lg transition-colors"
            >
              <FaTimes className="w-5 h-5 text-gray-700 dark:text-dark-text" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="text-center py-4">Loading comments...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-4">{error}</div>
            ) : comments.length === 0 ? (
              <div className="text-center py-4 text-gray-600 dark:text-dark-muted">No comments yet</div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-200 dark:border-dark-border pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-dark-text">
                          {comment.user_id === userId ? 'You' : `User ${comment.user_id.slice(0, 8)}...`}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-dark-muted mb-2">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-gray-700 dark:text-dark-text">{comment.comment}</p>
                      </div>
                      {comment.user_id === userId && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-500 hover:text-red-400 p-1"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-dark-border">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="form-textarea w-full mb-2 bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-700 dark:text-dark-text"
              rows="3"
            />
            <button 
              onClick={handleAddComment}
              className="btn btn-primary w-full"
              disabled={!newComment.trim()}
            >
              Add Comment
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentsPanel; 