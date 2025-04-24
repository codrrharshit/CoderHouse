import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authRoutes from "./Routes/AuthRoutes.js";
import activateRoutes from "./Routes/ActivateRoute.js";
import mongoose from "mongoose";
import cors from "cors";
import cookieparser from "cookie-parser";
import RoomRoutes from "./Routes/RoomsRoutes.js";
import { Server } from "socket.io";
import http from "http";

const app = express();
const PORT = process.env.PORT || 5500;
const DB_URI = process.env.DB_URL;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cookieparser());
const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use("/storage", express.static("storage"));
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.send("Hello from express");
});

app.use("/api/auth", authRoutes);
app.use("/api/activate", activateRoutes);
app.use("/api/room", RoomRoutes);

//socket codes
const socketMapping = {};
io.on("connection", (socket) => {

  socket.on("join", async ({ roomId, user }) => {
  
    // add in the map
    socketMapping[socket.id] = user;
    await socket.join(roomId);
    //get all the clients in the room
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    // send all the clients that user wants to join the room
    clients.forEach((clientId) => {
     
        io.to(clientId).emit("add_peer", {
          peerId: socket.id,
          createOffer: false,
          user,
        });
      
      socket.emit("add_peer", {
        peerId: clientId,
        createOffer: true,
        user: socketMapping[clientId],
      });
    });
  });

  // handle ice candidate
  socket.on("relay-ice", ({ peerId, IceCandidate }) => {
    io.to(peerId).emit("ice_candidate", {
      peerId: socket.id,
      IceCandidate ,
    });
  });

  //handle sdp
  socket.on("relay-sdp", ({ peerId, sessionDescription }) => {
    io.to(peerId).emit("session-desc", {
      peerId: socket.id,
      sessionDescription,
    });
  });

  //handle mute/unmute
  socket.on('mute',({roomId,userId})=>{
    const clients= Array.from(io.sockets.adapter.rooms.get(roomId)||[])
    clients.forEach((clientId)=>{
      io.to(clientId).emit('mute',{userId})
    })
  })

  socket.on('unmute',({roomId,userId})=>{
    const clients= Array.from(io.sockets.adapter.rooms.get(roomId)||[])
    clients.forEach((clientId)=>{
      io.to(clientId).emit('unmute',{userId})
    })
  })

  // handle leave
  socket.on('leave', ({ roomId }) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach((clientId) => {
      io.to(clientId).emit('remove_peer', {
        peerId: socket.id,
        userId: socketMapping[socket.id]._id,
      });
      socket.emit('remove_peer', {
        peerId: clientId,
        userId: socketMapping[clientId]._id,
      });
    });
    socket.leave(roomId);
    delete socketMapping[socket.id];
  });

  socket.on('disconnecting',() => {
    // here we need the room 
    const {rooms}=socket;
    Array.from(rooms).forEach((roomId)=>{
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach((clientId) => {
      io.to(clientId).emit('remove_peer', {
        peerId: socket.id,
        userId: socketMapping[socket.id]?._id,
      });
      socket.emit('remove_peer', {
        peerId: clientId,
        userId: socketMapping[clientId]?._id,
      });
    })
    
    });
    delete socketMapping[socket.id];
  })

});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose.connect(DB_URI).then(() => console.log("database is connected"));
