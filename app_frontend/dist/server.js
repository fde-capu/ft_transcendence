"use strict";
exports.__esModule = true;
// src/server/server.ts
var express = require("express");
var path = require("path");
var app = express();
app.set("port", process.env.PORT || 3491);
var http = require("http").Server(app);
var io = require("socket.io")(http);
app.get("/", function (req, res) {
    res.sendFile(path.resolve("./src/client/index.html"));
});
io.on("connection", function (socket) {
    console.log("Client connected!");
    socket.on("msg", function (msg) {
        console.log(msg);
    });
});
http.listen(app.get("port"), function () {
    console.log("listening on *:" + app.get("port"));
});
