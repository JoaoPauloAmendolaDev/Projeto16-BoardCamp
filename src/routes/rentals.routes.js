import { Router } from "express";
import { rentalsGetController } from "../controllers/rentals.controller.js";
import {
  rentalsPostFinalMiddleware,
  rentalsPostMiddleware,
  rentalsGetMiddleware,
} from "../middlewares/rentals.middlewares.js";

const router = Router();

router.get("/rentals", rentalsGetMiddleware, rentalsGetController);
router.post("/rentals", rentalsPostMiddleware, rentalsPostFinalMiddleware);
router.post("/rentals/:id/return", rentalsReturnMiddleware, rentalsReturnController)

export default router;
