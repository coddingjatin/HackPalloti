"use client";
import { Workflow } from "lucide-react";
import React, { useState, useCallback, useRef } from "react";
import { ForceGraph2D } from "react-force-graph";

const PictoComponent = () => {
  const [topic, setTopic] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const fgRef = useRef();
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);

  const convertToGraphData = (roadmapData) => {
    const nodes = [];
    const links = [];
    let nodeId = 0;

    nodes.push({
      id: nodeId,
      name: topic,
      level: 0,
      color: "#10b981",
      size: 15,
      group: "main",
    });

    if (roadmapData.prerequisites?.length) {
      roadmapData.prerequisites.forEach((prereq) => {
        nodeId++;
        nodes.push({
          id: nodeId,
          name: prereq,
          level: 1,
          color: "#007bff",
          size: 8,
          group: "prerequisite",
        });
        links.push({
          source: 0,
          target: nodeId,
          color: "#93c5fd",
          width: 2,
        });
      });
    }

    roadmapData.stages.forEach((stage) => {
      nodeId++;
      const stageNodeId = nodeId;
      nodes.push({
        id: stageNodeId,
        name: stage.name,
        level: 1,
        color: "#f59e0b",
        size: 9,
        group: "stage",
      });
      links.push({
        source: 0,
        target: stageNodeId,
        color: "#fcd34d",
        width: 3,
      });

      stage.concepts.forEach((concept) => {
        nodeId++;
        nodes.push({
          id: nodeId,
          name: concept,
          level: 2,
          color: "#dc3545",
          size: 7,
          group: "concept",
        });
        links.push({
          source: stageNodeId,
          target: nodeId,
          color: "#f9a8d4",
          width: 1,
        });
      });
    });

    return { nodes, links };
  };

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/quiz/pictoflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await response.json();
      if (data.success) {
        setRoadmap(data.roadmap);
        setGraphData(convertToGraphData(data.roadmap));
      }
    } catch (error) {
      console.error("Error fetching roadmap:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid mt  px-3 w-100">
      <div className="card shadow-sm">
        <div className="card-header text-center">
          <h3 className="mb-0">Interactive Learning Roadmap</h3>
        </div>
        <div className="card-body">
          <div className="row g-2 mb-3">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a topic..."
              />
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-dark w-100"
                onClick={fetchRoadmap}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Generating...
                  </>
                ) : (
                  "Generate Roadmap"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {graphData.nodes.length > 0 && (
        <div className="row mt-4">
          {/* Graph Section */}
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body p-0">
                <ForceGraph2D
                  ref={fgRef}
                  graphData={graphData}
                  nodeLabel="name"
                  linkDirectionalParticles={hoverNode ? 4 : 2}
                  linkDirectionalParticleSpeed={0.005}
                  width={500}
                  height={500}
                  // Highlight Nodes & Links
                  nodeCanvasObject={(node, ctx, globalScale) => {
                    const label = node.name;
                    const fontSize = 14 / globalScale;

                    ctx.font = `${fontSize}px Sans-Serif`;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";

                    // Highlighted node effect
                    if (highlightNodes.has(node.id)) {
                      ctx.shadowBlur = 20;
                      ctx.shadowColor = "#ffcc00";
                    } else {
                      ctx.shadowBlur = 0;
                    }

                    // Set node color and size
                    ctx.fillStyle = highlightNodes.has(node.id)
                      ? "#ffcc00"
                      : node.color;
                    ctx.beginPath();
                    ctx.arc(
                      node.x,
                      node.y,
                      node.size * (highlightNodes.has(node.id) ? 1.8 : 1),
                      0,
                      2 * Math.PI,
                      false
                    );
                    ctx.fill();

                    // Node label
                    ctx.fillStyle = "black";
                    ctx.fillText(label, node.x, node.y + 12);
                  }}
                  // Highlight Links
                  linkCanvasObjectMode={() => "after"}
                  linkCanvasObject={(link, ctx) => {
                    ctx.strokeStyle = highlightLinks.has(link)
                      ? "#ffcc00"
                      : link.color;
                    ctx.lineWidth = highlightLinks.has(link) ? 3 : link.width;

                    ctx.beginPath();
                    ctx.moveTo(link.source.x, link.source.y);
                    ctx.lineTo(link.target.x, link.target.y);
                    ctx.stroke();
                  }}
                  // Center View on Highlighted Node
                  onNodeHover={(node) => {
                    if (node) {
                      setHoverNode(node.id);

                      // Set highlighted nodes & links
                      setHighlightNodes(
                        new Set([
                          node.id,
                          ...graphData.links
                            .filter(
                              (l) =>
                                l.source.id === node.id ||
                                l.target.id === node.id
                            )
                            .map((l) =>
                              l.source.id === node.id
                                ? l.target.id
                                : l.source.id
                            ),
                        ])
                      );
                      setHighlightLinks(
                        new Set(
                          graphData.links.filter(
                            (l) =>
                              l.source.id === node.id || l.target.id === node.id
                          )
                        )
                      );

                      // Smooth transition to center the node
                      if (fgRef.current) {
                        fgRef.current.centerAt(node.x, node.y, 1000);
                        fgRef.current.zoom(1.5, 1000);
                      }
                    } else {
                      setHoverNode(null);
                      setHighlightNodes(new Set());
                      setHighlightLinks(new Set());

                      // Reset zoom & position
                      if (fgRef.current) {
                        fgRef.current.zoomToFit(1000);
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Detailed Resources Section */}
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header">
                <h5>Detailed Resources</h5>
              </div>
              <div
                className="card-body"
                style={{ maxHeight: "500px", overflowY: "auto" }}
              >
                {roadmap?.stages.map((stage, index) => (
                  <div key={index} className="mb-3">
                    <h6 className="mb-1">
                      {stage.name}{" "}
                      <span className="badge bg-secondary">
                        {stage.duration}
                      </span>
                    </h6>
                    <p className="text-muted">{stage.description}</p>

                    <strong>Key Concepts:</strong>
                    <div className="d-flex flex-wrap gap-2 mb-2">
                      {stage.concepts.map((concept, i) => (
                        <span key={i} className="badge bg-light text-dark">
                          {concept}
                        </span>
                      ))}
                    </div>

                    <strong>Resources:</strong>
                    <ul className="list-unstyled">
                      {stage.resources.map((resource, i) => (
                        <li key={i}>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {resource.name}
                          </a>{" "}
                          <span className="badge bg-info">{resource.type}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PictoComponent;
