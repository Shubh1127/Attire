import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('https://supply-chain-igtk.onrender.com');

export const useChat = ({ senderId, receiverId, roomId }) => {
  // const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (roomId) {
      socket.emit('joinRoom', { roomId });
    }

    // socket.on('receiveMessage', (message) => {
    //   setMessages((prev) => [...prev, message]);
    // });

    // return () => {
    //   socket.off('receiveMessage');
    // };
  }, [roomId]);

  const sendMessage = () => {

    if (newMessage.trim() && roomId) {
      const message = {
        roomId,
        senderId,
        receiverId,
        message: newMessage,
      };
      socket.emit('sendMessage', message);
      // setMessages((prev) => [...prev, message]);
      setNewMessage('');
    }
  };

  // const fetchPreviousMessages = async () => {
  //   try {
  //     const response = await fetch(`https://supply-chain-igtk.onrender.com/messages/${roomId}`);
  //     const data = await response.json();
  //     setMessages(data.messages);
  //   } catch (error) {
  //     console.error('Error fetching previous messages:', error);
  //   }
  // };

  // useEffect(() => {
  //   if (roomId) {
  //     fetchPreviousMessages();
  //   }
  // }, [roomId]);

  return {
    newMessage,
    setNewMessage,
    sendMessage,
  };
};
export default useChat;