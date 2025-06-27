const Quiz = require('../models/quizModel');
const QuizAttempt = require('../models/quizAttemptSchema');
const User = require('../models/userModel');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.LLM_API_KEY);

const PROMPT_TEMPLATE = `
You are an expert roadmap generator.

Create a structured learning roadmap for the topic: "{TOPIC}".

Requirements:
- Include prerequisites, stages, concepts, and 3-5 high-quality resources per stage.
- All resources must include name, full working URL, type (video, documentation, github, course, tutorial), and estimated duration.
- Keep the roadmap realistic and achievable in about 3 hours.
- Respond ONLY with valid JSON. Do NOT include markdown formatting (e.g., \`\`\`), comments, or any explanation text.
- All keys and string values MUST be enclosed in double quotes.

Format:
{
  "prerequisites": ["..."],
  "stages": [
    {
      "name": "...",
      "description": "...",
      "duration": "...",
      "concepts": ["..."],
      "resources": [
        {
          "name": "...",
          "url": "...",
          "type": "...",
          "duration": "..."
        }
      ]
    }
  ]
}
`;

const generatePictoFlow = async (req, res) => {
  try {
    const { topic } = req.body;
    console.log("Generating roadmap for:", topic);

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = PROMPT_TEMPLATE.replace("{TOPIC}", topic);

    const result = await model.generateContent(prompt);
    const response = await result.response;

    let text = response.text().trim();

    // Safely extract JSON if wrapped in markdown
    const jsonMatch = text.match(/```json\s*([\s\S]*?)```/);
    if (jsonMatch) {
      text = jsonMatch[1].trim();
    }

    const roadmapData = JSON.parse(text);
    const mermaidDiagram = generateMermaidDiagram(roadmapData);

    return res.json({
      success: true,
      roadmap: roadmapData,
      mermaidDiagram
    });

  } catch (error) {
    console.error("Error generating roadmap:", error);
    return res.status(500).json({
      error: "Failed to generate roadmap",
      details: error.message
    });
  }
};

function generateMermaidDiagram(roadmapData) {
  let diagram = 'graph TD\n';

  // Add prerequisites if any
  if (roadmapData.prerequisites && roadmapData.prerequisites.length > 0) {
    diagram += '    Prerequisites[Prerequisites];\n';
    roadmapData.prerequisites.forEach((prereq, index) => {
      diagram += `    Prereq${index}[${prereq}];\n`;
      diagram += `    Prerequisites --> Prereq${index};\n`;
    });
  }

  // Add stages
  roadmapData.stages.forEach((stage, index) => {
    diagram += `    Stage${index}[${stage.name}];\n`;

    if (index > 0) {
      diagram += `    Stage${index - 1} --> Stage${index};\n`;
    } else if (roadmapData.prerequisites && roadmapData.prerequisites.length > 0) {
      diagram += `    Prerequisites --> Stage0;\n`;
    }

    stage.concepts.forEach((concept, conceptIndex) => {
      const conceptId = `Concept${index}_${conceptIndex}`;
      diagram += `    ${conceptId}[${concept}];\n`;
      diagram += `    Stage${index} --> ${conceptId};\n`;
    });
  });

  return diagram;
}

// other quiz controllers remain unchanged
const generateQuiz = async (req, res) => {
  try {
    console.log(req.body);
    const { title, topic, domain, difficulty, tags } = req.body;
    console.log(title, topic, domain, difficulty, tags);
    const _quiz = await Quiz.generateQuiz(title, topic, domain, difficulty, tags);
    console.log(_quiz);
    const quiz = await Quiz.getQuiz(_quiz._id);

    res.status(200).json({ quiz });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message
    });
  }
};

const getQuizResults = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }

    const results = [];
    for (let quiz of user.quizzes) {
      const attempts = await QuizAttempt.find({ user: userId, quiz: quiz });
      results.push(attempts);
    }

    res.status(200).json({ quizResults: results });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const attempt = await QuizAttempt.createAttempt(quizId, req.userId, answers);
    res.status(200).json({ attempt });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const getUserQuizzes = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId }).populate({
      path: "quizzes",
      populate: {
        path: "attempts",
        model: "QuizAttempt"
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    res.status(200).json({ quizzes: user.quizzes });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = {
  generateQuiz,
  submitQuiz,
  getQuizResults,
  getUserQuizzes,
  generatePictoFlow
};
