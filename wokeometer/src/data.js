// Data from the WokeoMeter Excel file

// Answer options
export const ANSWER_OPTIONS = [
  "N/A",
  "Disagree",
  "Agree",
  "Strongly Agree"
];

// Layout configuration for answer options
export const ANSWER_OPTIONS_LAYOUT = {
  horizontal: true, // Set to true to display options horizontally when screen size allows
  mobileBreakpoint: 768, // Screen width in pixels below which options will stack vertically
};

// All questions from the Excel file
export const QUESTIONS = [
  {
    id: 1,
    text: "Background cast or extras: Exaggerated racial diversity in more than one scene",
    answer: "",
    weight: 0.60
  },
  {
    id: 2,
    text: "Racial diversity across cast is incongruous with show setting/locale",
    answer: "",
    weight: 0.70
  },
  {
    id: 3,
    text: "Overt marginalization of white cast",
    answer: "",
    weight: 0.90
  },
  {
    id: 4,
    text: "Religion: Overt anti-Christian rhetoric",
    answer: "",
    weight: 0.60
  },
  {
    id: 5,
    text: "Religion: Overt anti-semitic rhetoric",
    answer: "",
    weight: 0.60
  },
  {
    id: 6,
    text: "Religion: Sigificant depiction of non-Christian religion",
    answer: "",
    weight: 0.30
  },
  {
    id: 7,
    text: "Anti-nationalistic or anti-US rhetoric or theme",
    answer: "",
    weight: 0.40
  },
  {
    id: 8,
    text: "Gay man in significant role",
    answer: "",
    weight: 0.90
  },
  {
    id: 9,
    text: "Lesbian woman in significant role",
    answer: "",
    weight: 1.00
  },
  {
    id: 10,
    text: "Trans man in significant role",
    answer: "",
    weight: 1.00
  },
  {
    id: 11,
    text: "Trans woman in significant role",
    answer: "",
    weight: 1.00
  },
  {
    id: 12,
    text: "Individual of indeterminate gender in significant or background role",
    answer: "",
    weight: 0.70
  },
  {
    id: 13,
    text: "Gay couple in significant roles",
    answer: "",
    weight: 1.00
  },
  {
    id: 14,
    text: "Lesbian couple in significant roles",
    answer: "",
    weight: 1.00
  },
  {
    id: 15,
    text: "Trans couple in significant or background role",
    answer: "",
    weight: 1.00
  },
  {
    id: 16,
    text: "Other (furry, etc.) in significant or background role",
    answer: "",
    weight: 0.80
  },
  {
    id: 17,
    text: "Mixed race couple in significant or background roles",
    answer: "",
    weight: 0.60
  },
  {
    id: 18,
    text: "Mixed race gay/lesbian couple in significant roles",
    answer: "",
    weight: 1.00
  },
  {
    id: 19,
    text: "Black lead actor/actress in significant role",
    answer: "",
    weight: 0.50
  },
  {
    id: 20,
    text: "Asian lead actor/actress in significant role",
    answer: "",
    weight: 0.50
  },
  {
    id: 21,
    text: "Other non-white lead actor/actress in significant role",
    answer: "",
    weight: 0.50
  },
  {
    id: 22,
    text: "Lead actor/actress in role almost always associated with the opposite gender (i.e, a woman commando single-handedly fighting a platoon of men in an action movie)",
    answer: "",
    weight: 0.90
  },
  {
    id: 23,
    text: "Left-leaning geopolitical rhetoric (pro-Hamas, pro-terrorism, etc.)",
    answer: "",
    weight: 1.00
  },
  {
    id: 24,
    text: "Contains significantly altared characters (race or gender) from original classic storyline (e.g., a black Snow White, an Indian Ariel, etc.)",
    answer: "",
    weight: 1.00
  }
];

// Score calculation function
export const calculateScore = (answers) => {
  let totalScore = 0;
  
  for (const question of answers) {
    const basePoints = question.answer === "Agree" ? 5 : question.answer === "Strongly Agree" ? 10 : 0;
    totalScore += basePoints * question.weight;
  }
  
  return Math.round(totalScore); // Round to nearest integer for cleaner display
};

// Get wokeness category based on score
export const getWokenessCategory = (score) => {
  if (score === 0) {
    return "Based";
  } else if (score >= 0 && score <= 30) {
    return "Limited Wokeness";
  } else if (score > 30 && score <= 60) {
    return "Woke";
  } else if (score > 60 && score <= 120) {
    return "Very Woke";
  } else if (score > 120) {
    return "Egregiously Woke";
  }
  
  return "";
};

// Save assessment to localStorage
export const saveAssessment = (showName, questions, score, category, showDetails = null) => {
  const savedAssessments = JSON.parse(localStorage.getItem('wokeometerAssessments') || '[]');
  
  const assessment = {
    id: Date.now(),
    showName,
    date: new Date().toISOString(),
    questions: [...questions],
    score,
    category,
    showDetails
  };
  
  savedAssessments.push(assessment);
  localStorage.setItem('wokeometerAssessments', JSON.stringify(savedAssessments));
  
  return assessment;
};

// Load all assessments from localStorage
export const loadAssessments = () => {
  return JSON.parse(localStorage.getItem('wokeometerAssessments') || '[]');
};

// Get assessment by ID
export const getAssessment = (id) => {
  const assessments = loadAssessments();
  return assessments.find(a => a.id === id) || null;
};

// Delete assessment by ID
export const deleteAssessment = (id) => {
  const savedAssessments = JSON.parse(localStorage.getItem('wokeometerAssessments') || '[]');
  const updatedAssessments = savedAssessments.filter(a => a.id !== id);
  localStorage.setItem('wokeometerAssessments', JSON.stringify(updatedAssessments));
};

// Update an existing assessment
export const updateAssessment = (id, showName, questions, score, category, showDetails = null) => {
  const savedAssessments = JSON.parse(localStorage.getItem('wokeometerAssessments') || '[]');
  const assessmentIndex = savedAssessments.findIndex(a => a.id === id);
  
  if (assessmentIndex === -1) {
    return null;
  }
  
  const updatedAssessment = {
    ...savedAssessments[assessmentIndex],
    showName,
    questions: [...questions],
    score,
    category,
    date: new Date().toISOString(),
    showDetails
  };
  
  savedAssessments[assessmentIndex] = updatedAssessment;
  localStorage.setItem('wokeometerAssessments', JSON.stringify(savedAssessments));
  
  return updatedAssessment;
};

// Export assessments to a JSON file
export const exportAssessments = () => {
  const assessments = loadAssessments();
  const dataStr = JSON.stringify(assessments, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = 'assessments.json';
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

// Import assessments from a JSON file
export const importAssessments = (jsonData) => {
  try {
    const assessments = JSON.parse(jsonData);
    if (!Array.isArray(assessments)) {
      throw new Error('Invalid format: expected an array of assessments');
    }
    
    // Validate each assessment has required fields
    assessments.forEach(assessment => {
      if (!assessment.id || !assessment.showName || !assessment.questions || !assessment.score || !assessment.category) {
        throw new Error('Invalid assessment format: missing required fields');
      }
    });
    
    // Save to localStorage
    localStorage.setItem('wokeometerAssessments', JSON.stringify(assessments));
    return true;
  } catch (error) {
    console.error('Error importing assessments:', error);
    throw error;
  }
};
