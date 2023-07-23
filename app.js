const https = require("https");
const fs = require("fs");
const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const host = '192.168.1.132'//webXR works only on https connection

https.createServer(
    {
        key: fs.readFileSync("private_key.pem"),
        cert: fs.readFileSync("cert.pem"),
    }
    , app)
    .listen(port, host, () => {
        console.log('Server started at https://' + host + ':' + port);
        console.log('Visit:')
        console.log('https://' + host + ':' + port + "/exampleAnimation");
        console.log('https://' + host + ':' + port + "/exampleRobot");
        console.log('https://' + host + ':' + port + "/exampleAnimal");
    });

app.use("/", express.static(path.join(__dirname)));
console.log("static path: " + path.join(__dirname));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, '/src/html/template.html'));
})

app.get("/exampleAnimation", function (req, res) {
    res.sendFile(path.join(__dirname, '/src/html/example_animation.html'));
})

app.get("/exampleRobot", function (req, res) {
    res.sendFile(path.join(__dirname, '/src/html/example_robot.html'));
})

app.get("/exampleAnimal", function (req, res) {
    res.sendFile(path.join(__dirname, '/src/html/example_animal.html'));
})
