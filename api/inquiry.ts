import express from "express";
import { createInquiryRouter } from "../server/inquiry.js";

const app = express();
app.use(createInquiryRouter(["/api/inquiry", "/", "/inquiry"]));

export default app;
