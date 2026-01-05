import cors from "cors";
import express from "express";
import router from "./routes";

const app = express();

const PORT = 3000;

app.use(cors());
app.use((_req, _res, next) => {
  const delayMs = Math.floor(Math.random() * 200) + 350;
  setTimeout(() => {
    next();
  }, delayMs);
});

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
