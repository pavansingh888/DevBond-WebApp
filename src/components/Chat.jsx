import React, { useEffect, useRef, useState } from "react";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
// import { removeFeed } from "../utils/feedSlice";
import { removeAllRequests } from "../utils/requestsSlice";
import { removeConnections } from "../utils/connectionsSlice";

const Chat = () => {
  
  const [messages, setMessages] = useState(
    null
    // {
    //   senderId: 1,
    //   firstName: "other",
    //   lastName: "other",
    //   text: "Hi! How are you?",
    // }
  );
  const [newMessage, setNewMessage] = useState("");
  const navigate=useNavigate();

  //fetch message on component mount
  const fetchChatMessages = async () => {
    try {

      const response = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });

      const chatMessages = response?.data?.messages.map((msg) => {
        const { senderId, text, createdAt, updatedAt } = msg;
        return {
          senderId: senderId?._id,
          firstName: senderId?.firstName,
          lastName: senderId?.lastName,
          photoUrl: senderId?.photoUrl,
          text,
          createdAt,
          updatedAt,
        };
      });
      setMessages(chatMessages);
      
    } catch (error) {
      if (error.response && error.response.status === 403) {
        navigate('/premium'); //redirect to the premium page
      } else if(error.response && error.response.status === 401){
        dispatch(removeUser());
        // dispatch(removeFeed());
        dispatch(removeAllRequests());
        dispatch(removeConnections());
        navigate('/login')
      }else{
        console.error("Error fetching chat messages:", error);
      }
    }
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchChatMessages();
  }, []);

  const params = useParams();
  const targetUserId = params.targetUserId;
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  useEffect(() => {
    //don’t create socket connection if userId is not there.
    if (!userId) {
      return;
    }
    //ASA page load we are creating a socket connection, and we get this socket object here which we can use to emit events
    const socket = createSocketConnection(); //whenever we are making a socket connection like this, make sure you are disconnecting the socket also #VERYIMP
    //so at the BE joinChat, sendMessage, disconnect events we just configured, therefore we can emit the same events from this socket
    //we can give it a userID , or we can give it a room where we can basically join, basically it needs some place to send your data to backend
    //we will give it targetUserId and existingUserId who is logged in
    socket.emit("joinChat", { userId, targetUserId });

    //listen to “messageRecieved” event on the client i.e frontend
    socket.on("messageRecieved", ({ senderId, firstName, lastName, text, createdAt }) => {
      console.log(firstName + " : " + text);
      createdAt = formatTime(createdAt);
      setMessages((messages) => [
        ...messages,
        { senderId, firstName, lastName, text, createdAt },
      ]);
    });

    {
      /* clean up */
    }
    // We cannot leave the socket connection empty, cleanup of this event is neccassary, otherwise we will loose socket connections here and there
    return () => {
      //we will disconnect the socket whenever the component unmounts
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
      });
    }
  }, [messages]);

  const chatPerson = useSelector(
    (store) =>
      store.connections.filter(
        (connection) => connection._id === targetUserId
      )[0]
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      //socket connection we have created inside useEffect, we cannot use it outside, so we can create another socket connection
      const socket = createSocketConnection();

      socket.emit("sendMessage", {
        firstName: user?.firstName,
        lastName: user?.lastName,
        photoUrl: user?.photoUrl,
        userId,
        targetUserId,
        text: newMessage,
        createdAt: new Date().toISOString(),
      });
      setNewMessage("");
    }
  };

  const formatTime = (utcDate) => {
    const date = new Date(utcDate);
    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      // weekday: "short",  
      day: "2-digit",  
      month: "short",   
      // year: "numeric",   
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,   
    });
  };


  


  return (<div className="bg-slate-200 py-8">
      {messages ? (
    <div className="h-[80vh] bg-cyan-50 flex flex-col my-8 mx-auto  border-2 overflow-hidden rounded-lg w-11/12 md:w-1/2">
      {/* Chat Header */}
      <div className="bg-blue-600 text-white px-6 py-4 flex items-center shadow-md ">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full mr-4 border-2 border-cyan-400">
          <img src={chatPerson.photoUrl} alt="Profile" />
        </div>
        </div>

        <h1 className="text-lg font-semibold">
          {chatPerson.firstName + " " + chatPerson.lastName}
        </h1>
      </div>

      {/* Chat Messages */}
      <div 
      className="flex-grow overflow-y-auto px-4 py-6 bg-cyan-50"
      ref={containerRef}
      >
        {messages.map((message, index, messages) => (
          <div
            key={index}
            className={`chat  ${
              message.senderId === userId ? "chat-end " : " chat-start"
            } my-4`}
          >
            {/* Avatar */}
            <div className="chat-image avatar">
              <div className="w-8 rounded-full border-2 border-emerald-500">
                <img
                  alt="Chat avatar"
                  src={
                    message.senderId === userId
                      ? user.photoUrl
                      : chatPerson.photoUrl
                  }
                />
              </div>
            </div>

            {message.senderId !== userId ? (
              <div className="chat-header">
                {`${message.firstName} ${message.lastName}`}
                <time className="text-xs opacity-50"> {formatTime(message.createdAt)} </time>
              </div>
            ) : (
              <div className="chat-header">
                <time className="text-xs opacity-50"> {formatTime(message.createdAt)} </time>
              </div>
            )}

            {/* Chat Bubble */}
            <div
              className={`chat-bubble px-4 py-2 rounded-lg shadow-md ${
                message.senderId === userId
                  ? "bg-emerald-500 text-white"
                  : "bg-blue-100 text-blue-900"
              }`}
            >
              {message.text}
            </div>

            {/* <div className="chat-footer opacity-50">Delivered</div> */}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-blue-600 px-4 py-4 flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newMessage.trim()) {
              handleSendMessage();
            }
          }}
          placeholder="Type a message..."
          className="w-full px-4 py-3 rounded-md bg-cyan-50 text-blue-900 placeholder-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 mr-4"
        />
        <button
          onClick={handleSendMessage}
          className="btn btn-success text-white px-6 py-3 rounded-lg bg-emerald-500 hover:bg-cyan-400 transition-all"
        >
          Send
        </button>
      </div>
    </div>
  ) : (
    <div className="h-[80vh] bg-cyan-50 flex flex-col my-8 mx-auto border-2 overflow-hidden rounded-lg w-11/12 md:w-1/2">
      {/* Chat Header Shimmer */}
      <div className="bg-blue-600 text-white px-6 py-4 flex items-center shadow-md animate-pulse">
        <div className="chat-image avatar">
          <div className="w-10 h-10 rounded-full mr-4 bg-gray-300"></div>
        </div>
        <div className="w-32 h-4 bg-gray-300 rounded-md"></div>
      </div>

      {/* Chat Messages Shimmer */}
      <div className="flex-grow overflow-y-auto px-4 py-6 bg-cyan-50">
        {[...Array(5)].map((_, index) => (
          <div key={index} className={`chat my-4 ${index % 2 === 0 ? "chat-start" : "chat-end"} animate-pulse`}>
            
          </div>
        ))}
      </div>

      {/* Message Input Shimmer */}
      <div className="bg-blue-600 px-4 py-4 flex items-center animate-pulse">
        <div className="w-full h-10 bg-gray-300 rounded-md mr-4"></div>
        <div className="w-20 h-10 bg-gray-400 rounded-lg"></div>
      </div>
    </div>
  )};
  </div>)
}

export default Chat;
