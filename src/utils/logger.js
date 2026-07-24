import pino from "pino";

const logger =
  process.env.NODE_ENV === "production"
    ? pino()
    : pino({
        transport: {
          target: "pino-pretty",
        },
      });

export default logger;