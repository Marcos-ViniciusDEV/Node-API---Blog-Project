import { Router } from "express";

export const router = Router();

router.get("/api/ping", (req, res) => {
  res.status(200).json({
    ping: "pong",
  });
});
