// src/server/server.ts
import * as express from "express"
import * as path from "path"
import {Player} from "../shared/model/player"

const app = express();
app.set("external_port", 3491);
app.set("port", process.env.PORT || 3000);

let http = require("http").Server(app)
let io = require("socket.io")(http)

app.get("/", (req: any, res: any) => {
  res.sendFile(path.resolve("./src/client/index.html"))
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
	let player = new Player(msg)
	console.log("Player name set: " + player.getName())
  })
})

http.listen(app.get("port"), function() {
  console.log("Frontend listening on *:" + app.get("external_port"))
})

module.exports = app;
