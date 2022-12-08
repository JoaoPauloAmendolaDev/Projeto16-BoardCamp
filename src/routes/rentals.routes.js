import { Router } from "express";
import {
  rentalsPostFinalMiddleware,
  rentalsPostMiddleware,
} from "../middlewares/rentals.middlewares.js";

const router = Router();

router.post("/rentals", rentalsPostMiddleware, rentalsPostFinalMiddleware);

export default router;
