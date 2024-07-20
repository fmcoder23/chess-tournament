const Joi = require('joi');

const matchSchema = (data) => {
    const schema = Joi.object({
        player1_result: Joi.string().valid("WIN", "LOSS", "DRAW").required()
    });

    return schema.validate(data);
}

module.exports = {
    matchSchema,
}