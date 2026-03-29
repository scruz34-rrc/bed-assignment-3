import express, { Express } from "express";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

import helmet from "helmet";
import cors from "cors";
import { getHelmetConfig } from "../config/helmetConfig";
import { getCorsOptions } from "../config/corsConfig";
import setupSwagger from "../config/swagger";
import eventRoutes from "./api/v1/routes/eventRoutes";

const app: Express = express();

app.use(getHelmetConfig());
app.use(cors(getCorsOptions()));
app.use(express.json());
app.use(morgan("combined"));

setupSwagger(app);

app.use("/api/v1", eventRoutes);

export default app;