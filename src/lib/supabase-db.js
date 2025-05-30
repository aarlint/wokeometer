import { supabase } from './supabase';
import { useAuth0 } from '@auth0/auth0-react';
import { calculateScore } from '../data';

// Custom hook to get the current user's ID and email (for security)
export const useCurrentUserId = () => {
  const { user, isAuthenticated } = useAuth0();
  
  // Only return user ID if properly authenticated and has required fields
  if (!isAuthenticated || !user?.sub || !user?.email || !user?.email_verified) {
    return null;
  }
  
  return user.sub;
};

// Custom hook to get current user info for security validation
export const useCurrentUser = () => {
  const { user, isAuthenticated } = useAuth0();
  
  if (!isAuthenticated || !user?.sub || !user?.email) {
    return null;
  }
  
  return {
    id: user.sub,
    email: user.email,
    emailVerified: user.email_verified,
    name: user.name,
    picture: user.picture
  };
};

// Validate user identity for security
const validateUserIdentity = (userId, userInfo) => {
  if (!userId || !userInfo) {
    throw new Error('User not authenticated');
  }
  
  if (userId !== userInfo.id) {
    throw new Error('User identity validation failed - ID mismatch');
  }
  
  if (!userInfo.email) {
    throw new Error('User email required for security validation');
  }
  
  if (!userInfo.emailVerified) {
    throw new Error('Email verification required. Please check your email and verify your account before creating or editing assessments.');
  }
  
  // Additional security checks
  if (typeof userId !== 'string' || userId.length < 10) {
    throw new Error('Invalid user identifier format');
  }
  
  return true;
};

// Save a new assessment
export const saveAssessment = async (userId, showName, questions, category, showDetails = null, userInfo = null) => {
  if (!userId) throw new Error('User not authenticated');
  
  // Additional security validation if userInfo is provided
  if (userInfo) {
    validateUserIdentity(userId, userInfo);
  }

  const { data, error } = await supabase
    .from('assessments')
    .insert([
      {
        user_id: userId,
        show_name: showName,
        questions,
        category,
        show_details: showDetails
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Load all assessments for a show
export const loadAssessmentsForShow = async (showName) => {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('show_name', showName);

  if (error) throw error;
  return data;
};

// Load user's assessments
export const loadUserAssessments = async (userId) => {
  if (!userId) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Get a single assessment by ID
export const getAssessment = async (id) => {
  // Validate that id is a valid number
  if (!id || isNaN(id) || id <= 0) {
    throw new Error('Invalid assessment ID');
  }

  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

// Update an assessment
export const updateAssessment = async (userId, id, showName, questions, category, showDetails = null, userInfo = null) => {
  if (!userId) throw new Error('User not authenticated');
  
  // Additional security validation if userInfo is provided
  if (userInfo) {
    validateUserIdentity(userId, userInfo);
  }

  const { data, error } = await supabase
    .from('assessments')
    .update({
      show_name: showName,
      questions,
      category,
      show_details: showDetails
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete an assessment
export const deleteAssessment = async (userId, id, userInfo = null) => {
  if (!userId) throw new Error('User not authenticated');
  
  // Additional security validation if userInfo is provided
  if (userInfo) {
    validateUserIdentity(userId, userInfo);
  }

  const { error } = await supabase
    .from('assessments')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
};

// Add a comment to a show
export const addComment = async (userId, showName, comment) => {
  if (!userId) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        user_id: userId,
        show_name: showName,
        comment
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Load comments for a show
export const loadCommentsForShow = async (showName) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('show_name', showName)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Delete a comment
export const deleteComment = async (userId, id) => {
  if (!userId) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
};

// Calculate average score for a show
export const getAverageScoreForShow = async (showName) => {
  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('questions')
      .eq('show_name', showName);

    if (error) throw error;

    // If no assessments found, return 0
    if (!data || data.length === 0) {
      return 0;
    }

    // Calculate scores from questions and average them
    const scores = data.map(assessment => calculateScore(assessment.questions));
    const validScores = scores.filter(score => score !== null);
    
    if (validScores.length === 0) {
      return 0;
    }

    const sum = validScores.reduce((acc, score) => acc + score, 0);
    return Math.round(sum / validScores.length);
  } catch (error) {
    console.error('Error getting average score:', error);
    return 0;
  }
}; 