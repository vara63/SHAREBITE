const winston = require("winston");
const fs = require("fs");
const path = require("path");
const config = require("../config/framework.config");

// Ensure logs directory exists
if (!fs.existsSync(config.paths.logsDir)) {
  fs.mkdirSync(config.paths.logsDir, { recursive: true });
}

const customFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
  })
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: customFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), customFormat)
    }),
    new winston.transports.File({
      filename: path.join(config.paths.logsDir, "execution.log"),
      level: "info"
    }),
    new winston.transports.File({
      filename: path.join(config.paths.logsDir, "error.log"),
      level: "error"
    })
  ]
});

module.exports = logger;
