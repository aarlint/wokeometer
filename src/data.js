// Data from the WokeoMeter Excel file

// Answer options
export const ANSWER_OPTIONS = [
  "-- SELECT ONE --",
  "N/A",
  "Disagree",
  "Agree",
  "Strongly Agree"
];

// All questions from the Excel file
export const QUESTIONS = [
  {
    id: 1,
    text: "Background cast or extras: Exaggerated racial diversity in more than one scene",
    answer: "-- SELECT ONE --"
  },
  {
    id: 2,
    text: "Racial diversity across cast is incongruous with show setting/locale",
    answer: "-- SELECT ONE --"
  },
  {
    id: 3,
    text: "Overt marginalization of white cast",
    answer: "-- SELECT ONE --"
  },
  {
    id: 4,
    text: "Religion: Overt anti-Christian rhetoric",
    answer: "-- SELECT ONE --"
  },
  {
    id: 5,
    text: "Religion: Overt anti-semitic rhetoric",
    answer: "-- SELECT ONE --"
  },
  {
    id: 6,
    text: "Religion: Sigificant depiction of non-Christian religion",
    answer: "-- SELECT ONE --"
  },
  {
    id: 7,
    text: "Anti-nationalistic or anti-US rhetoric or theme",
    answer: "-- SELECT ONE --"
  },
  {
    id: 8,
    text: "Gay man in significant role",
    answer: "-- SELECT ONE --"
  },
  {
    id: 9,
    text: "Lesbian woman in significant role",
    answer: "-- SELECT ONE --"
  },
  {
    id: 10,
    text: "Trans man in significant role",
    answer: "-- SELECT ONE --"
  },
  {
    id: 11,
    text: "Trans woman in significant role",
    answer: "-- SELECT ONE --"
  },
  {
    id: 12,
    text: "Individual of indeterminate gender in significant or background role",
    answer: "-- SELECT ONE --"
  },
  {
    id: 13,
    text: "Gay couple in significant roles",
    answer: "-- SELECT ONE --"
  },
  {
    id: 14,
    text: "Lesbian couple in significant roles",
    answer: "-- SELECT ONE --"
  },
  {
    id: 15,
    text: "Trans couple in significant or background role",
    answer: "-- SELECT ONE --"
  },
  {
    id: 16,
    text: "Other (furry, etc.) in significant or background role",
    answer: "-- SELECT ONE --"
  },
  {
    id: 17,
    text: "Mixed race couple in significant or background roles",
    answer: "-- SELECT ONE --"
  },
  {
    id: 18,
    text: "Mixed race gay/lesbian couple in significant roles",
    answer: "-- SELECT ONE --"
  },
  {
    id: 19,
    text: "Black lead actor/actress in significant role",
    answer: "-- SELECT ONE --"
  },
  {
    id: 20,
    text: "Asian lead actor/actress in significant role",
    answer: "-- SELECT ONE --"
  },
  {
    id: 21,
    text: "Other non-white lead actor/actress in significant role",
    answer: "-- SELECT ONE --"
  },
  {
    id: 22,
    text: "Lead actor/actress in role almost always associated with the opposite gender (i.e, a woman commando single-handedly fighting a platoon of men in an action movie)",
    answer: "-- SELECT ONE --"
  },
  {
    id: 23,
    text: "Left-leaning geopolitical rhetoric (pro-Hamas, pro-terrorism, etc.)",
    answer: "-- SELECT ONE --"
  },
  {
    id: 24,
    text: "Contains significantly altared characters (race or gender) from original classic storyline (e.g., a black Snow White, an Indian Ariel, etc.)",
    answer: "-- SELECT ONE --"
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
