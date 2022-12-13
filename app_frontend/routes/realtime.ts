//import * as express from "express";

const path = require('path');

const express = require('express');
//
////import * as socketio from "socket.io";
////import * as path from "path";
////
const realtime = express();



realtime.set("port", process.env.PORT || 3491);
////
let http = require("http").Server(realtime);
////// set up socket.io and bind it to our
////// http server.
let io = require("socket.io")(http);
////.listen(http, { resource: '/realtime' });
////
realtime.get('/', async function(req, res, next) {
	res.sendFile(path.resolve("./public/index.html"));
//	res.send('Realtime page goes here.');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});


////
////// whenever a user connects on port 3491 via
////// a websocket, log that a user has connected
////io.on("connection", async function(socket) {
////  console.log("a user connected");
////});
////
let port = realtime.get("port");
const server = realtime.listen(port, function() {
    var host = express.address().address;
    var port = express.address().port;
    console.log("Realtime listening on " + host + " " + port);
});
//
////////////////////
//
////const realtime = express();
////
////realtime.get('/', async function(req, res, next) {
////	res.send('Realtime page goes here.');
////});
//
module.exports = realtime;
