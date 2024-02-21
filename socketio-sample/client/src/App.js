import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { JoinRoom } from './joinRoom';

// It's generally a good practice to establish the socket connection inside useEffect
// or in a specific context to avoid multiple connections in a React application
const socket = io(); // Connect to server

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const receiveMessage = (msg) => {
      console.log('Received message:', msg);
      setMessages((messages) => [...messages, msg]);
    };

    socket.on('chat message', receiveMessage);

    // Cleanup this effect on component unmount
    return () => {
      socket.off('chat message', receiveMessage);
    };
  }, []);



  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit('chat message', { msg: message });
      setMessage('');
    }
  };




  return (
    <div className="container py-5">
      <div className="chat-box bg-light p-3 rounded border">
        <div className="messages" style={{ height: '300px', overflowY: 'auto' }}>
          {messages.map((msg, index) => (
            <div key={index} className="p-2 border-bottom">{`${msg.msg}`}</div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="mt-3 d-flex">
          <input
            type="text"
            className="form-control"
            placeholder="Enter your message..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }
            }
          />
          <button type="submit" className="btn btn-primary ml-2">Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
