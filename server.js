"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const logger = require("winston");
const { fork } = require("child_process");

const port = process.env.PORT || 3000;

app.listen(port, () => logger.info(`App running on port:${port}`) );
app.use(bodyParser.urlencoded({ 
    extended: false 
}));
app.use(bodyParser.json());

app.post("/collect",(req, res) => {
    initProcess(req.body.target);
    res.send("Success\n");
});

function initProcess(target){
    const childProcess = fork("index.js",[target]);
    childProcess.on("message", (msg) => {
        logger.info(msg);
    });
}

