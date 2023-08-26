const Joi = require('joi')

const userSchema = Joi.object({
    email : Joi.string()
})
module.exports = userSchema;