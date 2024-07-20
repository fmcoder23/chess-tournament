const Joi = require('joi');

const tournamentSchema = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
    });

    return schema.validate(data);
}

const assignSchema = (data) => {
    const schema = Joi.object({
        user_id: Joi.string().required(),
        tournament_id: Joi.string().required(),
    });

    return schema.validate(data);
}

module.exports = {
    tournamentSchema,
    assignSchema,
}