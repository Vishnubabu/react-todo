import express from 'express';
import logger from 'morgan';
import todoRouter from './routes/todo.js';

const app = express();

app.use(logger('dev'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//add routes
app.use('/api/todo', todoRouter);

export default app;
