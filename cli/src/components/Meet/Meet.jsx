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
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <h2>Create or Join a Room</h2>
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
          style={{ padding: 8, marginRight: 10, width: '70%' }}
        />
      </div>
      <form onSubmit={handleCreateRoom} style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter room name"
          style={{ padding: 8, marginRight: 10, width: '70%' }}
        />
        <button type="submit" style={{ padding: 8 }}>Create Room</button>
      </form>
      <h3>Available Rooms</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {rooms.length === 0 ? (
        <p>No rooms available</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {rooms.map((room, i) => (
            <li key={i} style={{ margin: '5px 0' }}>
              <button 
                onClick={() => handleJoinRoom(room)}
                style={{ padding: 8, width: '100%', textAlign: 'left' }}
              >
                {room}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Meet;
