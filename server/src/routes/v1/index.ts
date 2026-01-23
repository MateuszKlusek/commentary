import { Router } from "express";
import psqlRoutes from "./psql.routes";

const router: Router = Router();

router.use("/psql", psqlRoutes);

export default router;
