import mongoose from "mongoose";
import Product from "../models/productModel.js";
import ProductSKU from "../models/productSKUModel.js";

export const getProductList = async (req, res) => {
  // const { authorization } = req.headers
  // const claim = jwt.decode(authorization.split(' ')[1]);
  try {
    const products = await Product.find();
    if (!products) {
      res.status(404).json({ status: 404, message: "No products found" });
      return;
    }
    res.status(200).json({ status: 200, data: [...products] });
  } catch (error) {
    res.status(400).json({ status: 404, message: error.message });
  }
};

export const getProductDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ status: 404, message: "No products found" });
      return;
    }
    res.status(200).json({ status: 200, data: product });
  } catch (error) {
    res.status(400).json({ status: 404, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  const { name, main_category, sub_category, price, imp_price, qty, size } =
    req.body;
  try {
    const product = await Product.storeProduct({
      name,
      main_category,
      sub_category,
      price,
      imp_price,
      qty,
      size,
    });
    res.status(200).json({ status: 200, data: product });
  } catch (error) {
    res.status(400).json({ status: 404, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const {
    name,
    main_category,
    sub_category,
    price,
    imp_price,
    qty,
    size,
    description,
  } = req.body;
  const { id } = req.params;
  try {
    const product = await Product.updateProduct({
      id,
      name,
      main_category,
      sub_category,
      price,
      imp_price,
      qty,
      size,
      description,
    });
    console.log("product", product);
    res.status(200).json({ status: 200, message: "success", data: product });
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ status: 404, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const _existedProduct = await Product.findById({ _id: id });
    if (!_existedProduct) {
      res.status(404).json({ status: 404, message: "No products found" });
      return;
    }
    const product = await Product.deleteOne({ _id: id });
    res.status(200).json({ status: 200, message: "Product has been deleted" });
  } catch (error) {
    if (error.name === "CastError") {
      res
        .status(404)
        .json({ status: 404, message: "Invalid id. No products found" });
      return;
    }
    res.status(500).json({ status: 500, message: error.message });
  }
};

export const updateSKU = async (req, res) => {
  const { productId, sku, price, qty, properties } = req.body;
  const { id } = req.params;
  try {
    const product = await ProductSKU.updateProductSKU({
      id,
      productId,
      sku,
      price,
      qty,
      properties,
    });
    res.status(200).json({ status: 200, message: "success", data: product });
  } catch (error) {
    res.status(400).json({ status: 404, message: error.message });
  }
};
export const createSKU = async (req, res) => {
  const { productId, sku, price, qty, properties } = req.body;
  const { id } = req.params;
  try {
    const product = await ProductSKU.storeProductSKU({
      id,
      productId,
      sku,
      price,
      qty,
      properties,
    });
    res.status(200).json({ status: 200, message: "success", data: product });
  } catch (error) {
    res.status(400).json({ status: 404, message: error.message });
  }
};
