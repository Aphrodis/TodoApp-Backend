import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config(0);

const signToken = (user) => {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const options = { expiresIn: '2d' };
    return jwt.sign(user, jwtSecretKey, options);
};
export default signToken;
