const express = require("express");
const logger = require("morgan");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path1 = require("path");
const mongoose = require("mongoose");
const admin = require('firebase-admin');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const app = express();

const port = process.env.PORT;
const path = port;
const db = require("./config/database");

const userRouter = require("./routes/user");
const managerRouter = require("./routes/manager");

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(logger('dev'));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
app.use(session({
    secret: 'userSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 6000000 }
}));



app.use('/', userRouter);
app.use('/manager', managerRouter);

server.listen(port, () => {
    console.log(`App Listening port: ${port}`);
});

module.exports = app;