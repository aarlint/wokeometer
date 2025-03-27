// Data from the WokeoMeter Excel file

// Categories for questions
export const CATEGORIES = [
  "Race & Diversity",
  "Religion & Politics",
  "Gender & Sexuality",
  "Social Commentary",
  "Character Representation"
];

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
    weight: 0.60,
    category: "Race & Diversity"
  },
  {
    id: 2,
    text: "Racial diversity across cast is incongruous with show setting/locale",
    answer: "",
    weight: 0.70,
    category: "Race & Diversity"
  },
  {
    id: 3,
    text: "Overt marginalization of white cast",
    answer: "",
    weight: 0.90,
    category: "Race & Diversity"
  },
  {
    id: 4,
    text: "Religion: Overt anti-Christian rhetoric",
    answer: "",
    weight: 0.60,
    category: "Religion & Politics"
  },
  {
    id: 5,
    text: "Religion: Overt anti-semitic rhetoric",
    answer: "",
    weight: 0.60,
    category: "Religion & Politics"
  },
  {
    id: 6,
    text: "Religion: Sigificant depiction of non-Christian religion",
    answer: "",
    weight: 0.30,
    category: "Religion & Politics"
  },
  {
    id: 7,
    text: "Anti-nationalistic or anti-US rhetoric or theme",
    answer: "",
    weight: 0.40,
    category: "Religion & Politics"
  },
  {
    id: 8,
    text: "Gay man in significant role",
    answer: "",
    weight: 0.90,
    category: "Gender & Sexuality"
  },
  {
    id: 9,
    text: "Lesbian woman in significant role",
    answer: "",
    weight: 1.00,
    category: "Gender & Sexuality"
  },
  {
    id: 10,
    text: "Trans man in significant role",
    answer: "",
    weight: 1.00,
    category: "Gender & Sexuality"
  },
  {
    id: 11,
    text: "Trans woman in significant role",
    answer: "",
    weight: 1.00,
    category: "Gender & Sexuality"
  },
  {
    id: 12,
    text: "Individual of indeterminate gender in significant or background role",
    answer: "",
    weight: 0.70,
    category: "Gender & Sexuality"
  },
  {
    id: 13,
    text: "Gay couple in significant roles",
    answer: "",
    weight: 1.00,
    category: "Gender & Sexuality"
  },
  {
    id: 14,
    text: "Lesbian couple in significant roles",
    answer: "",
    weight: 1.00,
    category: "Gender & Sexuality"
  },
  {
    id: 15,
    text: "Trans couple in significant or background role",
    answer: "",
    weight: 1.00,
    category: "Gender & Sexuality"
  },
  {
    id: 16,
    text: "Other (furry, etc.) in significant or background role",
    answer: "",
    weight: 0.80,
    category: "Gender & Sexuality"
  },
  {
    id: 17,
    text: "Mixed race couple in significant or background roles",
    answer: "",
    weight: 0.60,
    category: "Race & Diversity"
  },
  {
    id: 18,
    text: "Mixed race gay/lesbian couple in significant roles",
    answer: "",
    weight: 1.00,
    category: "Race & Diversity"
  },
  {
    id: 19,
    text: "Black lead actor/actress in significant role",
    answer: "",
    weight: 0.50,
    category: "Race & Diversity"
  },
  {
    id: 20,
    text: "Asian lead actor/actress in significant role",
    answer: "",
    weight: 0.50,
    category: "Race & Diversity"
  },
  {
    id: 21,
    text: "Other non-white lead actor/actress in significant role",
    answer: "",
    weight: 0.50,
    category: "Race & Diversity"
  },
  {
    id: 22,
    text: "Lead actor/actress in role almost always associated with the opposite gender (i.e, a woman commando single-handedly fighting a platoon of men in an action movie)",
    answer: "",
    weight: 0.90,
    category: "Character Representation"
  },
  {
    id: 23,
    text: "Left-leaning geopolitical rhetoric (pro-Hamas, pro-terrorism, etc.)",
    answer: "",
    weight: 1.00,
    category: "Religion & Politics"
  },
  {
    id: 24,
    text: "Contains significantly altared characters (race or gender) from original classic storyline (e.g., a black Snow White, an Indian Ariel, etc.)",
    answer: "",
    weight: 1.00,
    category: "Character Representation"
  },
  {
    id: 25,
    text: "Overt pro-environmentalist or climate change agenda woven into the plot",
    answer: "",
    weight: 0.70,
    category: "Social Commentary"
  },
  {
    id: 26,
    text: "Capitalism or corporations portrayed as inherently evil or exploitative",
    answer: "",
    weight: 0.60,
    category: "Social Commentary"
  },
  {
    id: 27,
    text: "Female character outperforms male counterparts in traditionally male-dominated fields with little explanation (e.g., engineering, combat)",
    answer: "",
    weight: 0.80,
    category: "Character Representation"
  },
  {
    id: 28,
    text: "Historical events or figures reinterpreted to emphasize systemic oppression (e.g., slavery, colonialism)",
    answer: "",
    weight: 0.90,
    category: "Social Commentary"
  },
  {
    id: 29,
    text: "Straight white male character portrayed as incompetent, villainous, or morally inferior",
    answer: "",
    weight: 0.70,
    category: "Character Representation"
  },
  {
    id: 30,
    text: "Dialogue includes buzzwords like 'patriarchy,' 'privilege,' or 'systemic racism' outside of natural context",
    answer: "",
    weight: 0.80,
    category: "Social Commentary"
  },
  {
    id: 31,
    text: "Traditional gender roles or family structures mocked or depicted as outdated",
    answer: "",
    weight: 0.60,
    category: "Social Commentary"
  },
  {
    id: 32,
    text: "Character's race, gender, or sexuality is explicitly highlighted as their defining trait rather than their personality or actions",
    answer: "",
    weight: 0.70,
    category: "Character Representation"
  },
  {
    id: 33,
    text: "Overt pro-socialist or collectivist rhetoric woven into the narrative",
    answer: "",
    weight: 0.80,
    category: "Social Commentary"
  },
  {
    id: 34,
    text: "Children or teens lecture adults on moral or social issues with unrealistic authority",
    answer: "",
    weight: 0.60,
    category: "Social Commentary"
  },
  {
    id: 35,
    text: "Male characters emasculated or feminized to subvert traditional masculinity",
    answer: "",
    weight: 0.70,
    category: "Character Representation"
  },
  {
    id: 36,
    text: "Inclusion of a non-binary character in a significant or background role",
    answer: "",
    weight: 0.90,
    category: "Gender & Sexuality"
  },
  {
    id: 37,
    text: "Animals or nature anthropomorphized to deliver moral lessons about human behavior",
    answer: "",
    weight: 0.50,
    category: "Social Commentary"
  },
  {
    id: 38,
    text: "Plot hinges on a 'diverse' character saving or redeeming a less diverse cast",
    answer: "",
    weight: 0.80,
    category: "Character Representation"
  },
  {
    id: 39,
    text: "Overt celebration of progressive political figures or movements (e.g., nods to BLM, #MeToo)",
    answer: "",
    weight: 1.00,
    category: "Social Commentary"
  }
];

