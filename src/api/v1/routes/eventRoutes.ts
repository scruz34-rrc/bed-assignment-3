import { Router } from "express";
import { validateRequest } from "../middleware/validation";
import { eventSchemas } from "../validation/eventSchemas";
import * as eventController from "../controllers/eventController";

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Check API health status
 *     tags: [Health]
 *     responses:
 *       '200':
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 uptime:
 *                   type: number
 *                 timestamp:
 *                   type: string
 *                 version:
 *                   type: string
 */
router.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0"
    });
});

router.get("/events", eventController.getAllEventsHandler);
router.post(
    "/events", 
    validateRequest(eventSchemas.create), 
    eventController.createEventHandler
);
router.get(
    "/events/:id", 
    eventController.getEventByIdHandler
);
router.put(
    "/events/:id",
    eventController.updateEventHandler
);
router.delete(
    "/events/:id",
    eventController.deleteEventHandler
);

export default router;