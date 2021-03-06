const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;

const Elasticsearch = require("winston-elasticsearch");

const myFormat = printf(({ level, timestamp, message }) => {
  return `${timestamp} ${level} ${message}`;
});

const logger = createLogger({
  format: combine(timestamp(), format.splat(), myFormat),
  transports: [
    new transports.File({ filename: "./logs/error.log", level: "error" }),
    new transports.File({ filename: "./logs/info.log", level: "info" })
    // new Elasticsearch({ index: 'bitbloq-1-logs', level: 'info', ensureMappingTemplate: true }),
  ]
});

const loggerController = {
  storeInfoLog: async (where, modelType, action, docType, user, others) => {
    logger.info(
      "%s %s %s %s %s %s",
      where,
      modelType,
      action,
      docType,
      user,
      others || "XX"
    );
  },

  storeErrorLog: async (modelType, action, docType, user, others) => {
    logger.error(
      "%s %s %s %s %s",
      modelType,
      action,
      docType,
      user,
      others || "XX"
    );
  }
};

export { logger, loggerController };
