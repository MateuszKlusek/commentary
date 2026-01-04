import { Router } from "express";
import fileRoutes from "./file.routes";
import psqlRoutes from "./psql.routes";

const router = Router();

router.use("/file", fileRoutes);
router.use("/psql", psqlRoutes);

export default router;
