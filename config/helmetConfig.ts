import helmet from "helmet";

export const getHelmetConfig = () => {
    const isDevelopment = process.env.NODE_ENV === "development";

    const baseConfig = {
        contentSecurityPolicy: false,
        hidePoweredBy: true,
        noSniff: true,
    };

    if (isDevelopment) {
        return helmet({
            ...baseConfig,
            hsts: false,
        });
    }

    return helmet({
        ...baseConfig,
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        },
        frameguard: { action: "deny" },
        referrerPolicy: { policy: "no-referrer" },
        dnsPrefetchControl: { allow: false },
        crossOriginResourcePolicy: { policy: "same-origin" },
        crossOriginOpenerPolicy: { policy: "same-origin" },
        xssFilter: true,
        ieNoOpen: true,
    });
};