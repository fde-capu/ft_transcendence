// src/server/server.ts
import * as express from "express"
import * as path from "path"

var livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'dist'));
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

const app = express();
app.set("port", process.env.PORT || 3000)
app.use(connectLivereload());

let http = require("http").Server(app)
let io = require("socket.io")(http)

app.get("/", (req: any, res: any) => {
	console.log("Got /");
  res.sendFile(path.resolve("./src/client/index.html"))
})

io.on("connection", function(socket: any) {
  console.log("Client connected!")
  socket.on("msg", function(msg: any) {
    console.log(msg)
  })
})

http.listen(app.get("port"), function() {
  console.log("Frontend listening on *:" + app.get("port"))
})

module.exports = app;
