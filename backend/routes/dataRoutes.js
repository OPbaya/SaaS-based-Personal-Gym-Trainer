// server/routes/userHealthData.routes.js
import express from "express";
import { auth } from "../middleware/auth.js";

import { insertData,  getData, getDailyData, gym_pdf} from "../controllers/data_controller.js";
import { dailyData } from "../controllers/data_controller.js";
import { pdf } from "../controllers/data_controller.js";
// import { requireAuth } from "../middleware/clerkAuth.js";

const router = express.Router();

router.post("/", auth, insertData);
router.get("/", auth, getData);
router.post("/daily", auth, dailyData)
router.get("/daily", auth, getDailyData)
router.get("/download", auth, pdf)
router.get("/download2", auth, gym_pdf)


export default router;
