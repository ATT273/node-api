import express from "express";
import Product from "../models/productModel.js";
import requireAuth from "../middleware/requireAuth.js";
import {
  getProductList,
  getProductDetail,
  createProduct,
  deleteProduct,
  updateProduct,
  createSKU,
  updateSKU,
} from "../controllers/productController.js";

const router = express.Router();
router.use(requireAuth);

router.get("/", getProductList);
router.get("/:id", getProductDetail);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.post("/:id/product-sku", createSKU);
router.put("/:id/product-sku", updateSKU);
export default router;
