import uuid from 'uuid/v4';
import bcrypt from 'bcrypt';
import users from '../controllers/userData';
import Schema from '../helpers/validation';
import userToken from '../helpers/token';

const userControllers = {};

const createUser = async (req, res) => {
    try {
        const user = users.find((c) => c.email === req.body.email);
        if (user) {
            return res.status(409).json({
                message: 'Email already exists',
            });
        } else {
            const passwordHash = await bcrypt.hash(req.body.password, 12);
            const validateUser = Schema.validateSignup(req.body);
            if (validateUser.error) {
                return res.status(400).json({
                    message: validateUser.error.details[0].message,
                });
            }
            const newUser = {
                userId: uuid(),
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: passwordHash,
            };
            users.push(newUser);
            const authenticateUser = {
                userId: newUser.userId,
                email: newUser.email,
            };
            const token = userToken(authenticateUser);
            return res.status(201).json({
                status: 201,
                message: 'User created successfully',
                data: {
                    token,
                }
            })
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};

const signin = async (req, res) => {
    try {
        const user = users.find((c) => c.email === req.body.email);
        if (!user) {
            return res.status(404).json({
                message: 'Email not found',
            });
        }
        const validPassword = await bcrypt.compare(req.body.password, users[0].password);
        if (!validPassword) {
            return res.status(401).json({
                message: 'Incorrect password',
            });
        }
        const signinValidation = Schema.validateSignin(req.body);
        if (signinValidation.error) {
            return res.status(400).json({
                message: signinValidation.error.details[0].message,
            });
        }
        const signinInfo = {
            userId: users[0].userId,
            email: users[0].email,
        }
        const token = userToken(signinInfo);
        return res.status(200).json({
            status: 200,
            message: 'User signed in successfully',
            token,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};

userControllers.createUser = createUser;
userControllers.signin = signin;

export default userControllers;
