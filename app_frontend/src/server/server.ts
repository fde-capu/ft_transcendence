// src/server/server.ts
//import express from "express"
//import path from "path"
//import {Player} from "/app/dist/shared/model/player.js"
import {Player} from "../shared/model/player.js"

const path = require("path");
//const player = require("../shared/model/player.js");

const express = require("express");
const app = express();
var morgan = require("morgan");
app.use(morgan("combined"));

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
