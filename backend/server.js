import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import videoRoutes from "./routes/video.routes.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);

app.use("/video", videoRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
