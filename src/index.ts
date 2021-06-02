import * as express from "express";
import * as enforce from "express-sslify";
import * as path from "path";

/**
 * Debug/production environment.
 */
const debug = !!parseInt(process.env.DEBUG);

/**
 * Port number to use.
 */
const port = parseInt(process.env.PORT) || 3000;

/**
 * Database URL.
 */
const dbURL = process.env.DATABASE_URL;

/**
 * Express app.
 */
const app = express();

// Disable caching for authentication purposes
app.set("etag", false);
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});

// Enforce HTTPS
if (!debug) {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

// Include static directory for css and js files
app.use(express.static(path.join(__dirname + "/../../app/dist/greenpoll")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname + "/../../app/dist/greenpoll/index.html"));
});

// Error 500 (internal server error)
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(500).json({ error: "Internal server error" });
  }
);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

// Export the express app
export = app;
