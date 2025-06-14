import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "bootstrap/dist/css/bootstrap.min.css";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI("AIzaSyB8UqNYSxTM9tgt2IJ3X_eeMb7J3SeYNok");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const Bot = ({ context }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [chat, setChat] = useState(model.startChat());

  // Custom components for ReactMarkdown
  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    // Style other markdown elements
    p: ({ children }) => <p className="mb-2">{children}</p>,
    h1: ({ children }) => <h1 className="h5 mb-3">{children}</h1>,
    h2: ({ children }) => <h2 className="h6 mb-2">{children}</h2>,
    ul: ({ children }) => <ul className="mb-3 ps-4">{children}</ul>,
    ol: ({ children }) => <ol className="mb-3 ps-4">{children}</ol>,
    li: ({ children }) => <li className="mb-1">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-start border-3 ps-3 ms-3 my-3 text-muted">
        {children}
      </blockquote>
    ),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      text: inputText,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInputText("");

    try {
      const additionalContext = context
        ? `Context: ${context}\n\nProvide a detailed and structured response for the following input as you were Doctor:`
        : "Provide a detailed and structured response for the following input";

      const result = await chat.sendMessage(
        `${additionalContext}\n\n${inputText}`
      );
      const response = await result.response;
      const botMessage = {
        text: response.text(),
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error("Gemini API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setChat(model.startChat());
  };

  const renderMessage = (message) => {
    if (message.sender === "user") {
      return <div className="mb-1">{message.text}</div>;
    }
    return (
      <ReactMarkdown components={components} className="markdown-content">
        {message.text}
      </ReactMarkdown>
    );
  };

  return (
    <div className="chatbot-container">
      <button className="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z" />
          </svg>
        )}
      </button>

      <div className={`chat-window ${isOpen ? "open" : ""}`}>
        <div className="card">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h3 className="mb-0">Bot</h3>
            <button
              className="btn btn-sm btn-outline-light"
              onClick={handleReset}
              title="Reset Chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
              </svg>
            </button>
          </div>

          <div className="card-body chat-messages">
            {messages.length === 0 && (
              <div className="text-center text-muted my-4">
                Start a conversation!
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`d-flex ${
                  message.sender === "user"
                    ? "justify-content-end"
                    : "justify-content-start"
                } mb-3`}
              >
                <div
                  className={`p-3 rounded-3 message-bubble ${
                    message.sender === "user"
                      ? "bg-primary text-white"
                      : "bg-light border"
                  }`}
                >
                  {renderMessage(message)}
                  <small
                    className={
                      message.sender === "user" ? "text-white" : "text-muted"
                    }
                    style={{ fontSize: "0.75rem" }}
                  >
                    {message.timestamp}
                  </small>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="d-flex justify-content-start mb-3">
                <div className="bg-light border p-3 rounded-3">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="card-footer bg-white">
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type your message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>
        {`
          .chatbot-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
          }

          .chat-toggle-btn {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background-color: #0d6efd;
            border: none;
            color: white;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s ease;
          }

          .chat-toggle-btn:hover {
            transform: scale(1.1);
          }

          .chat-window {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 400px;
            opacity: 0;
            transform: translateY(20px);
            pointer-events: none;
            transition: all 0.3s ease;
          }

          .chat-window.open {
            opacity: 1;
            transform: translateY(0);
            pointer-events: all;
          }

          .chat-messages {
            height: 400px;
            overflow-y: auto;
          }

          .message-bubble {
            max-width: 85%;
          }

          .markdown-content {
            font-size: 0.95rem;
          }

          .markdown-content p:last-child {
            margin-bottom: 0.5rem;
          }

          .markdown-content pre {
            margin: 0.5rem 0;
            border-radius: 0.375rem;
            max-width: 100%;
            overflow-x: auto;
          }

          .markdown-content code {
            font-size: 0.875rem;
            padding: 0.2em 0.4em;
            border-radius: 0.25rem;
            background-color: rgba(0, 0, 0, 0.05);
          }

          .typing-indicator {
            display: flex;
            gap: 4px;
          }
          
          .typing-indicator span {
            width: 8px;
            height: 8px;
            background-color: #90949c;
            border-radius: 50%;
            animation: bounce 1.4s infinite ease-in-out;
          }
          
          .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
          .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
          
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }

          @media (max-width: 576px) {
            .chat-window {
              width: calc(100vw - 40px);
              right: -20px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Bot;
