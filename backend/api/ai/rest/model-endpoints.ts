import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  // List models
  // ...implementation...
});

router.post("/enable", (req, res) => {
  // Enable a model
  // ...implementation...
});

router.post("/disable", (req, res) => {
  // Disable a model
  // ...implementation...
});

export default router;
