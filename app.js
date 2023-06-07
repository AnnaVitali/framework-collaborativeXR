const https = require("https");
const fs = require("fs");
const express = require("express");
var path = require("path");
const app = express();
const port = 3000;
const host = '192.168.192.1'//webXR works only on https connection

https.createServer(
    {
        key: fs.readFileSync("private_key.pem"),
        cert: fs.readFileSync("cert.pem"),
    }
    , app)
    .listen(port, host, () => {
        console.log('Server started at https://' + host + ':' + port);
    });

app.use("/", express.static(path.join(__dirname)));
console.log("static path: " + path.join(__dirname));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
})