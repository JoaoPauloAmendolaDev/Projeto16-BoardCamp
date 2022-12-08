import { Router } from "express";
import {
  gamePostController,
  gamesGetterController,
} from "../controllers/games.controller.js";
import { gamePostMiddleware } from "../middlewares/games.middlewares.js";

const router = Router();

router.get("/games", gamesGetterController);
router.post("/games", gamePostMiddleware, gamePostController);

export default router;
