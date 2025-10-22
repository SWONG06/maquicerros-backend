import express from "express";
import { Router } from "express";
import { stripeWebhook } from "../webhooks/stripeWebhook.js";

const router = Router();

router.post("/stripe", express.raw({ type: "application/json" }), stripeWebhook);

export default router;
