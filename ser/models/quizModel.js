const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const Question = require("./questionSchema");

dotenv.config();
const genAi = new GoogleGenerativeAI(process.env.LLM_API_KEY);
const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });

const quizSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  tags: {
    type: [String],
    default: [],
  },
  topic:{
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    required: [true, "Difficulty is required"],
  },
  domain: {
    type: String,
  },
  attempts: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "QuizAttempt",
      },
    ],
    default: [],
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  dateModified: {
    type: Date,
    default: Date.now,
  },
});

// This function should be used when you want to send quiz to the frontend (user)
quizSchema.statics.getQuiz = async function (quizId) {
  return await this.findById(quizId).populate({
    path: "questions",
    select: "-correctOption -explanation",
  });
};

quizSchema.statics.generateQuiz = async function (
  title,
  topic,
  domain,
  difficulty,
  tags
) {
  console.log("inside generate quiz");
  const prompt = `Write 15 multiple-choice questions based on the  9 based on topics:-  "${topic}" it should be 4 biggner , 3 intermidiate , 2 hard question ,Remaining  6 Question should be  realated to learning style , how he learn and like to learn particular concept and all   amd it should  include  generalized questions so we can get to know user knowledge for collaborative filtering.
    For each question, provide 4 options and specify the correct answer.
    Also include a brief explanation (1-2 lines) for why the answer is correct.
    Provide the output in JSON format as an array of objects with the following keys:
    "question", "options", "answer", "explanation". and question should be ${difficulty} diificulty level.
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

  const result = await model.generateContent(prompt);
  console.log(result);

    const response = result.response;
    let text = response.text();
    text = text.replace("```json\n", "");
    text = text.replace("```", "");
    text = text.replace("```JSON", "");

  const questions = JSON.parse(text);
  console.log(questions);

  let questionIds = [];
  await Promise.all(
    questions.map(async (question) => {
      const newQuestion = new Question({
        question: question.question,
        options: question.options,
        correctOption: question.answer,
        explanation: question.explanation,
        domain: domain,
        tags: tags,
      });

      await newQuestion.save();
      console.log(newQuestion._id);
      questionIds.push(newQuestion._id);
    })
  );

  const newQuiz = new this({
    title: `Quiz on ${domain}`,
    questions: questionIds,
    tags: tags,
    difficulty: difficulty,
    domain: domain,
    topic: topic
  });

    await newQuiz.save();
    return newQuiz;
}


module.exports = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);
