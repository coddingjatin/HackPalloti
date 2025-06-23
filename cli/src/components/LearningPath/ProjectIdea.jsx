"use client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useEffect, useState } from "react";
import Error from "../ui/Error"
import Loading from "../ui/Loading"


// Initialize the API client
const genAI = new GoogleGenerativeAI( "AIzaSyB-9YvbpoxsCp6uI6gtRiL_5sL_hzrGUuk" || localStorage.getItem("api") );

export async function makeChatRequest(promptInput) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(promptInput);

    let responseText = result.response.candidates[0].content.parts[0].text;
    responseText = responseText
      .replace(/^```json[\r\n]*/, "")
      .replace(/```[\r\n]*$/, "")
      .trim();

    console.log("Generated Response:", responseText);

    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error generating text:", error);
    throw error;
  }
}

async function getResult(languages, frameworks) {
  let prompt = `Give me the JSON for an array object called "paths" containing 10 learning paths that suggest user for learning new programming skills which are related to what he knows. Paths should be in the form of objects which have title, description and skills (new or old) as keys. The user knows [${languages}] language(s).`;
  if (frameworks) {
    prompt += ` The user knows [${frameworks}] frameworks.`;
  }

  return await makeChatRequest(prompt)
    .then((res) => {
      console.log("AI Response Paths:", res);
      return res.paths || [];
    })
    .catch((err) => {
      console.error("Error in getResult:", err);
      return [];
    });
}

function Result({ paths }) {
  return (
    <div className="container py-5">
      <h2 className="fw-bold text-center mb-4">
        💻 Projects
      </h2>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {paths.map((path, index) => {
          // Difficulty level
          const level =
            path.skills.length > 6
              ? "Hard"
              : path.skills.length > 4
              ? "Medium"
              : "Easy";

          const levelColor =
            level === "Easy"
              ? "bg-success-subtle text-success"
              : level === "Medium"
              ? "bg-primary-subtle text-primary"
              : "bg-danger-subtle text-danger";

          return (
            <div className="col" key={index}>
              <div
                className="p-4 h-100 rounded-4"
                style={{
                  backgroundColor: "#ffffff",
                  border: "2px solid #003366", // Dark Blue Border
                }}
              >
                {/* Difficulty badge */}
                <span
                  className={`badge mb-3 px-3 py-2 rounded-pill fw-medium ${levelColor}`}
                >
                  {level}
                </span>

                {/* Title */}
                <h4 className="fw-bold text-dark">{path.title}</h4>

                {/* Description */}
                <p className="text-muted">{path.description}</p>

                {/* Skills */}
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {path.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="badge rounded-pill bg-light border text-dark px-3 py-2"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}



export default function ProjectIdea() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (sessionStorage.getItem("userKnowledge")) {
        try {
          const userKnowledge = JSON.parse(
            sessionStorage.getItem("userKnowledge")
          );
          console.log("User Knowledge:", userKnowledge);

          const result = await getResult(
            userKnowledge.lang,
            userKnowledge.framework
          );
          console.log("Paths Data:", result);

          if (result.length > 0) {
            setData(result);
          } else {
            console.error("No paths found.");
            setError("No paths found.");
          }
        } catch (err) {
          console.error("Error fetching data:", err);
          setError("Error fetching data.");
        }
      } else {
        console.error("No user knowledge found in sessionStorage.");
        setError("No user knowledge found.");
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <Error message={error} />
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-8 sm:px-16 w-screen">
      <div className="flex flex-col items-center h-full gap-10 justify-center">
        {data ? <Result paths={data} /> : <Loading />}
      </div>
    </main>
  );
}
