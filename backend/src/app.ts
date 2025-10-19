import express from 'express';
import cors from 'cors';
import challengeRoutes from './routes/challengeRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '75 Hard Tracker API is running' });
});

// API routes
app.use('/api/challenges', challengeRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
