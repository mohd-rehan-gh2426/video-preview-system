import { Router } from "express";
import { getSignedUploadUrl } from "../controllers/video.controllers.js";

const router = Router();

router.post("/upload-url", getSignedUploadUrl);

export default router;
