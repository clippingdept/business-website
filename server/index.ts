import express from "express";
import { createServer } from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createInquiryRouter } from "./inquiry.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
// fix
async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(createInquiryRouter());

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(dirname, "public")
      : path.resolve(dirname, "..", "dist", "public");

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

async function startServer() {
  process.env.NODE_ENV = process.env.NODE_ENV || "production";
  const port = Number(process.env.PORT) || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

// In standalone environments, start the server; in Vercel/serverless environments, export app
if (!process.env.VERCEL) {
  startServer().catch(console.error);
}

export { app, server, startServer };
export default app;


