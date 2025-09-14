import express from "express";
import requireAuth from "../middleware/requireAuth";
import {
  getUserList,
  getUserDetails,
  updateProfile,
  updatePassword,
  assignRole,
  deleteUser,
  createUser,
  updateUser,
} from "../controllers/userController";

const router = express.Router();
router.use(requireAuth);

router.get("/:id", getUserDetails);
router.patch("/:id", updateProfile);
router.patch("/password/:id", updatePassword);
router.get("/", getUserList);
router.get("/:id/assign", assignRole);
router.delete("/:id", deleteUser);
router.post("", createUser);
router.put("/:id", updateUser);

export default router;
