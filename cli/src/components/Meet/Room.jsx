import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import io from 'socket.io-client';

const Room = () => {
  const { roomId } = useParams();
  const query = new URLSearchParams(useLocation().search);
  const userName = query.get('name');
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [joined, setJoined] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:3000', {
      withCredentials: true,
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      setConnectionStatus('connected');
    });

    socketRef.current.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setConnectionStatus('error');
    });

    socketRef.current.on('chat-message', (data) => {
      setMessages(prev => [
        ...prev,
        { sender: data.name, text: data.message, timestamp: new Date() }
      ]);
    });

    socketRef.current.on('user-connected', (username) => {
      setMessages(prev => [
        ...prev,
        {
          sender: 'System',
          text: `${username} joined the room`,
          timestamp: new Date()
        }
      ]);
      setUsers(prev => {
        if (!prev.includes(username)) return [...prev, username];
        return prev;
      });
    });

    socketRef.current.on('user-disconnected', (username) => {
      setMessages(prev => [
        ...prev,
        {
          sender: 'System',
          text: `${username} left the room`,
          timestamp: new Date()
        }
      ]);
      setUsers(prev => prev.filter(user => user !== username));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [roomId]);

  useEffect(() => {
    if (userName && connectionStatus === 'connected' && !joined) {
      socketRef.current.emit('new-user', roomId, userName);
      setJoined(true);
      setUsers(prev => {
        if (!prev.includes(userName)) return [...prev, userName];
        return prev;
      });
      setMessages(prev => [
        ...prev,
        {
          sender: 'System',
          text: `You joined the room as ${userName}`,
          timestamp: new Date()
        }
      ]);
    }
  }, [userName, roomId, connectionStatus, joined]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socketRef.current.emit('send-chat-message', roomId, message.trim());
      setMessages(prev => [
        ...prev,
        { sender: userName, text: message.trim(), timestamp: new Date() }
      ]);
      setMessage('');
    }
  };

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <div>
          <h2 style={styles.roomTitle}>Room: {roomId}</h2>
          <div style={styles.subInfo}>
            <span>Status: <strong>{connectionStatus}</strong></span> | 
            <span> Online ({users.length}): {users.join(', ')}</span>
          </div>
        </div>
      </header>

      <div style={styles.messagesContainer}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.sender === userName ? 'flex-end' : 'flex-start',
              backgroundColor:
                msg.sender === 'System'
                  ? '#f0f4f8'
                  : msg.sender === userName
                  ? '#cce5ff'
                  : '#f8f9fa',
            }}
          >
            <div style={styles.senderName}>
              {msg.sender}
            </div>
            <div>{msg.text}</div>
            <div style={styles.timestamp}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      <form style={styles.form} onSubmit={handleSendMessage}>
        <input
          style={styles.messageInput}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button style={styles.sendButton} type="submit">
          ➤
        </button>
      </form>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '900px',
    height: '90vh',
    margin: '20px auto',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 6px 30px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  header: {
    padding: '15px 20px',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#f7fafd'
  },
  roomTitle: {
    margin: 0,
    color: '#007acc'
  },
  subInfo: {
    fontSize: '0.85em',
    color: '#555',
    marginTop: '4px'
  },
 messagesContainer: {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: '20px',
  overflowY: 'auto',
  background: `
    linear-gradient(135deg, rgba(247, 251, 255, 0.95), rgba(234, 246, 255, 0.95)),
    url('/logo.jpg')
  `,
 
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
 },
  message: {
    maxWidth: '70%',
    padding: '10px 14px',
    marginBottom: '10px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    wordBreak: 'break-word'
  },
  senderName: {
    fontWeight: 'bold',
    marginBottom: '4px',
    fontSize: '0.9em',
    color: '#333'
  },
  timestamp: {
    textAlign: 'right',
    fontSize: '0.75em',
    color: '#888',
    marginTop: '4px'
  },
  form: {
    display: 'flex',
    padding: '12px 20px',
    borderTop: '1px solid #e0e0e0',
    backgroundColor: '#fafafa'
  },
  messageInput: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    outline: 'none',
    fontSize: '1em'
  },
  sendButton: {
    marginLeft: '10px',
    padding: '10px 16px',
    backgroundColor: '#007acc',
    border: 'none',
    borderRadius: '50%',
    color: '#fff',
    fontSize: '1.2em',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  }
};

export default Room;
