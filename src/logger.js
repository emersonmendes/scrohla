"use strict";

const winston = require("winston");
const moment = require("moment");

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true,
      prettyPrint: true,
      level: "debug",
      timestamp: () => {
        return `${moment().format("DD/MM/YYYY HH:mm:ss")} [ ${process.pid} ]`;
      }
    })
  ]
});

module.exports = logger;