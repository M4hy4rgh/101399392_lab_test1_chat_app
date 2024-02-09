const express = require("express"); //import express
const mongoose = require("mongoose"); //import mongoose
const userRoute = require("./routes/userRoute"); //import userRoute.js
const groupRoute = require("./routes/groupRoute"); //import groupRoute.js
const messageRoute = require("./routes/messageRoute"); //import messageRoute.js
const http = require('http'); // Import the built-in 'http' module
const cors = require('cors');
const GroupMessage = require("./model/groupMessage");
const axios = require('axios');
require('dotenv').config();

const app = express(); //Creates an Express application
app.use(cors());
const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

app.use(express.json()); //Parse JSON bodies
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies


// process.env.PORT: gets the port from the environment variables
const PORT = process.env.PORT || 8089;

// process.env.CONNECTION_STRING: gets the connection string from the environment variables
const CONECTION_STRING =
  process.env.REACT_APP_CONECTION_STRING 

// mongoose.connect: connects to the database
mongoose.connect(CONECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/user", userRoute); //Use userRoute.js for /users route
app.use("/group", groupRoute); //Use groupRoute.js for /group route
app.use("/message", messageRoute); //Use messageRoute.js for /message route

// app.route: chainable route handler for a route path
app.route("/").get((req, res) => {
  res.send("<h1>Wlecome to COMP3133 lab test 1</h1>");
});


io.on('connection', (socket) => {
  
  console.log('A user connected');
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('joinRoom', async ({ username, userId, room, groupId, token }) => {
    socket.join(room);

    const member = axios.post(`http://localhost:8089/group/${groupId}/members`,
      {
        memberId: userId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Include the token in the request headers
        }
      }
    );

      const newmessage = new GroupMessage({ sender: userId, group: groupId, message: `${username} has joined the chat` });
      newmessage.save();
      io.to(room).emit('message', `${username} has joined the chat`);    
    
  });

  socket.on('typing', ({ room, username }) => {
    io.to(room).emit('type', `${username} is typing...`);
  })

  socket.on('stopTyping', ({ room }) => {
    console.log('stop typing');
    io.to(room).emit('stopTyping'); // Emit stopTyping event to all clients in the room
  });

  socket.on('leaveRoom', async ({user, groupId, name, username}) => {
    socket.leave(groupId);
    console.log(`${username} left room: ${name}`);
    
    const newGroup = await axios.delete(`http://localhost:8089/group/${groupId}/members/${user}`);

    const newmessage = new GroupMessage({ sender: user, group: groupId, message: `${username} has left the room` });
    newmessage.save();

  });


  socket.on('chatMessage', (data, groupName) => {
    console.log("my server " + groupName);
    const newMessage = new GroupMessage(data);
    newMessage.save();
    io.to(groupName).emit('message', data);
  });

});


// app.listen: starts the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});