// Score calculation function
export const calculateScore = (answers) => {
  let totalScore = 0;
  let answeredQuestions = 0;
  
  // Filter out unanswered questions
  const validAnswers = answers.filter(q => q.answer && q.answer !== "" && q.answer !== "N/A");
  
  for (const question of validAnswers) {
    const basePoints = question.answer === "Agree" ? 5 : question.answer === "Strongly Agree" ? 10 : 0;
    totalScore += basePoints * question.weight;
    answeredQuestions++;
  }
  
  // If no questions were answered, return 0
  if (answeredQuestions === 0) return 0;
  
  // Calculate average score per answered question
  const averageScore = totalScore / answeredQuestions;
  
  // Scale the score based on the number of answered questions vs total questions
  // This ensures that answering fewer questions doesn't give an artificially low score
  const scaleFactor = answers.length / answeredQuestions;
  
  return Math.round(averageScore * scaleFactor); // Round to nearest integer for cleaner display
};

// Get wokeness category based on score
export const getWokenessCategory = (score) => {
  if (score === 0) {
    return "Based";
  } else if (score >= 0 && score <= 20) {
    return "Limited Wokeness";
  } else if (score > 20 && score <= 40) {
    return "Woke";
  } else if (score > 40 && score <= 60) {
    return "Very Woke";
  } else if (score > 60) {
    return "Egregiously Woke";
  }
  
  return "";
};

// Save assessment to localStorage
export const saveAssessment = (showName, questions, category, showDetails = null) => {
  const savedAssessments = JSON.parse(localStorage.getItem('wokeometerAssessments') || '[]');
  
  // Filter out unanswered questions before saving
  const answeredQuestions = questions.filter(q => q.answer && q.answer !== "" && q.answer !== "N/A");
  
  const assessment = {
    id: Date.now(),
    showName,
    date: new Date().toISOString(),
    questions: answeredQuestions, // Only save answered questions
    category,
    showDetails
  };
  
  savedAssessments.push(assessment);
  localStorage.setItem('wokeometerAssessments', JSON.stringify(savedAssessments));
  
  return assessment;
};

// Load all assessments from localStorage
export const loadAssessments = () => {
  const assessments = JSON.parse(localStorage.getItem('wokeometerAssessments') || '[]');
  // Calculate scores for each assessment when loading
  return assessments.map(assessment => ({
    ...assessment,
    score: calculateScore(assessment.questions)
  }));
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
export const updateAssessment = (id, showName, questions, category, showDetails = null) => {
  const savedAssessments = JSON.parse(localStorage.getItem('wokeometerAssessments') || '[]');
  const assessmentIndex = savedAssessments.findIndex(a => a.id === id);
  
  if (assessmentIndex === -1) {
    return null;
  }
  
  const updatedAssessment = {
    ...savedAssessments[assessmentIndex],
    showName,
    questions: [...questions],
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
      if (!assessment.id || !assessment.showName || !assessment.questions || !assessment.category) {
        throw new Error('Invalid assessment format: missing required fields');
      }
    });
    
    // Save to localStorage without scores
    const assessmentsWithoutScores = assessments.map(({ score, ...assessment }) => assessment);
    localStorage.setItem('wokeometerAssessments', JSON.stringify(assessmentsWithoutScores));
    return true;
  } catch (error) {
    console.error('Error importing assessments:', error);
    throw error;
  }
};
