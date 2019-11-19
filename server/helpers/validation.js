import Joi from 'joi';

const validateTodo = (task) => {
    const todoSchema = Joi.object({
        taskId: Joi
            .string(),
        createdOn: Joi
            .string(),
        title: Joi
            .string()
            .required(),
        description: Joi
            .string()
            .required()
    });
    return Joi.validate(task, todoSchema);
};
const validateSignup = (user) => {
    const signupSchema = Joi.object({
        userId: Joi
            .string(),
        firstname: Joi
            .string()
            .required(),
        lastname: Joi
            .string()
            .required(),
        email: Joi
            .string()
            .trim()
            .email({ minDomainAtoms: 2 })
            .required(),
        password: Joi
            .string()
            .regex(/^[a-zA-Z0-9]{2,32}$/)
            .required(),
    });
    return Joi.validate(user, signupSchema);
};
const validateSignin = (user) => {
    const signinSchema = Joi.object({
        email: Joi
            .string()
            .trim()
            .email({ minDomainAtoms: 2 })
            .required(),
        password: Joi
            .string()
            .regex(/^[a-zA-Z0-9]{8,32}$/)
            .required(),
    });
    return Joi.validate(user, signinSchema);
};
export default { validateSignin, validateSignup, validateTodo };
