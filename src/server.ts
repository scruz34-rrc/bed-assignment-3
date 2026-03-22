import app from "./app";
import {Server} from "http";
import { initializeLastEventId } from "./api/v1/services/eventService";

const PORT: string | number = process.env.PORT || 3000;

let server: Server;
initializeLastEventId().then(() => {
    server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => {
    console.error("Failed to initialize:", error);
    process.exit(1);
});

export { server };