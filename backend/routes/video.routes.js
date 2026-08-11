import { Router } from "express";
import { completeUpload, getSignedUploadUrl } from "../controllers/video.controllers.js";

const router = Router();

router.post("/upload-url", getSignedUploadUrl);
router.post("/:videoId/complete", completeUpload);

export default router;
