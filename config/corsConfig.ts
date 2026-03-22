import { CorsOptions } from "cors";

export const getCorsOptions = (): CorsOptions => {
    const isDevelopment = process.env.NODE_ENV === "development";
    
    if (isDevelopment) {
        return {
            origin: true,
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
            exposedHeaders: ["Content-Length", "X-Request-ID"],
            maxAge: 600,
            preflightContinue: false,
            optionsSuccessStatus: 204
        };
    }
    
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
    
    return {
        origin: (origin, callback) => {
            if (!origin) {
                return callback(null, true);
            }
            
            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error(`Origin ${origin} not allowed by CORS`));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["X-Total-Count", "X-Rate-Limit-Limit", "X-Rate-Limit-Remaining"],
        maxAge: 3600,
        preflightContinue: false,
        optionsSuccessStatus: 204
    };
};