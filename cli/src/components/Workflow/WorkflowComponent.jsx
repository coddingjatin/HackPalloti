import WorkflowWebDev from "./WorkflowComponent3";
import WorkflowAI from "./WorkflowComponent2";
import WorkflowBlockchain from "./WorkflowComponent4";

export default function WorkflowWrapper() {
  return (
    <div className="container mt-5">
      <h1 className="text-center fw-bold">All Learning Paths</h1>
      <hr />

      <h2 className="fw-semibold text-primary mt-4">🌐Artificial Intelligence</h2>
      <WorkflowWebDev />

      <h2 className="fw-semibold text-success mt-5">🤖 Web Development  </h2>
      <WorkflowAI />

      <h2 className="fw-semibold mt-6" style={{ color: "#6f42c1" }}>🔗 Data Science</h2>
      <WorkflowBlockchain />
    </div>
  );
}
