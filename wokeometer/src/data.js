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
    answer: ""
  },
  {
    id: 2,
    text: "Racial diversity across cast is incongruous with show setting/locale",
    answer: ""
  },
  {
    id: 3,
    text: "Overt marginalization of white cast",
    answer: ""
  },
  {
    id: 4,
    text: "Religion: Overt anti-Christian rhetoric",
    answer: ""
  },
  {
    id: 5,
    text: "Religion: Overt anti-semitic rhetoric",
    answer: ""
  },
  {
    id: 6,
    text: "Religion: Sigificant depiction of non-Christian religion",
    answer: ""
  },
  {
    id: 7,
    text: "Anti-nationalistic or anti-US rhetoric or theme",
    answer: ""
  },
  {
    id: 8,
    text: "Gay man in significant role",
    answer: ""
  },
  {
    id: 9,
    text: "Lesbian woman in significant role",
    answer: ""
  },
  {
    id: 10,
    text: "Trans man in significant role",
    answer: ""
  },
  {
    id: 11,
    text: "Trans woman in significant role",
    answer: ""
  },
  {
    id: 12,
    text: "Individual of indeterminate gender in significant or background role",
    answer: ""
  },
  {
    id: 13,
    text: "Gay couple in significant roles",
    answer: ""
  },
  {
    id: 14,
    text: "Lesbian couple in significant roles",
    answer: ""
  },
  {
    id: 15,
    text: "Trans couple in significant or background role",
    answer: ""
  },
  {
    id: 16,
    text: "Other (furry, etc.) in significant or background role",
    answer: ""
  },
  {
    id: 17,
    text: "Mixed race couple in significant or background roles",
    answer: ""
  },
  {
    id: 18,
    text: "Mixed race gay/lesbian couple in significant roles",
    answer: ""
  },
  {
    id: 19,
    text: "Black lead actor/actress in significant role",
    answer: ""
  },
  {
    id: 20,
    text: "Asian lead actor/actress in significant role",
    answer: ""
  },
  {
    id: 21,
    text: "Other non-white lead actor/actress in significant role",
    answer: ""
  },
  {
    id: 22,
    text: "Lead actor/actress in role almost always associated with the opposite gender (i.e, a woman commando single-handedly fighting a platoon of men in an action movie)",
    answer: ""
  },
  {
    id: 23,
    text: "Left-leaning geopolitical rhetoric (pro-Hamas, pro-terrorism, etc.)",
    answer: ""
  },
  {
    id: 24,
    text: "Contains significantly altared characters (race or gender) from original classic storyline (e.g., a black Snow White, an Indian Ariel, etc.)",
    answer: ""
  }
];

// Score calculation function
export const calculateScore = (answers) => {
  let totalScore = 0;
  
  for (const question of answers) {
    if (question.answer === "Agree") {
      totalScore += 5;
    } else if (question.answer === "Strongly Agree") {
      totalScore += 10;
    }
    // N/A and Disagree are 0 points
  }
  
  return totalScore;
};

// Get wokeness category based on score
export const getWokenessCategory = (score) => {
  if (score === 0) {
    return "";
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
export const saveAssessment = (showName, questions, score, category) => {
  const savedAssessments = JSON.parse(localStorage.getItem('wokeometerAssessments') || '[]');
  
  const assessment = {
    id: Date.now(),
    showName,
    date: new Date().toISOString(),
    questions: [...questions],
    score,
    category
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
