import express from "express";
import { createServer } from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find the static directory whether running from /server/index.ts (source) or /dist/index.js (bundled)
function getStaticPath(): string {
  const candidates = [
    path.resolve(__dirname, "public"), // dist/index.js output directory -> dist/public
    path.resolve(__dirname, "..", "dist", "public"), // server/index.ts source -> ../dist/public
    path.resolve(process.cwd(), "dist", "public"), // fallback relative to working directory
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return path.resolve(process.cwd(), "dist", "public");
}

async function startServer() {
  process.env.NODE_ENV = process.env.NODE_ENV || "production";

  const app = express();
  const server = createServer(app);

  const staticPath = getStaticPath();
  const indexPath = path.join(staticPath, "index.html");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for SPA routes
  app.get("*", (req, res) => {
    // If request has a file extension that was not found by express.static, return 404 instead of index.html
    if (req.path.includes(".") && !req.path.endsWith(".html")) {
      res.status(404).end();
      return;
    }

    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath, (err) => {
        if (err && !res.headersSent) {
          res.status(500).send("Error loading index.html");
        }
      });
    } else {
      res
        .status(404)
        .send("Frontend build not found. Please run 'npm run build' first.");
    }
  });

  const port = Number(process.env.PORT) || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);

