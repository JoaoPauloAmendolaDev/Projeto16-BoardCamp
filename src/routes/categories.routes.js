import { Router } from "express";
import {
  categoriesGetterController,
  categoriesPostController,
} from "../controllers/categories.controller.js";
import { categoriesPostMiddleware } from "../middlewares/categories.middlewares.js";

const router = Router();

router.get("/categories", categoriesGetterController);
router.post("/categories", categoriesPostMiddleware, categoriesPostController);

export default router;
