import Joi from "joi";

const futureDate = (value: string, helpers: Joi.CustomHelpers) => {
    const date = new Date(value);
    const now = new Date();
    
    if (date <= now) {
        return helpers.error("date.future");
    }
    return value;
};

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