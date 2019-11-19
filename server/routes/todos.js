import express from 'express';
import todoControllers from '../controllers/todoControllers';
import accessToken from '../helpers/verifyToken';

const todosRouter = express.Router();

todosRouter.post('/api/v1/todos', accessToken, todoControllers.createTask);

todosRouter.get('/api/v1/todos', accessToken, todoControllers.getAllTodos);

todosRouter.get('/api/v1/todos/:taskid', accessToken, todoControllers.getOneTodo);

todosRouter.patch('/api/v1/todos/:taskid', accessToken, todoControllers.updateTask);

todosRouter.delete('/api/v1/todos/:taskid', accessToken, todoControllers.deleteTask);

export default todosRouter;
