import { 
  FaUsers, 
  FaPalette, 
  FaMap, 
  FaBan, 
  FaCross, 
  FaSlash, 
  FaStarOfDavid, 
  FaPray, 
  FaFlagUsa, 
  FaMars, 
  FaRainbow, 
  FaVenus, 
  FaTransgender, 
  FaQuestion, 
  FaUser, 
  FaMarsDouble, 
  FaVenusDouble, 
  FaTransgenderAlt, 
  FaUserFriends, 
  FaPaw, 
  FaStar, 
  FaExchangeAlt, 
  FaGlobe, 
  FaFistRaised, 
  FaTheaterMasks, 
  FaSync, 
  FaLeaf, 
  FaIndustry, 
  FaSkull, 
  FaTrophy, 
  FaHistory, 
  FaLink, 
  FaThumbsDown, 
  FaQuoteLeft, 
  FaBullhorn, 
  FaHome, 
  FaTrash, 
  FaTag, 
  FaHandHolding, 
  FaChild, 
  FaChalkboardTeacher, 
  FaFeather, 
  FaGenderless, 
  FaCrow, 
  FaBook, 
  FaLifeRing
} from 'react-icons/fa';
import { supabase } from './lib/supabase';

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
  "No",
  "Yes"
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
    category: "Race & Diversity",
    icon: [FaUsers, FaPalette],
    color: "#FF6F61", // Coral - warm, diverse tone
    isAnti: false,
    description: "This question examines whether the show artificially inflates racial diversity in background scenes to meet diversity quotas or appear more inclusive than the setting would naturally allow.",
    examples: [
      "A show set in 1950s rural America having a perfectly balanced racial mix in every crowd scene",
      "A historical drama set in medieval Europe with modern racial diversity in the background",
      "A small town setting with an unrealistically diverse population in every scene"
    ]
  },
  {
    id: 2,
    text: "Racial diversity across cast is incongruous with show setting/locale",
    answer: "",
    weight: 0.70,
    category: "Race & Diversity",
    icon: [FaMap, FaUsers],
    color: "#8B4513", // SaddleBrown - earthy, tied to locale
    isAnti: false,
    description: "This question assesses whether the racial composition of the cast makes sense given the show's historical or geographical setting.",
    examples: [
      "A show set in ancient Japan with a racially diverse cast that doesn't reflect historical reality",
      "A story about a remote Scandinavian village with modern American racial demographics",
      "A period piece set in colonial America with contemporary racial diversity"
    ]
  },
  {
    id: 3,
    text: "Overt marginalization of white cast",
    answer: "",
    weight: 0.90,
    category: "Race & Diversity",
    icon: [FaUsers, FaBan],
    color: "#696969", // DimGray - muted, exclusionary feel
    isAnti: true,
    description: "This question identifies instances where white characters are systematically portrayed as inferior, villainous, or excluded from meaningful roles.",
    examples: [
      "All white characters being portrayed as racist or incompetent",
      "White characters being excluded from important storylines",
      "White characters being consistently shown as morally inferior to non-white characters"
    ]
  },
  {
    id: 4,
    text: "Religion: Overt anti-Christian rhetoric",
    answer: "",
    weight: 0.60,
    category: "Religion & Politics",
    icon: [FaCross, FaSlash],
    color: "#800000", // Maroon - dark, serious tone
    isAnti: true,
    description: "This question identifies explicit criticism or negative portrayal of Christianity in the show.",
    examples: [
      "Characters openly mocking Christian beliefs or practices",
      "Christian characters being portrayed as hypocritical or evil",
      "Negative stereotypes about Christianity being promoted"
    ]
  },
  {
    id: 5,
    text: "Religion: Overt anti-semitic rhetoric",
    answer: "",
    weight: 0.60,
    category: "Religion & Politics",
    icon: [FaStarOfDavid, FaSlash],
    color: "#483D8B", // DarkSlateBlue - solemn, distinct
    isAnti: true,
    description: "This question identifies explicit criticism or negative portrayal of Judaism in the show.",
    examples: [
      "Characters making anti-semitic remarks or jokes",
      "Jewish characters being portrayed negatively",
      "Promotion of anti-semitic stereotypes"
    ]
  },
  {
    id: 6,
    text: "Religion: Sigificant depiction of non-Christian religion",
    answer: "",
    weight: 0.30,
    category: "Religion & Politics",
    icon: [FaPray],
    color: "#FFD700", // Gold - spiritual, inclusive
    isAnti: false,
    description: "This question examines whether the show includes meaningful representation of religions other than Christianity.",
    examples: [
      "Main characters practicing non-Christian religions",
      "Detailed exploration of non-Christian religious practices",
      "Positive portrayal of religious diversity"
    ]
  },
  {
    id: 7,
    text: "Anti-nationalistic or anti-US rhetoric or theme",
    answer: "",
    weight: 0.40,
    category: "Religion & Politics",
    icon: [FaFlagUsa, FaSlash],
    color: "#B22222", // FireBrick - bold, anti-patriotic
    isAnti: true,
    description: "This question identifies content that explicitly criticizes or opposes American nationalism or patriotism.",
    examples: [
      "Characters criticizing American values or history",
      "Negative portrayal of American institutions",
      "Anti-American political messaging"
    ]
  },
  {
    id: 8,
    text: "Gay man in significant role",
    answer: "",
    weight: 0.90,
    category: "Gender & Sexuality",
    icon: [FaMars, FaRainbow],
    color: "#00CED1", // DarkTurquoise - vibrant, masculine
    isAnti: false,
    description: "This question examines whether the show includes a gay male character in a meaningful role.",
    examples: [
      "A gay male character as a main protagonist",
      "A gay male character in a supporting role with significant screen time",
      "A gay male character whose sexuality is relevant to the plot"
    ]
  },
  {
    id: 9,
    text: "Lesbian woman in significant role",
    answer: "",
    weight: 1.00,
    category: "Gender & Sexuality",
    icon: [FaVenus, FaRainbow],
    color: "#FF69B4", // HotPink - bold, feminine
    isAnti: false,
    description: "This question examines whether the show includes a lesbian character in a meaningful role.",
    examples: [
      "A lesbian character as a main protagonist",
      "A lesbian character in a supporting role with significant screen time",
      "A lesbian character whose sexuality is relevant to the plot"
    ]
  },
  {
    id: 10,
    text: "Trans man in significant role",
    answer: "",
    weight: 1.00,
    category: "Gender & Sexuality",
    icon: [FaTransgender, FaMars],
    color: "#1E90FF", // DodgerBlue - transitioning to male
    isAnti: false,
    description: "This question examines whether the show includes a transgender male character in a meaningful role.",
    examples: [
      "A trans male character as a main protagonist",
      "A trans male character in a supporting role with significant screen time",
      "A trans male character whose gender identity is relevant to the plot"
    ]
  },
  {
    id: 11,
    text: "Trans woman in significant role",
    answer: "",
    weight: 1.00,
    category: "Gender & Sexuality",
    icon: [FaTransgender, FaVenus],
    color: "#DA70D6", // Orchid - transitioning to female
    isAnti: false,
    description: "This question examines whether the show includes a transgender female character in a meaningful role.",
    examples: [
      "A trans female character as a main protagonist",
      "A trans female character in a supporting role with significant screen time",
      "A trans female character whose gender identity is relevant to the plot"
    ]
  },
  {
    id: 12,
    text: "Individual of indeterminate gender in significant or background role",
    answer: "",
    weight: 0.70,
    category: "Gender & Sexuality",
    icon: [FaQuestion, FaUser],
    color: "#808080", // Gray - neutral, undefined
    isAnti: false,
    description: "This question examines whether the show includes characters whose gender is intentionally ambiguous or non-binary.",
    examples: [
      "A character who uses they/them pronouns",
      "A character whose gender is never specified",
      "A character who presents in a gender-neutral way"
    ]
  },
  {
    id: 13,
    text: "Gay couple in significant roles",
    answer: "",
    weight: 1.00,
    category: "Gender & Sexuality",
    icon: [FaMarsDouble, FaRainbow],
    color: "#4682B4", // SteelBlue - paired masculine tone
    isAnti: false,
    description: "This question examines whether the show includes a same-sex male couple in meaningful roles.",
    examples: [
      "A gay couple as main characters",
      "A gay couple in supporting roles with significant screen time",
      "A gay couple whose relationship is central to the plot"
    ]
  },
  {
    id: 14,
    text: "Lesbian couple in significant roles",
    answer: "",
    weight: 1.00,
    category: "Gender & Sexuality",
    icon: [FaVenusDouble, FaRainbow],
    color: "#FFB6C1", // LightPink - paired feminine tone
    isAnti: false,
    description: "This question examines whether the show includes a same-sex female couple in meaningful roles.",
    examples: [
      "A lesbian couple as main characters",
      "A lesbian couple in supporting roles with significant screen time",
      "A lesbian couple whose relationship is central to the plot"
    ]
  },
  {
    id: 15,
    text: "Trans couple in significant or background role",
    answer: "",
    weight: 1.00,
    category: "Gender & Sexuality",
    icon: [FaTransgenderAlt, FaUserFriends],
    color: "#9370DB", // MediumPurple - blended trans identity
    isAnti: false,
    description: "This question examines whether the show includes a couple where one or both partners are transgender.",
    examples: [
      "A trans couple as main characters",
      "A trans couple in supporting roles",
      "A trans couple whose relationship is shown positively"
    ]
  },
  {
    id: 16,
    text: "Other (furry, etc.) in significant or background role",
    answer: "",
    weight: 0.80,
    category: "Gender & Sexuality",
    icon: [FaPaw, FaUser],
    color: "#FF4500", // OrangeRed - wild, unique
    isAnti: false,
    description: "This question examines whether the show includes characters with non-traditional identities or representations.",
    examples: [
      "A furry character in a significant role",
      "A character with an alternative identity or lifestyle",
      "A character who challenges traditional identity norms"
    ]
  },
  {
    id: 17,
    text: "Mixed race couple in significant or background roles",
    answer: "",
    weight: 0.60,
    category: "Race & Diversity",
    icon: [FaUserFriends, FaPalette],
    color: "#DAA520", // GoldenRod - warm, blended
    isAnti: false,
    description: "This question examines whether the show includes interracial couples in meaningful roles.",
    examples: [
      "A mixed race couple as main characters",
      "A mixed race couple in supporting roles",
      "A mixed race couple whose relationship is shown positively"
    ]
  },
  {
    id: 18,
    text: "Mixed race gay/lesbian couple in significant roles",
    answer: "",
    weight: 1.00,
    category: "Race & Diversity",
    icon: [FaUserFriends, FaRainbow, FaPalette],
    color: "#FF6347", // Tomato - vibrant, diverse mix
    isAnti: false,
    description: "This question examines whether the show includes same-sex interracial couples in meaningful roles.",
    examples: [
      "A mixed race same-sex couple as main characters",
      "A mixed race same-sex couple in supporting roles",
      "A mixed race same-sex couple whose relationship is shown positively"
    ]
  },
  {
    id: 19,
    text: "Black lead actor/actress in significant role (when not set in Africa or about African/African-American culture)",
    answer: "",
    weight: 0.50,
    category: "Race & Diversity",
    icon: [FaUser, FaStar],
    color: "#2F4F4F", // DarkSlateGray - strong, prominent
    isAnti: false,
    description: "This question examines whether the show features a Black actor or actress in a leading role when the setting or subject matter doesn't naturally call for it.",
    examples: [
      "A Black actor/actress as the main protagonist in a story not about African/African-American culture",
      "A Black actor/actress in a major supporting role in a setting where it would be historically or geographically unusual",
      "A Black actor/actress whose race is highlighted despite not being relevant to the story"
    ]
  },
  {
    id: 20,
    text: "Asian lead actor/actress in significant role (when not set in Asia or about Asian culture)",
    answer: "",
    weight: 0.50,
    category: "Race & Diversity",
    icon: [FaUser, FaStar],
    color: "#FF8C00", // DarkOrange - bright, distinct
    isAnti: false,
    description: "This question examines whether the show features an Asian actor or actress in a leading role when the setting or subject matter doesn't naturally call for it.",
    examples: [
      "An Asian actor/actress as the main protagonist in a story not about Asian culture",
      "An Asian actor/actress in a major supporting role in a setting where it would be historically or geographically unusual",
      "An Asian actor/actress whose race is highlighted despite not being relevant to the story"
    ]
  },
  {
    id: 21,
    text: "Other non-white lead actor/actress in significant role (when not set in their cultural region or about their culture)",
    answer: "",
    weight: 0.50,
    category: "Race & Diversity",
    icon: [FaUser, FaStar],
    color: "#9ACD32", // YellowGreen - varied, lively
    isAnti: false,
    description: "This question examines whether the show features a non-white actor or actress (other than Black or Asian) in a leading role when the setting or subject matter doesn't naturally call for it.",
    examples: [
      "A Hispanic/Latino actor/actress as the main protagonist in a story not about Hispanic/Latino culture",
      "A Native American actor/actress in a major supporting role in a setting where it would be historically or geographically unusual",
      "A Middle Eastern actor/actress whose race is highlighted despite not being relevant to the story"
    ]
  },
  {
    id: 22,
    text: "Lead actor/actress in role almost always associated with the opposite gender",
    answer: "",
    weight: 0.90,
    category: "Character Representation",
    icon: [FaExchangeAlt, FaUser],
    color: "#BA55D3", // MediumOrchid - gender fluidity
    isAnti: false,
    description: "This question examines whether the show features an actor or actress in a role traditionally associated with the opposite gender.",
    examples: [
      "A female actor playing a traditionally male role",
      "A male actor playing a traditionally female role",
      "Gender-swapped casting in a classic story"
    ]
  },
  {
    id: 23,
    text: "Left-leaning geopolitical rhetoric (pro-Hamas, pro-terrorism, etc.)",
    answer: "",
    weight: 1.00,
    category: "Religion & Politics",
    icon: [FaGlobe, FaFistRaised],
    color: "#DC143C", // Crimson - intense, political
    isAnti: true,
    description: "This question identifies content that promotes or sympathizes with left-wing political movements or controversial geopolitical positions.",
    examples: [
      "Positive portrayal of controversial political movements",
      "Sympathetic treatment of controversial political figures",
      "Promotion of controversial political ideologies"
    ]
  },
  {
    id: 24,
    text: "Contains significantly altered characters (race or gender) from original classic storyline",
    answer: "",
    weight: 1.00,
    category: "Character Representation",
    icon: [FaTheaterMasks, FaSync],
    color: "#6A5ACD", // SlateBlue - theatrical shift
    isAnti: false,
    description: "This question examines whether the show alters the race or gender of characters from their original source material.",
    examples: [
      "Race-swapped casting in a classic story",
      "Gender-swapped casting in a classic story",
      "Significant alteration of character demographics from source material"
    ]
  },
  {
    id: 25,
    text: "Overt pro-environmentalist or climate change agenda woven into the plot",
    answer: "",
    weight: 0.70,
    category: "Social Commentary",
    icon: [FaLeaf, FaGlobe],
    color: "#32CD32", // LimeGreen - environmental focus
    isAnti: false,
    description: "This question examines whether the show includes explicit environmental or climate change messaging.",
    examples: [
      "Environmental themes as a central plot point",
      "Climate change activism in the storyline",
      "Pro-environmental messaging throughout the show"
    ]
  },
  {
    id: 26,
    text: "Capitalism or corporations portrayed as inherently evil or exploitative",
    answer: "",
    weight: 0.60,
    category: "Social Commentary",
    icon: [FaIndustry, FaSkull],
    color: "#708090", // SlateGray - industrial, dark
    isAnti: true,
    description: "This question identifies content that presents capitalism or corporations in a consistently negative light.",
    examples: [
      "Corporations portrayed as evil entities",
      "Capitalism shown as inherently exploitative",
      "Anti-capitalist messaging throughout the show"
    ]
  },
  {
    id: 27,
    text: "Female character outperforms male counterparts in traditionally male-dominated fields",
    answer: "",
    weight: 0.80,
    category: "Character Representation",
    icon: [FaVenus, FaTrophy],
    color: "#FF1493", // DeepPink - bold female strength
    isAnti: false,
    description: "This question examines whether the show features women succeeding in traditionally male-dominated areas.",
    examples: [
      "A female character excelling in STEM fields",
      "A female character leading in military or law enforcement",
      "A female character breaking gender barriers in sports"
    ]
  },
  {
    id: 28,
    text: "Historical events or figures reinterpreted to emphasize systemic oppression",
    answer: "",
    weight: 0.90,
    category: "Social Commentary",
    icon: [FaHistory, FaLink],
    color: "#A52A2A", // Brown - historical weight
    isAnti: false,
    description: "This question examines whether the show reinterprets historical events to focus on social justice themes.",
    examples: [
      "Historical events retold from marginalized perspectives",
      "Historical figures reinterpreted through modern social justice lens",
      "Historical narratives emphasizing systemic oppression"
    ]
  },
  {
    id: 29,
    text: "Straight white male character portrayed as incompetent, villainous, or morally inferior",
    answer: "",
    weight: 0.70,
    category: "Character Representation",
    icon: [FaMars, FaThumbsDown],
    color: "#778899", // LightSlateGray - muted male critique
    isAnti: false,
    description: "This question examines whether straight white male characters are consistently portrayed negatively.",
    examples: [
      "Straight white male characters as villains",
      "Straight white male characters as incompetent",
      "Straight white male characters as morally flawed"
    ]
  },
  {
    id: 30,
    text: "Dialogue includes buzzwords like 'patriarchy,' 'privilege,' or 'systemic racism'",
    answer: "",
    weight: 0.80,
    category: "Social Commentary",
    icon: [FaQuoteLeft, FaBullhorn],
    color: "#FF00FF", // Magenta - loud, attention-grabbing
    isAnti: false,
    description: "This question examines whether the show uses common social justice terminology in its dialogue.",
    examples: [
      "Characters discussing 'patriarchy'",
      "References to 'white privilege'",
      "Discussions of 'systemic racism'"
    ]
  },
  {
    id: 31,
    text: "Traditional gender roles or family structures mocked or depicted as outdated",
    answer: "",
    weight: 0.60,
    category: "Social Commentary",
    icon: [FaHome, FaTrash],
    color: "#CD853F", // Peru - earthy, discarded feel
    isAnti: false,
    description: "This question examines whether the show presents traditional gender roles or family structures negatively.",
    examples: [
      "Traditional family structures portrayed as outdated",
      "Gender roles presented as restrictive",
      "Traditional values shown as problematic"
    ]
  },
  {
    id: 32,
    text: "Character's race, gender, or sexuality is explicitly highlighted as their defining trait",
    answer: "",
    weight: 0.70,
    category: "Character Representation",
    icon: [FaTag, FaUser],
    color: "#20B2AA", // LightSeaGreen - highlighted trait
    isAnti: false,
    description: "This question examines whether a character's identity is emphasized as their primary characteristic.",
    examples: [
      "A character's race being their main plot point",
      "A character's gender being central to their story",
      "A character's sexuality being their defining feature"
    ]
  },
  {
    id: 33,
    text: "Overt pro-socialist or collectivist rhetoric woven into the narrative",
    answer: "",
    weight: 0.80,
    category: "Social Commentary",
    icon: [FaUsers, FaHandHolding],
    color: "#FF0000", // Red - socialist association
    isAnti: false,
    description: "This question examines whether the show promotes socialist or collectivist ideologies.",
    examples: [
      "Pro-socialist messaging in the plot",
      "Collectivist values being promoted",
      "Anti-capitalist themes throughout"
    ]
  },
  {
    id: 34,
    text: "Children or teens lecture adults on moral or social issues with unrealistic authority",
    answer: "",
    weight: 0.60,
    category: "Social Commentary",
    icon: [FaChild, FaChalkboardTeacher],
    color: "#FFA500", // Orange - youthful energy
    isAnti: false,
    description: "This question examines whether young characters are portrayed as having unrealistic moral authority over adults.",
    examples: [
      "Teen characters lecturing adults on social issues",
      "Children being portrayed as morally superior to adults",
      "Young characters having unrealistic influence over adult decisions"
    ]
  },
  {
    id: 35,
    text: "Male characters emasculated or feminized to subvert traditional masculinity",
    answer: "",
    weight: 0.70,
    category: "Character Representation",
    icon: [FaMars, FaFeather],
    color: "#EE82EE", // Violet - softened masculinity
    isAnti: false,
    description: "This question examines whether male characters are portrayed in ways that challenge traditional masculinity.",
    examples: [
      "Male characters rejecting traditional masculine traits",
      "Male characters embracing traditionally feminine characteristics",
      "Male characters being portrayed as less traditionally masculine"
    ]
  },
  {
    id: 36,
    text: "inclusion of a non-binary character in a significant or background role",
    answer: "",
    weight: 0.90,
    category: "Gender & Sexuality",
    icon: [FaGenderless, FaUser],
    color: "#D3D3D3", // LightGray - neutral identity
    isAnti: false,
    description: "This question examines whether the show includes characters who identify as non-binary.",
    examples: [
      "A non-binary character in a main role",
      "A non-binary character in a supporting role",
      "A non-binary character whose identity is relevant to the plot"
    ]
  },
  {
    id: 37,
    text: "Animals or nature anthropomorphized to deliver moral lessons about human behavior",
    answer: "",
    weight: 0.50,
    category: "Social Commentary",
    icon: [FaCrow, FaBook],
    color: "#228B22", // ForestGreen - nature-inspired
    isAnti: false,
    description: "This question examines whether the show uses anthropomorphized animals or nature to convey social messages.",
    examples: [
      "Animal characters teaching human moral lessons",
      "Nature personified to deliver social commentary",
      "Anthropomorphized characters promoting social values"
    ]
  },
  {
    id: 38,
    text: "Plot hinges on a 'diverse' character saving or redeeming a less diverse cast",
    answer: "",
    weight: 0.80,
    category: "Character Representation",
    icon: [FaLifeRing, FaUsers],
    color: "#4169E1", // RoyalBlue - heroic diversity
    isAnti: false,
    description: "This question examines whether the show uses a diverse character as a 'savior' figure for less diverse characters.",
    examples: [
      "A diverse character teaching others about acceptance",
      "A diverse character saving the day for a less diverse group",
      "A diverse character redeeming less diverse characters"
    ]
  },
  {
    id: 39,
    text: "Overt celebration of progressive political figures or movements",
    answer: "",
    weight: 1.00,
    category: "Social Commentary",
    icon: [FaFistRaised, FaStar],
    color: "#00FF7F", // SpringGreen - progressive vibrancy
    isAnti: false,
    description: "This question examines whether the show explicitly celebrates progressive political figures or movements.",
    examples: [
      "Positive portrayal of progressive political figures",
      "Celebration of progressive social movements",
      "Promotion of progressive political ideologies"
    ]
  }
];

