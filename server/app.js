import express from 'express';
import bodyParser from 'body-parser';
import usersRouter from './routes/users';
import todosRouter from './routes/todos';
// setup express app
const app = express();

//parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Make use of middleware
app.use(usersRouter);
app.use(todosRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`The server is listening on port: ${PORT}`);
});

export default app;
