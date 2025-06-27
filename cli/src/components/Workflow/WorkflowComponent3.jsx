"use client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize API Client
const genAI = new GoogleGenerativeAI("AIzaSyCn92ng555_Q7E0R_v-9VSyO14yJbcgTSM");

// Function to call Google Gemini API
async function makeChatRequest(promptInput) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(promptInput);

    console.log("Raw API Response:", result); // Debugging log

    if (!result || !result.response || !result.response.candidates) {
      throw new Error("Invalid API response format.");
    }

    let responseText = result.response.candidates[0].content.parts[0].text;
    console.log("Extracted Text:", responseText); // Debugging log

    responseText = responseText
      .replace(/^```json[\r\n]*/, "")
      .replace(/```[\r\n]*$/, "")
      .trim();

    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error generating text:", error.message);
    throw new Error("Failed to fetch AI-generated paths. Please try again later.");
  }
}

// Function to fetch learning paths
async function getResult(languages, frameworks) {
  let prompt = `Generate a structured JSON object that represents a progressive learning path in Artificial Intelligence. The user knows the following languages: [${languages}]. The user also knows frameworks: [${frameworks}].

  **Requirements:**
  - Output should be **a JSON object only** (no extra text, no markdown formatting).
  - Use a **tree structure** where each learning step (node) has:
    - **title**: (string) A short name for the topic.
    - **description**: (string) A brief explanation of the topic.
    - **skills**:
      - **knows**: (array of strings) Prerequisite skills that the user already knows.
      - **learns**: (array of strings) New skills to be learned at this step.
    - **children**: (array) Subtopics that further break down this step.

  **Example Output:**
  {
    "title": "Web Development",
    "description": "Start with the basics of HTML, CSS, and JavaScript.",
    "skills": {
      "knows": ["HTML", "CSS", "JavaScript"],
      "learns": ["DOM Manipulation", "Responsive Design"]
    },
    "children": [
      {
        "title": "Front-end Development",
        "description": "Learn frameworks like React, Vue, or Angular.",
        "skills": {
          "knows": ["JavaScript"],
          "learns": ["React", "Vue", "Angular"]
        },
        "children": []
      },
      {
        "title": "Back-end Development",
        "description": "Understand server-side development with Node.js and databases.",
        "skills": {
          "knows": ["JavaScript"],
          "learns": ["Node.js", "Express", "MongoDB"]
        },
        "children": []
      }
    ]
  }`;

  return await makeChatRequest(prompt)
    .then((res) => {
      // Ensure the response is an array (even if it's a single object)
      return Array.isArray(res) ? res : [res];
    })
    .catch((err) => {
      console.error("Error in getResult:", err);
      return [];
    });
}

// Loading Component
function Loading() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      <h1 className="text-center fw-bold">Getting Learning Path...</h1>
      <div className="progress w-50">
        <div className="progress-bar progress-bar-striped progress-bar-animated bg-primary" style={{ width: "100%" }}></div>
      </div>
      <p className="text-center text-muted">This may take up to 2 minutes. Please do not refresh.</p>
    </div>
  );
}

// Skill Chip Component
function SkillChip({ skills, type }) {
  return (
    <div className="d-flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <span key={index} className={`badge ${type === "knows" ? "bg-success" : "bg-primary"} text-light`}>
          {skill}
        </span>
      ))}
    </div>
  );
}

// Tree Node Component with Collapsible Functionality
function TreeNode({ node }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const skills = node.skills || { knows: [], learns: [] };

  return (
    <div
      className="position-relative mb-4 p-4 rounded-4 border border-primary-subtle shadow-lg bg-white bg-opacity-75"
      style={{
        backdropFilter: "blur(10px)",
        borderLeft: "6px solid #0d6efd",
        transition: "all 0.3s ease-in-out",
      }}
    >
      {/* Collapse Button */}
      {node.children?.length > 0 && (
        <button
          className="position-absolute top-0 end-0 m-3 btn p-0 border-0 bg-transparent"
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <ChevronDown size={22} color="#0d6efd" />
        </button>
      )}

      {/* Title & Description */}
      <h4 className="fw-bold text-dark mb-2">{node.title}</h4>
      <p className="text-muted">{node.description}</p>

      {!isCollapsed && (
        <>
          {/* Known Skills */}
          {skills.knows?.length > 0 && (
            <div className="mb-3">
              <p className="text-muted fw-semibold mb-1">🎯 Already Knows</p>
              <div className="d-flex flex-wrap gap-2">
                {skills.knows.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 rounded-pill text-white fw-medium"
                    style={{
                      background: "linear-gradient(to right, #4CAF50, #81C784)",
                      fontSize: "0.85rem",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Learning Skills */}
          {skills.learns?.length > 0 && (
            <div className="mb-3">
              <p className="text-muted fw-semibold mb-1">📘 Will Learn</p>
              <div className="d-flex flex-wrap gap-2">
                {skills.learns.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 rounded-pill text-white fw-medium"
                    style={{
                      background: "linear-gradient(to right, #2196F3, #64B5F6)",
                      fontSize: "0.85rem",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Children */}
          {node.children?.length > 0 && (
            <div className="mt-4 ps-4 border-start border-2 border-primary-subtle">
              {node.children.map((child, index) => (
                <TreeNode key={index} node={child} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Result Component
function Result({ paths }) {
  return (
    <div className="container-fluid my-5">
      <div className="row">
        {paths.map((path, index) => (
          <div key={index} className="col-lg-6 col-md-12 mb-3">
            <TreeNode node={path} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Component
export default function WorkflowComponent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userKnowledge = JSON.parse(sessionStorage.getItem("userKnowledge") || "{}");
        if (!userKnowledge.lang) throw new Error("User knowledge is missing.");

        const result = await getResult(userKnowledge.lang, userKnowledge.framework);
        setData(result.length > 0 ? result : null);
      } catch (err) {
        setError(err.message || "Error fetching data.");
      }
    };

    fetchData();
  }, []);

  const memoizedPaths = useMemo(() => data, [data]);

  if (error) {
    return (
      <div className="container text-center my-5">
        <h1 className="fw-bold text-danger">❌ Error Occurred</h1>
        <p className="text-muted">{error}</p>
        <button className="btn btn-dark mt-3" onClick={() => window.location.reload()}>
          🔄 Try Again
        </button>
      </div>
    );
  }

  return <main className="container-fluid">{memoizedPaths ? <Result paths={memoizedPaths} /> : <Loading />}</main>;
}