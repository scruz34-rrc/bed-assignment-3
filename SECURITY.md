## Helmet.js Configuration

### Configuration Applied

```typescript
import helmet, { HelmetOptions } from 'helmet';

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
```

### Justification
1. contentSecurityPolicy: false - Disabled because the API returns only JSON data, not HTML. CSP is for preventing XSS in browsers rendering HTML.

2. hidePoweredBy: true - Removes the X-Powered-By header that reveals the server uses Express.js to prevent attackers from targeting known vulnerabilities in specific Express versions.

3. noSniff: true - Prevents browsers from MIME-sniffing responses, which could lead to security issues if JSON responses are incorrectly interpreted as HTML or executable content.

4. hsts - Enforces HTTPS connections for 1 year across all subdomains which protects against man-in-the-middle attacks by making sure all API communications occur over secure connections.

5. frameguard - Prevents clickjacking attacks by ensuring API responses cannot be embedded in iframes or frames from other domains.

6. referrerPolicy - Controls referrer information sharing with third parties. The "no-referrer" policy prevents information leakage about API endpoints in request headers.

7. dnsPrefetchControl - Disables DNS prefetching to prevent potential data leaks when API clients prefetch DNS information for domains in the response.

8. crossOriginResourcePolicy - Restricts cross-origin requests to only the same origin, preventing other domains from accessing API resources without proper authorization.

9. crossOriginOpenerPolicy - Isolates browsing contexts to the same origin, preventing malicious scripts from accessing the API window context in browser-based clients.

10. xssFilter - Enables the X-XSS-Protection header for older browsers, providing additional protection against reflected cross-site scripting attacks.

11. ieNoOpen - Prevents Internet Explorer from executing downloads in the context of the site, reducing potential attack vectors for file downloads.

### Sources
1. Helmet.js Official Documentation - https://helmetjs.github.io/

2. OWASP Secure Headers Project - https://owasp.org/www-project-secure-headers/