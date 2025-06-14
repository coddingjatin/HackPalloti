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
    // Connect to the Socket.io server
    socketRef.current = io('http://localhost:3000', {
      // If not needed, try setting withCredentials to false
      withCredentials: true,
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      setConnectionStatus('connected');
      console.log('Connected to server');
    });

    socketRef.current.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setConnectionStatus('error');
    });

    // Listen for chat messages from other users
    socketRef.current.on('chat-message', (data) => {
      setMessages(prev => [
        ...prev,
        { sender: data.name, text: data.message, timestamp: new Date() }
      ]);
    });

    // Listen for a new user connection
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

    // Listen for a user disconnection
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
    <div style={styles.container}>
      <h2>Room: {roomId}</h2>
      <p>Connection status: {connectionStatus}</p>
      <div style={styles.userList}>
        <strong>Online ({users.length}): </strong>
        {users.join(', ')}
      </div>
      <div style={styles.messagesContainer}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: msg.sender === userName ? 'flex-end' : 'flex-start',
              backgroundColor:
                msg.sender === 'System'
                  ? '#e6f7ff'
                  : msg.sender === userName
                  ? '#d9f7be'
                  : '#f5f5f5',
            }}
          >
            <strong>{msg.sender}: </strong>
            {msg.text}
            <small style={styles.timestamp}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </small>
          </div>
        ))}
      </div>
      <form style={styles.form} onSubmit={handleSendMessage}>
        <input
          style={styles.messageInput}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button style={styles.sendButton} type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  userList: {
    color: '#666',
    fontSize: '0.9em',
    marginBottom: '10px'
  },
  messagesContainer: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    overflowY: 'auto',
    height: '60vh',
    marginBottom: '10px'
  },
  message: {
    marginBottom: '10px',
    padding: '8px',
    borderRadius: '4px'
  },
  timestamp: {
    color: '#999',
    marginLeft: '10px',
    fontSize: '0.8em'
  },
  form: {
    display: 'flex',
    gap: '10px'
  },
  messageInput: {
    flex: 1,
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd'
  },
  sendButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default Room;
