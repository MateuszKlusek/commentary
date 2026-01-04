import express from "express";
import cors from "cors";
import router from "./routes";

const app = express();

const PORT = 3000;

app.use(cors());

app.use((req, res, next) => {
  setTimeout(next, 300);
});

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
