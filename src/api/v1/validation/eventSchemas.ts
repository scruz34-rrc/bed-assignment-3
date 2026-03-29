import Joi from "joi";

/**
 * @openapi
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - date
 *         - capacity
 *         - registrationCount
 *         - status
 *         - category
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the event
 *           example: "evt_000001"
 *         name:
 *           type: string
 *           minLength: 3
 *           description: Name of the event
 *           example: "Tech Conference 2024"
 *         date:
 *           type: string
 *           format: date-time
 *           description: Event date and time
 *           example: "2024-12-15T10:00:00Z"
 *         capacity:
 *           type: integer
 *           minimum: 5
 *           description: Maximum number of attendees
 *           example: 100
 *         registrationCount:
 *           type: integer
 *           minimum: 0
 *           description: Current number of registered attendees
 *           example: 45
 *         status:
 *           type: string
 *           enum: [active, cancelled, completed]
 *           description: Current status of the event
 *           example: "active"
 *         category:
 *           type: string
 *           enum: [conference, workshop, meetup, seminar, general]
 *           description: Category of the event
 *           example: "conference"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the event was created
 *           example: "2024-01-15T10:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the event was last updated
 *           example: "2024-01-20T14:45:00Z"
 *     
 *     CreateEventRequest:
 *       type: object
 *       required:
 *         - name
 *         - date
 *         - capacity
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           description: Name of the event
 *           example: "Tech Conference 2024"
 *         date:
 *           type: string
 *           format: date-time
 *           description: Event date and time (must be in the future)
 *           example: "2024-12-15T10:00:00Z"
 *         capacity:
 *           type: integer
 *           minimum: 5
 *           description: Maximum number of attendees
 *           example: 100
 *         registrationCount:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *           description: Initial registration count
 *         status:
 *           type: string
 *           enum: [active, cancelled, completed]
 *           default: "active"
 *           description: Initial event status
 *         category:
 *           type: string
 *           enum: [conference, workshop, meetup, seminar, general]
 *           default: "general"
 *           description: Event category
 *     
 *     UpdateEventRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           description: Updated event name
 *         date:
 *           type: string
 *           format: date-time
 *           description: Updated event date
 *         capacity:
 *           type: integer
 *           minimum: 5
 *           description: Updated capacity
 *         registrationCount:
 *           type: integer
 *           minimum: 0
 *           description: Updated registration count
 *         status:
 *           type: string
 *           enum: [active, cancelled, completed]
 *           description: Updated event status
 *         category:
 *           type: string
 *           enum: [conference, workshop, meetup, seminar, general]
 *           description: Updated event category
 *     
 *     ErrorResponse:
 *       type: object
 *       required:
 *         - error
 *         - message
 *       properties:
 *         error:
 *           type: string
 *           description: Error type or code
 *           example: "VALIDATION_ERROR"
 *         message:
 *           type: string
 *           description: Human-readable error message
 *           example: "The name field is required"
 *         details:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 example: "name"
 *               issue:
 *                 type: string
 *                 example: "must be at least 3 characters"
 *           description: Detailed validation errors
 */
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

            capacity: Joi.number().required().integer().min(5).messages({
                "any.required": "\"capacity\" is required",
                "number.base": "\"capacity\" must be a number",
                "number.integer": "\"capacity\" must be an integer",
                "number.min": "\"capacity\" must be greater than or equal to 5"
            }),

            registrationCount: Joi.number().optional().integer().min(0).max(Joi.ref("capacity")).default(0).messages({
                "number.base": "\"registrationCount\" must be a number",
                "number.integer": "\"registrationCount\" must be an integer",
                "number.min": "\"registrationCount\" must be greater than or equal to 0",
                "number.max": "\"registrationCount\" must be less than or equal to ref:capacity"
            }),

            status: Joi.string().optional().valid("active", "cancelled", "completed").default("active").messages({
                "any.only": "\"status\" must be one of [active, cancelled, completed]"
            }),

            category: Joi.string().optional().valid("conference", "workshop", "meetup", "seminar", "general").default("general").messages({
                "any.only": "\"category\" must be one of [conference, workshop, meetup, seminar, general]"
            })
        })
    }
}