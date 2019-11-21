import uuid from 'uuid/v4';
import Schema from '../helpers/validation';
import pool from '../db/connection';

const todoControllers = {};

const createTask = async (req, res) => {
    try {
        const { userid } = req.userExists;
        const task = req.body;
        const result1 = Schema.validateTodo(task);
        if (result1.error) {
            return res.status(400).json({ status: 400, message: result1.error.details[0].message, });
        }
        const taskid = uuid();
        const createdon = new Date();
        const insertTask = 'INSERT INTO todos (userid, taskid, createdon, title, description) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const values = [userid, taskid, createdon, task.title, task.description,];

        const newTask = await pool.query(insertTask, values);

        return res.status(200).json({ status: 200, message: 'Task added successfully', data: newTask.rows[0], });
    } catch (err) {
        return res.status(500).json({ status: 500, message: err.message, });
    }
};

const getAllTodos = async (req, res) => {
    try {
        const { userid } = req.userExists;
        const selectTodos = 'SELECT * FROM todos WHERE userid = $1';
        const allTodos = await pool.query(selectTodos, [userid]);

        const pageNo = req.query.pageNo ? parseInt(req.query.pageNo) : 1;

        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
        const startIndex = (pageNo - 1) * pageSize;
        const endIndex = pageSize * pageNo;

        const totalTodos = allTodos.rows.length;
        const totalPages = Math.ceil(totalTodos / pageSize);
        let retrievedTodos = allTodos.rows.slice(startIndex, endIndex);

        const itemsOnPage = retrievedTodos.length;

        if (allTodos.rows.length === 0) {
            return res.status(404).json({ status: 404, message: 'You have no todos', });
        } else {
            return res.status(200).json({ status: 200, message: 'Todos retrieved successfully', totalTodos, totalPages, itemsOnPage, pageNo, retrievedTodos, });
        }

    } catch (err) {
        return res.status(500).json({ status: 500, message: err.message, });
    }
};

const getOneTodo = async (req, res) => {
    try {
        const { userid } = req.userExists;
        let { taskid } = req.params;

        const getTodo = 'SELECT * FROM todos WHERE userid=$1 AND taskid=$2';
        const values = [userid, taskid];
        const retrieveTask = await pool.query(getTodo, values);
        if (!retrieveTask.rows[0]) {
            return res.status(404).json({
                status: 404,
                message: 'Task not found',
            });
        }
        return res.status(200).json({
            status: 200,
            message: 'Task retrieved successfully',
            data: retrieveTask.rows[0],
        });
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: err.message,
        });
    }
};

const updateTask = async (req, res) => {
    try {
        const { userid } = req.userExists;
        const { taskid } = req.params;

        const getTaskQuery = 'SELECT * FROM todos WHERE userid=$1 AND taskid=$2';
        const selectValues = [userid, taskid];
        const getTaskToBeUpdated = await pool.query(getTaskQuery, selectValues);

        if (!getTaskToBeUpdated.rows[0]) {
            return res.status(404).json({ status: 404, message: 'Task to be updated was not found', });
        }
        const result2 = await Schema.validateTodo(req.body);
        if (result2.error) {
            return res.status(401).json({ status: 401, message: result2.error.details[0].message, });
        }
        const updateQuery = `UPDATE todos SET title=$1,description=$2 WHERE userid=$3 AND taskid=$4 RETURNING *`;

        const values = [req.body.title || getTaskToBeUpdated.rows[0].title, req.body.description || getTaskToBeUpdated.rows[0].description, getTaskToBeUpdated.rows[0].userid, getTaskToBeUpdated.rows[0].taskid];
        const updatedTask = await pool.query(updateQuery, values);

        return res.status(200).json({ status: 200, message: 'Task updated successfully', data: updatedTask.rows[0], });
    } catch (err) {
        return res.status(500).json({ status: 500, message: err.message, });
    }
};
const deleteTask = async (req, res) => {
    try {
        const { userid } = req.userExists;
        const { taskid } = req.params;

        const getTaskQuery = 'SELECT * FROM todos WHERE userid=$1 AND taskid=$2';
        const selectValues = [userid, taskid]
        const getTaskToBeDeleted = await pool.query(getTaskQuery, selectValues);
        if (!getTaskToBeDeleted.rows[0]) {
            return res.status(404).json({ status: 404, message: 'Task to be deleted was not found', });
        }
        const deleteQuery = 'DELETE FROM todos WHERE userid=$1 AND taskid=$2';
        const deleteValues = [userid, taskid]
        const deletedTask = await pool.query(deleteQuery, deleteValues);
        return res.status(200).json({ status: 200, message: 'Task deleted successfully', });
    } catch (err) {
        return res.status(500).json({ status: 500, message: err.message, });
    }
};

todoControllers.createTask = createTask;
todoControllers.getAllTodos = getAllTodos;
todoControllers.getOneTodo = getOneTodo;
todoControllers.updateTask = updateTask;
todoControllers.deleteTask = deleteTask;

export default todoControllers;
