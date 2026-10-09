import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createInquiryRouter } from "./inquiry.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

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

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
