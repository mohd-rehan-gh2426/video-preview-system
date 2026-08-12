import { Router } from "express";
import { completeUpload, getSignedUploadUrl,getVideo,getVideos } from "../controllers/video.controllers.js";

const router = Router();

router.post("/upload-url", getSignedUploadUrl);
router.post("/:videoId/complete", completeUpload);
router.get("/", getVideos);
router.get("/:videoId", getVideo);

export default router;
