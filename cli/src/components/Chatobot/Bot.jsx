import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "bootstrap/dist/css/bootstrap.min.css";

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const Bot = ({ context }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedInput = useDebounce(inputText, 700);
  const isFirstRun = useRef(true);

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
  };

  // Send message to backend proxy
  const sendMessage = async (messageText) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: messageText }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Unknown error");

      const botMessage = {
        text: data.response, // <--- Important fix here, match backend response key
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: "⚠️ Failed to connect to chatbot. Try again later.",
          sender: "bot",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedInput = inputText.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage = {
      text: trimmedInput,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    sendMessage(trimmedInput);
  };

  const handleReset = () => {
    setMessages([]);
  };

  const renderMessage = (message) => {
    if (message.sender === "user") {
      return <div>{message.text}</div>;
    }
    return (
      <ReactMarkdown components={components} className="markdown-content">
        {message.text}
      </ReactMarkdown>
    );
  };

  return (
    <div className="chatbot-container">
      <button
        className="chat-toggle-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle chat"
      >
        {isOpen ? "×" : "🤖"}
      </button>

      <div className={`chat-window ${isOpen ? "open" : ""}`}>
        <div className="card shadow rounded-4 overflow-hidden">
          <div
            className="card-header text-white d-flex justify-content-between align-items-center"
            style={{
              background: "linear-gradient(135deg, #56CCF2 0%, #2F80ED 100%)",
              color: "white",
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <span role="img" aria-label="bot" style={{ fontSize: "1.5rem" }}>
                🤖
              </span>
              <h5 className="mb-0 fw-bold">SmartPath Buddy</h5>
            </div>
            <button
              onClick={handleReset}
              className="btn btn-sm btn-outline-light"
              title="Reset Chat"
              aria-label="Reset chat"
            >
              ⟳
            </button>
          </div>

          <div className="card-body chat-messages">
            {messages.length === 0 && (
              <div className="text-center text-muted my-4">
                Ask me anything to get started!
              </div>
            )}
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`d-flex ${
                  message.sender === "user"
                    ? "justify-content-end"
                    : "justify-content-start"
                } mb-3`}
              >
                <div
                  className={`p-3 rounded-4 shadow-sm ${
                    message.sender === "user"
                      ? "bg-primary text-white"
                      : "bg-light"
                  }`}
                  style={{ maxWidth: "75%" }}
                >
                  {renderMessage(message)}
                  <div
                    className={`small mt-2 text-end ${
                      message.sender === "user" ? "text-white" : "text-muted"
                    }`}
                    style={{ fontSize: "0.75rem" }}
                  >
                    {message.timestamp}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="d-flex justify-content-start mb-3">
                <div className="bg-light p-2 rounded-3 typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
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
                  aria-label="Chat input"
                />
        
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  aria-label="Send message"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .chatbot-container {
          position: fixed;
          bottom: 20px;
          right: 35px;
          z-index: 9999;
        }
        .chat-toggle-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #56CCF2 0%, #2F80ED 100%);
          color: white;
          font-size: 30px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(43, 117, 255, 0.6);
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        .chat-toggle-btn:hover {
          transform: scale(1.1) rotate(15deg);
        }
        .chat-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 380px;
          max-height: 80vh;
          border-radius: 16px;
          box-shadow: 0 4px 14px rgba(43, 117, 255, 0.6);
          overflow: hidden;
          opacity: 0;
          pointer-events: none;
          transform: translateY(30px);
          transition: opacity 0.4s ease, transform 0.4s ease;
          background: #fff;
        }
        .chat-window.open {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }
        .chat-messages {
          height: 360px;
          overflow-y: auto;
          background: #fafafa;
          padding: 10px;
        }
        .typing-indicator {
          display: flex;
          gap: 6px;
        }
        .typing-indicator span {
          width: 8px;
          height: 8px;
          background-color: #3b82f6;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out;
        }
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        .markdown-content code {
          background-color: rgba(0, 0, 0, 0.75);
          color: #fff;
          padding: 0.25em 0.4em;
          border-radius: 0.3rem;
        }
      `}</style>
    </div>
  );
};

export default Bot;
