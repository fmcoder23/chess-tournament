const Joi = require('joi');

const usersSchema = (data) => {
    const schema = Joi.object({
        fullname: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        age: Joi.number().min(18).max(100).required(),
        country: Joi.string().required(),
        isAdmin: Joi.boolean().required(),
    });

    return schema.validate(data);
}

module.exports = {
    usersSchema,
}