//import express from "express";
//import path from "path"
//import {Player} from "/app/dist/shared/model/player.js"
//import * as express from "express";
//import * as path from "path";
//import * as morgan from "morgan";
//import morgan from "morgan";

import {Player} from "../shared/model/player.js"

const express = require("express");
var morgan = require('morgan');
const app = express();
app.use(morgan('tiny'));
const path = require("path");
const assetsPath = path.join(__dirname, '../shared/assets');
console.log("AASSS", assetsPath);
app.use(express.static(assetsPath));

app.set("external_port", 3491);
app.set("port", process.env.PORT || 3000);

let http = require("http").Server(app)
let io = require("socket.io")(http)

app.get("/", (req: any, res: any) => {
  res.sendFile(path.resolve("./src/client/index.html"))
})
app.get("/socket.io", (req: any, res: any) => {
  res.sendFile(path.resolve("./node_modules/socket.io/client-dist/socket.io.js"))
})
app.get("/phaser", (req: any, res: any) => {
  res.sendFile(path.resolve("./node_modules/phaser/dist/phaser.js"))
})
app.get("/game_canvas", (req: any, res: any) => {
  res.sendFile(path.resolve("./dist/client/game.js"))
})
app.get("/assets", (req: any, res: any) => {
  res.sendFile(assetsPath);
})

io.on("connection", function(socket: any) {
  console.log("Client connected!")
  socket.on("set_player_name", function(msg: any) {
	let p1 = new Player(msg)
	console.log("Player name set: " + p1.getName())
  })
})

http.listen(app.get("port"), function() {
  console.log("Frontend listening on *:" + app.get("external_port"))
})

module.exports = app;
