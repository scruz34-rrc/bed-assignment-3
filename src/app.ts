import express, { Express } from "express";
import morgan from "morgan";
import eventRoutes from "./api/v1/routes/eventRoutes";

const app: Express = express();

app.use(express.json());
app.use(morgan("combined"));

app.use("/api/v1", eventRoutes);

export default app;