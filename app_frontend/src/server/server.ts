import {Player} from "../shared/model/player.js"
const path = require("path");
const express = require("express");
const morgan = require('morgan');

const clientPath = path.resolve(__dirname + '/../../src/client');
console.log("clientPath: " + clientPath);

const socketIoPath = path.resolve(__dirname + '/../../node_modules/socket.io/client-dist');
console.log("socketIoPath: " + socketIoPath);

const assetsPath = path.resolve(__dirname + '../../../src/shared/assets');
console.log("assetsPath: " + assetsPath);

const app = express();
app.set("external_port", 3491);
app.set("port", process.env.PORT || 3000);
app.use(morgan('tiny'));
app.use(express.static(assetsPath));
app.use(express.static(clientPath));
app.use(express.static(socketIoPath));
console.log("Frontend app listening on " + app.get("port") + ":" + app.get("external_port") + ".");

let http = require("http").Server(app);
let io = require("socket.io")(http);

app.get("/", (req: any, res: any) => {
  res.sendFile(clientPath + "/index.html");
})

io.on("connection", function(socket: any) {
  console.log("Client connected!")
  socket.on("set_player_name", function(msg: any) {
	let p1 = new Player(msg)
	console.log("Player name set: " + p1.getName())
  })
})

http.listen(app.get("port"), function() {
  console.log("Frontend ready.");
})

module.exports = app;
