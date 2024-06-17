require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const messageRouter = require("./routers/messageRouter");
const chatRouter = require("./routers/chatRouter");
const userRouter = require("./routers/userRouter");

db();

const app = express();
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: 'https://cha-website2-4m8h.vercel.app', // Replace with your frontend domain
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Enable CORS with the specified options
app.use(cors(corsOptions));

app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", messageRouter);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(process.env.PORT, () => {
  console.log(`App is listening at ${process.env.PORT}`);
});

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://cha-website2-4m8h.vercel.app",
    methods: ["GET", "POST"],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
});

io.on("connection", (socket) => {
  console.log('connected to socket.io');

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log("User joined room " + room);
  });

  socket.on('typing', (room) => {
    socket.to(room).emit("typing");
  });

  socket.on('stop typing', (room) => {
    socket.to(room).emit("stop typing");
  });

  socket.on('new message', (newMessageReceived) => {
    const chat = newMessageReceived.chat;

    if (!chat.users) {
      return console.error("chat.users not defined");
    }

    chat.users.forEach(user => {
      if (user._id === newMessageReceived.sender._id) {
        return;
      } else {
        console.log(`Emitting message to user ${user._id}`);
        socket.to(user._id).emit('message received', newMessageReceived);
      }
    });
  });

  socket.on('disconnect', () => {
    console.log("user disconnected");
  });

  socket.on('error', (error) => {
    console.error("Socket encountered error: ", error);
  });
});
