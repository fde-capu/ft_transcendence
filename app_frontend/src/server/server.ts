// src/server/server.ts
import * as express from "express"
import * as path from "path"

const app = express();
app.set("external_port", 3491);
app.set("port", process.env.PORT || 3000);

let http = require("http").Server(app)
let io = require("socket.io")(http)

app.get("/", (req: any, res: any) => {
  res.sendFile(path.resolve("./src/client/index.html"))
})

app.get("/phaser.js", (req: any, res: any) => {
  res.sendFile(path.resolve("./node_modules/phaser/dist/phaser.js"))
})

app.get("/game.js", (req: any, res: any) => {
  res.sendFile(path.resolve("./dist/client/game.js"))
})

app.get("/game.js", (req: any, res: any) => {
  res.sendFile(path.resolve("./dist/client/game.js"))
})

io.on("connection", function(socket: any) {
  console.log("Client connected!")
  socket.on("msg", function(msg: any) {
//	let player = new Player(msg)
//	console.log(player.getName())
	console.log("heya");
  })
})

http.listen(app.get("port"), function() {
  console.log("Frontend listening on *:" + app.get("external_port"))
})

module.exports = app;
