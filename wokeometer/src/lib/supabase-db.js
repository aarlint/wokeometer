import { supabase } from './supabase';

// Save assessment to Supabase
export const saveAssessment = async (showName, questions, score, category, showDetails = null) => {
  const assessment = {
    show_name: showName,
    date: new Date().toISOString(),
    questions: questions,
    score: score,
    category: category,
    show_details: showDetails
  };
  
  const { data, error } = await supabase
    .from('assessments')
    .insert([assessment])
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

// Load all assessments from Supabase
export const loadAssessments = async () => {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .order('date', { ascending: false });
    
  if (error) throw error;
  return data;
};

// Get assessment by ID
export const getAssessment = async (id) => {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) throw error;
  return data;
};

// Delete assessment by ID
export const deleteAssessment = async (id) => {
  const { error } = await supabase
    .from('assessments')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};

// Update an existing assessment
export const updateAssessment = async (id, showName, questions, score, category, showDetails = null) => {
  const assessment = {
    show_name: showName,
    questions: questions,
    score: score,
    category: category,
    date: new Date().toISOString(),
    show_details: showDetails
  };
  
  const { data, error } = await supabase
    .from('assessments')
    .update(assessment)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}; 