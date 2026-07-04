// import { Router } from "express";
// import { REGISTER, LOGIN, PROFILE } from "./Requesthandeler.js";
// import { authMiddleware } from "./Middleware/AuthMiddleware.js";

// const router = Router();

// router.post("/register", REGISTER);
// router.post("/login", LOGIN);
// router.get("/profile", authMiddleware, PROFILE);

// export default router;










import { Router } from "express";

import {
  REGISTER,
  LOGIN,
  PROFILE,
  ADD_TASK,
  GET_TASKS,
  GET_SINGLE_TASK,
  UPDATE_TASK,
  DELETE_TASK
} from "./Requesthandeler.js";

import { authMiddleware } from "./Middleware/AuthMiddleware.js";

const router = Router();

router.post("/register", REGISTER);
router.post("/login", LOGIN);
router.get("/profile", authMiddleware, PROFILE);

router.post("/tasks", authMiddleware, ADD_TASK);
router.get("/tasks", authMiddleware, GET_TASKS);
router.get("/tasks/:id", authMiddleware, GET_SINGLE_TASK);
router.put("/tasks/:id", authMiddleware, UPDATE_TASK);
router.delete("/tasks/:id", authMiddleware, DELETE_TASK);

export default router;