import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams  } from "react-router-dom";
import ParticlesComponent from "../components/ParticlesComponent";
import axios from "axios";
import io from "socket.io-client";


export default function Chat() {
    const { groupId } = useParams(); 
    const backend = "http://localhost:8089";
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [typing, setTyping] = useState("");
    const [groupData, setGroupData] = useState({});
    const socket = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        const user = localStorage.getItem("username"); // Retrieve the username from localStorage

        if (token) { // Check if the token exists
            socket.current = io(backend, {
                auth: {
                    token: token, // Pass the token in the headers for authentication
                },
            });

            const fetchData = async () => {
                setLoading(true);

                try {
                    const response = await axios.get(`${backend}/group/${groupId}/messages`, {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}` // Include the token in the request headers
                        }
                    });

                    if (response.status === 200) {
                        const data = response.data;
                        // console.log("Messages: ", data);
                        const mymsg = data.map((msg) => msg.message);
                        console.log("Messages: ", mymsg);
                        //  sender = data.map((constmsg) => msg.sender.username);
                        // console.log("Sender: ", sender);
                        setMessages(mymsg);
                    } else {
                        console.error("Failed to fetch messages");
                    }
                    const groupName = await axios.get(`${backend}/group/${groupId}`, {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}` // Include the token in the request headers
                        }
                    });

                    if (groupName.status === 200) {
                        const groupNameData = groupName;
                        setGroupData(groupNameData);
                    }

                } catch (error) {
                    console.error("Error fetching messages:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();

            // Listen for new messages
            socket.current.on("message", (newMessage) => {
                console.log("New message:", newMessage);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });

            // Listen for typing
            socket.current.on("type", (user) => {
                // console.log("Typing:", user);
                setTyping(user, " is typing ...");
            });

            socket.current.on("stopTyping", () => {
                setTyping("");
            });

            // Cleanup on component unmount
            return () => {
                socket.current.disconnect();
            };
        }
    }, [groupId, backend]);

    useEffect(() => {

        if(!groupData || !groupData.data) return;
        const username = localStorage.getItem("username"); // Retrieve the username from localStorage
        const userId = localStorage.getItem("id"); // Retrieve the userId from localStorage
        console.log("Joining room:", groupData.data.name);
        socket.current.emit("joinRoom", { username: username, userId: userId, room: groupData.data.name, groupId: groupId, token: localStorage.getItem("token")});

    }, [groupData]);
    

    const handleSendMessage = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        const userId = localStorage.getItem("id"); // Retrieve the userId from localStorage
    

        if (token) { // Check if the token exists
            try {
                console.log("Sending message:", newMessage);
                socket.current.emit("chatMessage",
                    { message: newMessage, sender: userId, group: groupId }, groupData.data.name);
                setNewMessage("");
                setTyping("");

            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };


    const handleChange = (e) => {
        const message = e.target.value;
        setNewMessage(message);

        const username = localStorage.getItem("username"); // Retrieve the username from localStorage
        socket.current.emit(`typing`, { room: groupData.data.name, username: username}); // Emit typing event with the username

        if (message === "") {
            socket.current.emit(`stopTyping`, { room: groupData.data.name }); // Emit stopTyping event
        }
    };

    // user leaves the room upadte the database
    const handleLeaveRoom = async () => {
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        const userId = localStorage.getItem("id"); // Retrieve the userId from localStorage
        try {
    
            const username = localStorage.getItem("username"); // Retrieve the username from localStorage
            socket.current.emit("leaveRoom", { user: userId, username: username, groupId: groupId, name: groupData.data.name });

            console.log("Left the room");
            navigate("/dashboard");

        } catch (error) {
            console.error("Error leaving the room:", error);
        }
    };


    return (
        <div>
            <div className="flex items-start justify-start pl-5 py-4 text-gray-500 bg-[#282828] ">
                <h1 className="text-4xl font-bold">Chat</h1>
            </div>

            <div className="container mx-auto min-h-screen min-w-full">
                <ParticlesComponent />

                <div className="flex items-center justify-center min-h-screen min-w-full px-5">
                
                    <div className="flex flex-col w-full max-w-2xl p-4 relative bg-gray-800/80 rounded-lg shadow-lg">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-gray-200">Chat</h1>
                            <div className="flex gap-2 justify-center items-center">
                                <Link to="/dashboard" className="px-3 py-1 text-sm font-semibold text-gray-200 bg-red-600 rounded hover:bg-red-800 transition duration-200 ease-in-out"
                                onClick={handleLeaveRoom}>
                                    Leave
                                </Link>
                                <Link to="/dashboard" className="px-3 py-1 text-sm font-semibold text-gray-200 bg-gray-500 rounded hover:bg-slate-900 transition duration-200 ease-in-out"

                                >
                                    back
                                </Link>
                            </div>
                        </div>

                        {typing && (
                            <div className="text-gray-200 text-sm">{typing}</div>
                        )}
                    
                        <div className="flex flex-col justify-center items-center mt-4 space-y-4 overflow-y-auto">
                            <div className="flex-1 bg-slate-200 min-h-[250px] max-h-[250px] w-9/12 overflow-auto scroll-smooth 
                        rounded-lg text-black border px-3 py-2">
                                {messages.map((message, index) => ( 
                                    <div key={index}>{message?.message ?? message}</div> 
                                ))} 
                            
                            </div>
                            <div className="w-full">
                                <form  className="w-full flex justify-center items-center gap-2">
                                    <input
                                        type="text"
                                        name="newMessage"
                                        value={newMessage}
                                        onChange={handleChange}
                                        className="w-6/12 h-10 pl-3  text-base placeholder-gray-400 text-black border rounded-lg focus:shadow-outline focus:outline-none"
                                        placeholder="Type here ...."
                                    />
                                    <button type="button" onClick={handleSendMessage} name="submit" className="text-base px-4 py-2 rounded-lg bg-gray-300/60 text-gray-200
                                    hover:text-gray-900/70 hover:bg-gray-500 focus:outline-none focus:text-gray-900/70 
                                    focus:shadow-outline transition duration-200 ease-in-out
                                ">Send</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>



            </div>
        </div>
    );
}


