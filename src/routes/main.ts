import { Router } from "express";
import * as mainConstroller from "../controllers/mainController";

export const MainRoutes = Router();

MainRoutes.get("/api/ping", (req, res) => {
  res.status(200).json({
    ping: "pong",
  });
});

MainRoutes.get("/posts", mainConstroller.getAllPosts);
MainRoutes.get("/posts/:slug", mainConstroller.getPost);
MainRoutes.get("/posts/:slug/related", mainConstroller.getRelatedPosts);
