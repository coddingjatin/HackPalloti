import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyCn92ng555_Q7E0R_v-9VSyO14yJbcgTSM";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const fetchQuizQuestions = async (
  topic,
  difficulty,
  LearningStyle,
  time_commitment,
  domain_interest
) => {
  console.log(
    topic,
    difficulty,
    LearningStyle,
    time_commitment,
    domain_interest
  );
  try {
    // Updated prompt to include explanation along with correct answer.
    const prompt = `Write 15 multiple-choice questions based on the topics:-  "${topic}" it should be 4 biggner , 3 intermidiate , 2 hard question ,Remaining Questiob shold be generlize which ask question realated to learning style , how he learn and like to learn particular concept and all   amd it should  include  generalized questions so we can get to know user knowledge for collaborative filtering.
For each question, provide 4 options and specify the correct answer.
Also include a brief explanation (1-2 lines) for why the answer is correct.
Provide the output in JSON format as an array of objects with the following keys:
"question", "options", "answer", "explanation". and question should be ${difficulty} diificulty level.
It should i also check knoweldge on the personal level like ${
      (LearningStyle, time_commitment)
    } and ${domain_interest}
Example:
[
  {
    "question": "What is the capital of France?",
    "options": ["A) Berlin", "B) Madrid", "C) Paris", "D) Rome"],
    "answer": "C",
    "explanation": "Paris is the capital and most populous city of France."
  },
  ...
]`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;

    // Extract JSON from response text.
    const rawText = await response.text();
    const jsonMatch = rawText.match(/\[.*\]/s);
    const parsedQuestions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    return parsedQuestions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw new Error("Failed to fetch questions from Gemini.");
  }
};

// import { GoogleGenerativeAI } from "@google/generative-ai";

// const GEMINI_API_KEY = "AIzaSyCn92ng555_Q7E0R_v-9VSyO14yJbcgTSM";
// const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// export const fetchQuizQuestions = async (
//   topic,
//   difficulty,
//   LearningStyle,
//   time_commitment,
//   domain_interest
// ) => {
//   console.log(
//     topic,
//     difficulty,
//     LearningStyle,
//     time_commitment,
//     domain_interest
//   );
//   try {
//     // Updated prompt to include explanation along with correct answer.
//     const prompt = `Create a structured assessment to understand a student's learning profile.
// The assessment should include:

// 1️⃣ *Knowledge-Based Questions* (10 MCQs)
//    - 3 Easy, 3 Medium, 4 Hard questions related to the topic "${sanitizedTopic}".
//    - Format:
//      - "question": "What is the time complexity of binary search?",
//      - "options": ["A) O(n)", "B) O(log n)", "C) O(n^2)", "D) O(1)"],
//      - "answer": "B",
//      - "explanation": "Binary search divides the array into half at each step, making it O(log n)."

// 2️⃣ *Psychological & Behavioral Questions* (5 Questions)
//    - Understanding motivation, stress management, and focus levels.
//    - Example:
//      - "question": "How do you usually handle difficult concepts?",
//      - "options": ["A) I keep trying until I understand", "B) I take a break and revisit", "C) I seek external help", "D) I move to an easier topic"],
//      - "answer": "No correct answer",
//      - "explanation": "This helps identify how the student approaches challenges."

// 3️⃣ *Career Goals & Preferences* (3 Questions)
//    - Understand student aspirations and learning preferences.
//    - Example:
//      - "question": "What is your primary goal for learning this topic?",
//      - "options": ["A) Job preparation", "B) Personal projects", "C) Academic exams", "D) Entrepreneurial skills"],
//      - "answer": "No correct answer",
//      - "explanation": "This helps in customizing learning paths."

// 4️⃣ *Cognitive & Emotional Traits* (3 Questions)
//    - Analyze learning habits, focus, and time management.
//    - Example:
//      - "question": "How do you manage time for learning?",
//      - "options": ["A) Fixed schedule", "B) Whenever I feel like it", "C) Only when exams are near", "D) I struggle with time management"],
//      - "answer": "No correct answer",
//      - "explanation": "This helps understand discipline in learning."

// 📌 *Provide the output in JSON format* as an array of objects.`;

//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//     const result = await model.generateContent(prompt);
//     const response = await result.response;

//     // Extract JSON from response text.
//     const rawText = await response.text();
//     const jsonMatch = rawText.match(/\[.*\]/s);
//     const parsedQuestions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

//     return parsedQuestions;
//   } catch (error) {
//     console.error("Error fetching questions:", error);
//     throw new Error("Failed to fetch questions from Gemini.");
//   }
// };
