import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'] || generateRequestId();
  const { method, url, headers } = req;
  const start = Date.now();
  const userAgent = headers['user-agent'] || 'unknown'; // Capture the user agent
  const ip = req.ip || 'unknown'; // Capture the client's IP address
  
  // Log the incoming request (start)
  logger.info({
    timestamp: new Date().toISOString(),
    level: 'info',
    message: 'Incoming request',
    requestId,
    method,
    url,
    userAgent,
    ip,
  });

  // Pass the requestId to the response locals for further use in the application
  res.locals.requestId = requestId;

  // Log the response once the request is finished
  res.on('finish', () => {
    const duration = Date.now() - start; // Calculate response time
    const { statusCode } = res; // HTTP Status Code
    const level = statusCode >= 400 ? 'warn' : 'info'; // Log as 'warn' for 4xx/5xx status codes
    
    // Log the response details with status code and duration
    logger.log(level, {
      timestamp: new Date().toISOString(),
      level,
      message: 'Request completed',
      requestId,
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
      userAgent,
      ip,
    });
  });

  next();
};

// Helper function to generate a unique requestId if not present
const generateRequestId = () => {
  return Math.random().toString(36).slice(2, 11);
};
