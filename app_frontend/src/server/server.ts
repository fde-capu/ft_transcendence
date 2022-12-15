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

io.on("connection", function(socket: any) {
  console.log("Client connected!")
  socket.on("msg", function(msg: any) {
    console.log(msg)
  })
})

http.listen(app.get("port"), function() {
  console.log("Frontend listening on *:" + app.get("external_port"))
})

module.exports = app;
