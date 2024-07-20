const Joi = require('joi');

const registerSchema = (data) => {
    const schema = Joi.object({
        fullname: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        age: Joi.number().min(18).max(100).required(),
        country: Joi.string().required()
    });

    return schema.validate(data);
}

const loginSchema = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });

    return schema.validate(data);
}

module.exports = {
    registerSchema,
    loginSchema,
}