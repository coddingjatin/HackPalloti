import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import "./report.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GEMINI_API_KEY =  "AIzaSyBMKBl2oHE_7uh0Xht_Ux3aKeMdmWcoBxQ" ||  localStorage.getItem("api");

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const Report = () => {
  const [quizResults, setQuizResults] = useState([]);
  const [learningPathways, setLearningPathways] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:5000/api/quiz/user-quiz/${userId}`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setQuizResults(data.quizzes ))
        .catch((error) => console.error("Failed to fetch quiz results:", error));
    }
  }, [userId]);
  
  const generateBardReport = async (topic, score) => {
    try {
        const reportPrompt = `
        *Student Profile:*  
        - *Quiz Score for ${topic}*: ${score}/10  
        - *Learning Style*: Visual, prefers video-based learning  
        - *Available Study Time*: 10 minutes per week  
      
        *Task:*  
        1. Based on the quiz score for ${topic}, identify areas where the student is strong and where they need improvement.  
        2. Recommend a *personalized learning pathway* for ${topic} with topics arranged in an *optimal sequence* to strengthen weak areas and build upon existing knowledge.  
        3. Suggest *video-based resources* tailored for *visual learners*.  
        4. Break down the pathway into *weekly learning plans* that fit within a *10-minute study session per week*.  
        5. Keep the pathway *engaging, structured, and goal-oriented* to maximize efficiency.  
      
        *Output Format:*  
        Return a **valid JSON object** with the following structure:
      
        \`\`\`json
        {
          "strengths": "A brief summary of the student's strengths in ${topic}.",
          "weaknesses": "A brief summary of areas needing improvement in ${topic}.",
          "weekPlan": [
            {
              "week": "Week 1",
              "topics": "Topic name and short description",
              "resources": [
                {
                  "name": "Resource name",
                  "url": "Resource URL"
                }
              ]
            },
            {
              "week": "Week 2",
              "topics": "Another topic...",
              "resources": []
            }
          ],
          "finalMilestone": "The expected outcome after completing this learning plan.",
          "suggestedVideos": [
            {
              "name": "Video Title",
              "url": "YouTube or other video platform link"
            }
          ]
        }
        \`\`\`
        Ensure that the response is **valid JSON format** without extra markdown or text.
      `;
      


      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(reportPrompt);
      const response = await result.response;
      let rawText = await response.text();

      rawText = rawText
      .replace(/^```json[\r\n]*/, "")
      .replace(/```[\r\n]*$/, "")
      .trim();

      return rawText;
    } catch (error) {
      console.error("Error generating report with BARD:", error);
      return "Failed to generate the report.";
    }
  };

  const generateReportsForAllTopics = async () => {
    const reportsArray = [];
    
    for (const result of quizResults) {
      try {
        const report = await generateBardReport(result.topic, result.attempts[0].score);
        reportsArray.push(report);
        
        // Add 10-second delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error("Error generating report for topic:", result.topic, error);
        reportsArray.push(null); // Push null for failed requests
      }
    }
    
    setLearningPathways(reportsArray.filter(report => report !== null));
  };
  
  useEffect(() => {
    if (quizResults.length > 0) {
      const fetchReports = async () => {
        await generateReportsForAllTopics();
      };
      fetchReports();
    }
  }, [quizResults]);

  // Data for the bar chart
  const chartData = {
    labels: quizResults.map(result => result.topic),
    datasets: [
      {
        label: 'Quiz Scores',
        data: quizResults.map(result => result.attempts[0].score),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
      }
    }
  };

  return (
    <div className="report-container">
      <h2 className="report-heading">Learning Report</h2>

      <div className="chart-container">
        <h3 className='title'>Your Quiz Performance</h3>
        <Bar data={chartData} options={chartOptions} />
      </div>

      {learningPathways.length === 0 ? (
        <center><p>Generating reports...</p></center>
      ) : (
        learningPathways.map((report, index) => {
          const { topic } = quizResults[index];
          const reportDetails = JSON.parse(report); 

          return (
            <div className="topic-report" key={index}>
             <center><h3 className="topic-title mb-4">Report of {topic}</h3></center> 

              <div className="report-section">
                <h4>Strengths</h4>
                <p>{reportDetails.strengths || `Not mentioned in the context for ${topic}.`}</p>
              </div>

              <div className="report-section">
                <h4>Weaknesses</h4>
                <p>{reportDetails.weaknesses || `Low quiz score (${quizResults[index]?.score}/10) indicates a significant gap in understanding ${topic} fundamentals.`}</p>
              </div>

              <div className="report-section p-3">
              <h4 className='mb-4'>Week-by-Week Learning Plan</h4>
                {reportDetails.weekPlan?.map((week, i) => (
                  <div className="week-plan" key={i}>
                    <h5>{week.week} (1 Hour)</h5>
                    <p>Topics: {week.topics}</p>
                    <ul>
                      {week.resources?.map((resource, i) => (
                        <li key={i}><a href={resource.url}>{resource.name}</a></li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="report-section p-3">
              <h4 className='mb-4'>Final Milestone & Expected Learning Outcome</h4>
                <p>{reportDetails.finalMilestone || `After completing this pathway, the student should have a basic understanding of ${topic} fundamentals.`}</p>
              </div>

              <div className="report-section p-3">
              <h4 className='mb-4'>Suggested Video Resources</h4>
                <ul>
                  {reportDetails.suggestedVideos?.map((video, i) => (
                    <li key={i}><a href={video.url}>{video.name}</a></li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Report;