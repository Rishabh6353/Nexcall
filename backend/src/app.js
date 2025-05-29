import express from "express";
import dotenv from 'dotenv';
dotenv.config();

import {createServer} from "node:http";

import {Server} from "socket.io";


import mongoose from "mongoose";
import {connectToSocket} from "./controllers/socketManager.js";

import cors from "cors";
import userRoutes from "./routes/users.routes.js";


const app = express();
const server = createServer(app);
const io = connectToSocket(server);
const MONGO_URL = process.env.MONGO_URL;

app.set("port",(process.env.PORT || 8000));
app.use(cors());
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb", extended:"true"}));

//Any route defined inside userRoutes will be prefixed by /api/v1/users.
app.use("/api/v1/users",userRoutes);


const start = async()=>{
    //   app.set("mongo_user")
    const connectionDb = await mongoose.connect(MONGO_URL);

    console.log(`Mongo connceted Db Host: ${connectionDb.connection.host}`)
    server.listen(app.get("port"),()=>{
        console.log("Listening on port 8000");
        console.log(MONGO_URL);
    });
}

start();