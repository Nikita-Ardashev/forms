import express from 'express';
import appRouter from './routes';
import helmet from 'helmet';

const app = express();

// Middleware

app.use(helmet());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(appRouter);

export default app;
