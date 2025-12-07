import express from "express";
import requireAuth from "../middleware/requireAuth";
import {
  getInventoryList,
  createInventory,
  deleteInventory,
  getInventoriesByType,
  getInventoryDetail,
  updateInventory,
} from "../controllers/inventoryController";

const router = express.Router();
router.use(requireAuth);

router.get("/", getInventoryList);
router.get("/:id", getInventoryDetail);
router.get("/type/:type", getInventoriesByType);
router.post("/", createInventory);
router.put("/:id", updateInventory);
router.delete("/:id", deleteInventory);

export default router;
