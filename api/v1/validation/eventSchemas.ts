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

            date: Joi.string().required().isoDate().custom(futureDate, "Future date validation").messages({
                "any.required": "\"date\" is required",
                "string.empty": "\"date\" is required",
                "string.isoDate": "\"date\" must be a valid ISO date format",
                "date.future": "\"date\" must be greater than \"now\""
            }),
        })
    }
}