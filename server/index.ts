import express from "express";
import { createServer } from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createInquiryRouter } from "./inquiry.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

process.env.NODE_ENV = process.env.NODE_ENV || "production";

const staticPath =
  process.env.NODE_ENV === "production"
    ? path.resolve(dirname, "public")
    : path.resolve(dirname, "..", "dist", "public");
const indexPath = path.join(staticPath, "index.html");

export const app = express();
export const server = createServer(app);

app.use(createInquiryRouter());
app.use(express.static(staticPath));

app.get("*", (req, res) => {
  if (req.path.includes(".") && !req.path.endsWith(".html")) {
    res.status(404).end();
    return;
  }

  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath, (error) => {
      if (error && !res.headersSent) {
        res.status(500).send("Error loading index.html");
      }
    });
    return;
  }

  res
    .status(404)
    .send("Frontend build not found. Please run 'npm run build' first.");
});

export async function startServer() {
  const port = Number(process.env.PORT) || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

if (!process.env.VERCEL) {
  startServer().catch(console.error);
}

export default app;
