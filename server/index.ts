import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initDatabasePersistence } from "./db-persistence";
import { generateAllSitemaps, scheduleSitemapGeneration } from "./sitemap-generator";
import compression from "compression";

const app = express();

// Enable gzip compression with optimized settings
app.use(compression({
  // Compression level (1-9, where 9 is maximum compression but slower)
  level: 6,
  // Don't compress responses smaller than 1KB
  threshold: 1024,
  // Compress all HTTP methods
  filter: (req, res) => {
    // Don't compress if client doesn't accept it
    if (req.headers['x-no-compression']) {
      return false;
    }
    
    // Use standard compression for everything else
    return compression.filter(req, res);
  }
}));

// Add performance-related headers
app.use((req, res, next) => {
  // Enable CORS for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Performance and security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Disable HTTP caching for API responses
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
  }
  
  next();
});

// Parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Initialize database persistence system
  await initDatabasePersistence();
  
  // Set up scheduled sitemap generation for SEO
  try {
    scheduleSitemapGeneration();
  } catch (error) {
    console.error('Error setting up sitemap generation:', error);
  }
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Try to use port from environment variable, fallback to 5000 if not available
  // Using 5000 instead of 3000 to avoid common conflicts
  const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
  
  // Function to try binding to a port with a maximum number of attempts
  const startServer = (port: number, maxAttempts: number = 3, attempt: number = 1) => {
    server.listen(port, '0.0.0.0', () => {
      log(`Server is running on port ${port}`);
    }).on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE' && attempt < maxAttempts) {
        const nextPort = port + 1;
        log(`Port ${port} is in use, trying port ${nextPort}... (attempt ${attempt} of ${maxAttempts})`);
        startServer(nextPort, maxAttempts, attempt + 1);
      } else if (err.code === 'EADDRINUSE') {
        log(`Failed to find an available port after ${maxAttempts} attempts.`);
        log(`Please specify a different port using the PORT environment variable.`);
        process.exit(1);
      } else {
        log(`Error starting server: ${err.message}`);
        process.exit(1);
      }
    });
  };
  
  // Start the server with the initial port
  startServer(PORT);
})();
