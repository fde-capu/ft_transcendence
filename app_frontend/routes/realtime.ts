//import * as express from "express";

const express = require('express');
//
////import * as socketio from "socket.io";
const path = require('path');
////import * as path from "path";
////
const realtime = express();



//realtime.set("port", process.env.PORT || 3491);
////
//let http = require("http").Server(realtime);
////// set up socket.io and bind it to our
////// http server.
//let io = require("socket.io")(http);
////.listen(http, { resource: '/realtime' });
////
realtime.get('/', async function(req, res, next) {
	res.sendFile(path.resolve("./public/index.html"));
//	res.send('Realtime page goes here.');
});
////
////// whenever a user connects on port 3000 via
////// a websocket, log that a user has connected
////io.on("connection", async function(socket) {
////  console.log("a user connected");
////});
////
//let port = realtime.get("port");
//const server = realtime.listen(port, function() {
//    var host = server.address().address;
//    var port = server.address().port;
//    console.log("Realtime listening on " + host + " " + port);
//});
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
