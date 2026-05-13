import {Router} from "express";

import { postNotify } from "../controllers/notifyController.js";

const router = Router();

router.post("/notify", postNotify);

export default router;