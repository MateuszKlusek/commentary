import { Router } from "express";

const router = Router();

router.get("/comments/count", (req, res) => {
  res.send({ count: 101 });
});

export default router;
