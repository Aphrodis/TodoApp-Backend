import uuid from 'uuid/v4';
import bcrypt from 'bcrypt';
import Schema from '../helpers/validation';
import userToken from '../helpers/token';
import pool from '../db/connection';

const userControllers = {};

const createUser = async (req, res) => {
    try {
        const user1 = req.body;
        const checkEmail = 'SELECT * FROM users WHERE email=$1';
        const user = await pool.query(checkEmail, [user1.email]);

        if (user.rows[0]) {
            return res.status(409).json({
                status: 409,
                message: 'Email already exists',
            });
        } else {
            const passwordHash = await bcrypt.hash(req.body.password, 12);
            const validateUser = Schema.validateSignup(req.body);
            if (validateUser.error) {
                return res.status(400).json({
                    status: 400,
                    message: validateUser.error.details[0].message,
                });
            }
            const userid = uuid();
            const registerUser = 'INSERT INTO users (userid, firstname, lastname, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *';
            const values = [
                userid,
                user1.firstname,
                user1.lastname,
                user1.email,
                passwordHash
            ];
            const newUser = await pool.query(registerUser, values);
            const authenticateUser = {
                userid: newUser.rows[0].userid,
                email: newUser.rows[0].email,
            };
            const token = userToken(authenticateUser);
            return res.status(201).json({
                status: 201,
                message: 'User created successfully',
                data: {
                    token,
                }
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: err.message,
        });
    }
};

const signin = async (req, res) => {
    try {
        const user1 = req.body;
        const checkEmail = 'SELECT * FROM users WHERE email=$1';
        const user = await pool.query(checkEmail, [user1.email]);
        if (!user.rows[0]) {
            return res.status(404).json({
                status: 404,
                message: 'Email not found',
            });
        }
        const validPassword = await bcrypt.compare(user1.password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401).json({
                status: 401,
                message: 'Incorrect password',
            });
        }
        const signinValidation = Schema.validateSignin(user1);
        if (signinValidation.error) {
            return res.status(400).json({
                status: 400,
                message: signinValidation.error.details[0].message,
            });
        }
        const signinInfo = {
            userid: user.rows[0].userid,
            email: user.rows[0].email,
        }
        const token = userToken(signinInfo);
        return res.status(200).json({
            status: 200,
            message: 'User signed in successfully',
            token,
        });
    } catch (err) {
        return res.status(500).json({
            status: 500,
            message: err.message,
        });
    }
};

userControllers.createUser = createUser;
userControllers.signin = signin;

export default userControllers;
