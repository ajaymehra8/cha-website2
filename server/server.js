require("dotenv").config();// we can use env variables by using this
const express=require("express");
const cors=require("cors");
const db=require("./config/db");
const {notFound,errorHandler} =require("./middlewares/errorMiddleware");
const messageRouter=require("./routers/messageRouter");

const chatRouter=require("./routers/chatRouter");
const userRouter=require("./routers/userRouter");

db();


const app=express();
app.use(express.json());// BY use of this middleware we can use req.body
// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  
  // Enable CORS with the specified options
  app.use(cors(corsOptions));
app.use("/api/v1/chat",chatRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/message",messageRouter);


app.use(notFound);
app.use(errorHandler);

const server=app.listen(process.env.PORT,()=>{
    console.log(`App is listening at ${process.env.PORT}`);
});

const io=require('socket.io')(server,{
  pingTimeout:60000,
  cors:{
    origin:"http://localhost:3000"
  }
});
io.on("connection",(socket)=>{
console.log('connected to socket.io');

socket.on('setup',(userData)=>{
socket.join(userData._id);
socket.emit('connected');
});

socket.on('join chat',(room)=>{
socket.join(room);
console.log(" user join romm "+ room)
});

socket.on('typing',(room)=>{
  socket.in(room).emit("typing");
})
socket.on('stop typing',(room)=>{
  socket.in(room).emit("stop typing");
})

socket.on('new message',(newMessageReceived)=>{
var chat=newMessageReceived.chat;

if(!chat.users){
  return console.log("chat.users not defined");
}
console.log(chat.users);
chat.users.forEach(user=>{
  if(user._id===newMessageReceived.sender._id){
    return;
  }else{
    console.log(`Emitting message to user ${user}`);

    socket.to(user).emit('message received',newMessageReceived);

  }
})
});

socket.off("setup",()=>{
  console.log("user disconnected");
  socket.leave(userData._id);
})

});