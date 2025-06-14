const Quiz = require('../models/quizModel');
const QuizAttempt = require('../models/quizAttemptSchema');
const User = require('../models/userModel');
const { GoogleGenerativeAI } = require("@google/generative-ai");

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
}

const getQuizResults = async (req, res) => {  
    try {
        const userId = req.params.userId;
        const user = await User.findOne({ _id: userId });
        if (!user) {
            throw new Error('User not found');
        }

        const results = [];
        for (let quiz of user.quizzes) {
            
            const attempts = await QuizAttempt.find({ user: userId, quiz: quiz });
            results.push(attempts);
        }

        console.log(results);

        res.status(200).json({ quizResults: results });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }  
}

// this function should be used when you want to submit a quiz attempt and get results
const submitQuiz = async (req, res) => {
    try {
        const {quizId, answers } = req.body;
        const attempt = await QuizAttempt.createAttempt(quizId, req.userId , answers);


        res.status(200).json({ attempt });
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
}

const getUserQuizzes = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.userId })
    .populate({
        path: 'quizzes',
        populate: {
            path: 'attempts',
            model: 'QuizAttempt'
        }
    });


        if (!user) {
            throw new Error('User not found');
        }

        res.status(200).json({ quizzes : user.quizzes });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}


const genAI = new GoogleGenerativeAI(process.env.LLM_API_KEY);

const PROMPT_TEMPLATE = `
Create a detailed learning roadmap for {TOPIC}. Include:


1. Clear learning path with main concepts
2. Highly specific, working resource links (IMPORTANT: Only include:)
   - Official documentation links
   - Specific YouTube video links (full URLs)
   - GitHub repositories with tutorials/examples
   - Free online course links (Coursera, edX, etc.)
   - Popular blog tutorials from well-known platforms
3. Realistic time estimates for each section
4. Essential prerequisites

Format the response as a JSON object with this structure:
{
  "prerequisites": [
    "string" // List of required prerequisite knowledge
  ],
  "stages": [
    {
      "name": "string", // Clear, concise stage name
      "description": "string", // 2-3 sentence description of this stage
      "duration": "string", // Realistic time estimate (e.g., "2-3 weeks")
      "concepts": [
        "string" // 3-5 key concepts for this stage
      ],
      "resources": [
        {
          "name": "string", // Descriptive name of the resource
          "url": "string", // Full, working URL
          "type": "string", // One of: "documentation", "video", "tutorial", "course", "github"
          "duration": "string" // Estimated time to complete this resource
        }
      ]
    }
  ]
}

IMPORTANT GUIDELINES:
1. Ensure all URLs are complete and from reputable sources
2. Include a mix of resource types for each stage
3. Keep concepts focused and specific
4. Provide realistic time estimates
5. Order stages from basic to advanced
6. Include 3-5 high-quality resources per stage
7. Ensure resource names are descriptive and specific
8. user wants to learn this in 3 hours`;


const generatePictoFlow = async (req, res) => {
    try {
        const { topic } = req.body;
        console.log(topic)
        if (!topic) {
          return res.status(400).json({ error: 'Topic is required' });
        }
    
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = PROMPT_TEMPLATE.replace('{TOPIC}', topic);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        text = text.replace('```json\n', '');
        text = text.replace('```', '');
        const roadmapData = JSON.parse(text);
    
        const mermaidDiagram = generateMermaidDiagram(roadmapData);
    
        return res.json({
          success: true,
          roadmap: roadmapData,
          mermaidDiagram
        });
    
      } catch (error) {
        console.error('Error generating roadmap:', error);
        return res.status(500).json({ 
          error: 'Failed to generate roadmap',
          details: error.message 
        });
      }
}

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
      // Create node for stage
      diagram += `    Stage${index}[${stage.name}];\n`;
      
      // Connect to previous stage
      if (index > 0) {
        diagram += `    Stage${index-1} --> Stage${index};\n`;
      } else if (roadmapData.prerequisites && roadmapData.prerequisites.length > 0) {
        // Connect prerequisites to first stage
        diagram += `    Prerequisites --> Stage0;\n`;
      }
  
      // Add concepts as sub-nodes
      stage.concepts.forEach((concept, conceptIndex) => {
        const conceptId = `Concept${index}_${conceptIndex}`;
        diagram += `    ${conceptId}[${concept}];\n`;
        diagram += `    Stage${index} --> ${conceptId};\n`;
      });
    });
  
    return diagram;
  }

module.exports = {
    generateQuiz,
    submitQuiz,
    getQuizResults,
    getUserQuizzes,
    generatePictoFlow
}