// Score calculation function
export const calculateScore = (answers) => {
  let totalScore = 0;
  
  // Filter out unanswered questions
  const validAnswers = answers.filter(q => q.answer && q.answer !== "" && q.answer !== "N/A");
  
  // Calculate score based on new answer options and weights
  validAnswers.forEach(question => {
    let multiplier = 0;
    
    // Handle both old and new answer formats for backward compatibility
    if (question.answer === "Yes" || question.answer === "Strongly Agree") {
      multiplier = 1.0; // Full weight
    } else if (question.answer === "Agree") {
      multiplier = 0.7; // 70% of weight
    } else if (question.answer === "Disagree" || question.answer === "No") {
      multiplier = 0; // No points
    }
    // N/A and empty answers already filtered out above
    
    totalScore += 10 * question.weight * multiplier;
  });
  
  return Math.round(totalScore);
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

// Save assessment to Supabase
export const saveAssessment = async (userId, showName, questions, category, showDetails = null) => {
  try {
    // Ensure questions is an array before filtering
    const questionsArray = Array.isArray(questions) ? questions : [];
    
    // Filter out unanswered questions before saving
    const answeredQuestions = questionsArray.filter(q => q.answer && q.answer !== "" && q.answer !== "N/A");
    
    const assessment = {
      user_id: userId,
      show_name: showName,
      questions: answeredQuestions,
      category,
      show_details: showDetails,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('assessments')
      .insert([assessment])
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error saving assessment:', error);
    throw error;
  }
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
