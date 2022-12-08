import { Router } from "express";
import {
  costumersPostMiddleware,
  customerPutMiddleware,
} from "../middlewares/costumers.middlewares.js";
import {
  customersPostController,
  customersGetController,
  customersGetOneController,
} from "../controllers/costumers.controller.js";
const router = Router();

router.get("/customers", customersGetController);
router.get("/customers/:id", customersGetOneController);
router.post("/customers", costumersPostMiddleware, customersPostController);
router.put("/customers/:id", customerPutMiddleware);

export default router;
