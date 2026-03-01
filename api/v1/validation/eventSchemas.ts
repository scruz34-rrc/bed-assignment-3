import Joi from "joi";

export const eventSchemas = {
    create: {
        body: Joi.object({
            name: Joi.string().required().min(3).messages({
                "any.required": "\"name\" is required",
                "string.empty": "\"name\" is required",
                "string.min": "\"name\" length must be at least 3 characters long"
            }),
        })
    }
}