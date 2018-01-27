"use strict";

const logger = require("./src/logger");
const http = require("http");
const url = require("url");
const cluster = require("cluster");
const port = process.env.PORT || 3001;

if (cluster.isMaster) {
  createWorkers();
} else {
  init();
}

function init() {
  http.createServer((req, res) => {
      const index = require("./index");
      const queryData  = url.parse(req.url, true).query;
      logger.info(`targetName: ${queryData.targetName}`);
      logger.info(`targetUrl: ${queryData.targetUrl}`);
      index.init(queryData.targetName, queryData.targetUrl);
      res.writeHead(200);
      res.end("OK!");
  }).listen(port);
  logger.info(`Worker listening on port ${port}`);
}

function createWorkers(){

  const numCPUs = require("os").cpus().length;
  
  logger.info("Creating workers. Cpus:",numCPUs);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code) => {
      logger.info(`Worker died with code: ${code}`);
      logger.info("Creating new worker.");
      cluster.fork();
  });

}