import express from "express";
import usersRouter from "./routes/users";
import rsvRouter from "./routes/rsvs";
import eventsRouter from "./routes/events";
import generateRouter from "./routes/generate";
import { requestLogger } from './middleware/loggerMiddleware';
import swaggerUi from 'swagger-ui-express';
import { generateSwaggerDocs } from './config/swaggerConfig';
import cors from 'cors';

export function createApp() {
  const app = express();
  
  // app.use(cors());
  app.use(cors({ origin: 'http://localhost:3000' }));
  const swaggerDocs = generateSwaggerDocs();

  app.get('/swagger.json', (req, res) => {
    res.json(swaggerDocs); // Return the Swagger JSON
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
    swaggerUrl: '/swagger.json', 
    customCss: '.swagger-ui .topbar { display: none }',
  }));

  app.use(express.json());
// Use middleware globally
app.use(requestLogger);
  app.use("/api/rsv", rsvRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/event", eventsRouter);
  app.use("/api/generate", generateRouter);

  return app;
}