import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Meet = () => {
  const [userName, setUserName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get('http://localhost:3000/rooms');
        setRooms(Object.keys(res.data));
      } catch (err) {
        setError('Failed to fetch rooms');
        console.error(err);
      }
    };
    fetchRooms();
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!userName.trim()) {
      alert('Please enter your name first!');
      return;
    }
    if (!roomName.trim()) {
      alert('Please enter a room name');
      return;
    }
    try {
      const res = await axios.post('http://localhost:3000/room', { room: roomName.trim() });
      if (res.data.success) {
        navigate(`/room/${encodeURIComponent(roomName.trim())}?name=${encodeURIComponent(userName.trim())}`);
      } else {
        alert(res.data.error || 'Error creating room');
      }
    } catch (err) {
      alert('Error creating room');
      console.error(err);
    }
  };

  const handleJoinRoom = (room) => {
    if (!userName.trim()) {
      alert('Please enter your name first!');
      return;
    }
    navigate(`/room/${encodeURIComponent(room)}?name=${encodeURIComponent(userName.trim())}`);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#ffffff'
    }}>
      <div style={{
        display: 'flex',
        background: '#f9fbfd',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '80%',
        maxWidth: '1000px',
        minHeight: '500px'
      }}>
        <div style={{ flex: 1, padding: '30px', backgroundColor: '#fff' }}>
          <h1 style={{ marginBottom: '10px', color: '#007acc' }}>Create Room</h1>
          <p style={{ color: '#555', marginBottom: '20px' }}>
            <b>Create your virtual space — connect, collaborate, and converse</b>
          </p>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="e.g. My Personal Room"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #b3d9f7',
              marginBottom: '15px',
              backgroundColor: '#ffffff',
              color: '#333'
            }}
          />
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #b3d9f7',
              marginBottom: '15px',
              backgroundColor: '#ffffff'
              , color: '#333'
            }}
          />
          <button
            onClick={handleCreateRoom}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#3399ff'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#4da6ff'}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#4da6ff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              color: '#fff',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            Continue
          </button>
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ color: '#007acc' }}>Available Rooms</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {rooms.length === 0 ? (
              <p style={{ color: '#999' }}>No rooms available</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {rooms.map((room, i) => (
                  <li key={i} style={{ marginBottom: '8px' }}>
                    <button
                      onClick={() => handleJoinRoom(room)}
                      onMouseOver={e => e.currentTarget.style.backgroundColor = '#e6f2fb'}
                      onMouseOut={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #b3d9f7',
                        borderRadius: '6px',
                        textAlign: 'left',
                        backgroundColor: '#ffffff',
                        color: '#007acc',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                      }}
                    >
                      {room}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div style={{
          flex: 1,
          backgroundImage: 'url("/Back.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          {/* Empty div because the image is set as background */}
        </div>
      </div>
    </div>
  );
};

export default Meet;
