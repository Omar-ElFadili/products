const Joi = require('joi')

const productSchema = Joi.object({
    name : Joi.string()
})
module.exports = productSchema;