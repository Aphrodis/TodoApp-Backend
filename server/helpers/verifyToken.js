import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config(0);

const verifyToken = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({
                message: 'Unauthenticated1',
            });
        }
        const token = await req.headers.authorization.split(' ')[1];
        const userExists = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userExists = userExists;
        next();
    } catch (err) {
        return res.status(401).json({
            message: err.message,
        });
    }
};

export default verifyToken;
