import uuid from 'uuid/v4';
import Schema from '../helpers/validation';
import todos from './todoData';
import users from '../controllers/userData';

const todoControllers = {};

const createTask = async (req, res) => {
    // const user = req.userExists;
    try {
        const user = req.userExists;
        const result = Schema.validateTodo(req.body);
        if (result.error) {
            return res.status(400).json({
                status: 400,
                message: result.error.details[0].message,
            });
        }
        const task = {
            userId: user.userId,
            taskId: uuid(),
            createdOn: new Date(),
            title: req.body.title,
            description: req.body.description
        };
        todos.push(task);
        return res.status(200).json({
            status: 200,
            message: 'Task added successfully',
            data: task,
        });
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: err.message,
        });
    }
};
const getAllTodos = async (req, res) => {
    // const user = req.userExists;
    // const allTodos = todos.filter((c) => c.userId === user.userId);
    try {
        const user = req.userExists;
        const allTodos = todos.filter((c) => c.userId === user.userId);

        const pageNo = req.query.pageNo ? parseInt(req.query.pageNo) : 1;

        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
        const startIndex = (pageNo - 1) * pageSize;
        const endIndex = pageSize * pageNo;

        const totalTodos = allTodos.length;
        const totalPages = Math.ceil(totalTodos / pageSize);
        let retrievedTodos = allTodos.slice(startIndex, endIndex);

        const itemsOnPage = retrievedTodos.length;

        if (allTodos.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'You have no todos',
            });
        } else {
            return res.status(200).json({
                status: 200,
                message: 'Todos retrieved successfully',
                // data: allTodos,
                totalTodos,
                totalPages,
                itemsOnPage,
                pageNo,
                retrievedTodos,
            });
        }

    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: err.message,
        })
    }
};

const getOneTodo = async (req, res) => {
    // const user = req.userExists;
    try {
        const user = req.userExists;

        const allTodos = todos.filter((c) => c.userId === user.userId);
        const getTask = allTodos.find((c) => c.taskId === req.params.taskId);
        if (!getTask) {
            return res.status(404).json({
                status: 404,
                message: 'Task with that id was not found',
            });
        }
        return res.status(200).json({
            status: 200,
            message: 'Task retrieved successfully',
            data: getTask,
        });
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: err.message,
        });
    }
};

const updateTask = async (req, res) => {
    // const user = req.userExists;
    try {
        const user = req.userExists;

        const allTodos = todos.filter((c) => c.userId === user.userId);
        const getTask = allTodos.find((c) => c.taskId === req.params.taskId);
        if (!getTask) {
            return res.status(404).json({
                status: 404,
                message: 'Task with that id was not found',
            });
        }
        const result = await Schema.validateTodo(req.body);
        if (result.error) {
            return res.status(401).json({
                status: 401,
                message: result.error.details[0].message,
            })
        }
        getTask.title = req.body.title || getTask.title;
        getTask.description = req.body.description || getTask.description;
        return res.status(200).json({
            status: 200,
            message: 'Task updated successfully',
            data: getTask,
        })
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: err.message,
        });
    }
};
const deleteTask = async (req, res) => {
    // const user = req.userExists;
    try {
        const user = req.userExists;

        const allTodos = todos.filter((c) => c.userId === user.userId);
        const oneTask = allTodos.find((c) => c.taskId === req.params.taskId);
        if (!oneTask) {
            return res.status(404).json({
                status: 404,
                message: 'Task with that id was not found',
            });
        }
        const index = todos.indexOf(oneTask);

        todos.splice(index, 1);

        return res.status(200).json({
            status: 200,
            message: 'Task deleted successfully',
            data: oneTask,
        });
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: err.message,
        });
    }
};

todoControllers.createTask = createTask;
todoControllers.getAllTodos = getAllTodos;
todoControllers.getOneTodo = getOneTodo;
todoControllers.updateTask = updateTask;
todoControllers.deleteTask = deleteTask;

export default todoControllers;
