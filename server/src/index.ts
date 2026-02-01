import cors from "cors";
import express from "express";
import { globalErrorHandler } from "../global-error";
import router from "./routes";

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use((_req, _res, next) => {
  const delayMs = Math.floor(Math.random() * 200) + 150;
  console.log(`Delaying for ${delayMs}ms`);
  setTimeout(() => {
    next();
  }, delayMs);
});

app.use("/api", router);

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
