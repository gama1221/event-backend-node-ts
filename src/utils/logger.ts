import winston from 'winston';

// Create a logger instance with specific transports and formats
const logger = winston.createLogger({
  level: 'info', // Default log level
  format: winston.format.combine(
    winston.format.timestamp(), // Adds timestamp to each log entry
    winston.format.colorize({ all: true }), // Colorizes the log output
    winston.format.printf(({ timestamp, level, message }) => {
      // return `${timestamp} ${level}: ${message}`; // Custom log format
      return `${timestamp} [${level}]: ${message}`;  // Format log messages
    })
  ),
  transports: [
    // Log to the console (colorized logs)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // Log to a file for persistent logging
    new winston.transports.File({ filename: 'app.log' }),
  ]
});

// Export the logger instance
export default logger;
