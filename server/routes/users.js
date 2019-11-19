import express from 'express';
import userControllers from '../controllers/userControllers';
const usersRouter = express.Router();

usersRouter.post('/api/v1/auth/signup', userControllers.createUser);
usersRouter.post('/api/v1/auth/signin', userControllers.signin);

export default usersRouter;
