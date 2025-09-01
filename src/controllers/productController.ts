import { Types } from "mongoose";
import Product, { IProductPayload } from "../models/productModel";
import ProductSKU, {
  IProductSku,
  IProductSkuPayload,
} from "../models/productSKUModel";
import { validateProductSKU } from "../utils/validate.util";

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
    const product = await Product.getProductDetails(id);
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
  const {
    name,
    mainCategory,
    subCategory,
    price,
    importPrice,
    qty,
    sizes,
    description,
    unit,
  }: IProductPayload = req.body;
  try {
    const product = await Product.storeProduct({
      name,
      mainCategory,
      subCategory,
      price,
      importPrice,
      qty,
      sizes,
      description,
      unit,
    });
    res.status(200).json({ status: 200, data: product });
  } catch (error) {
    res.status(400).json({ status: 404, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const {
    name,
    mainCategory,
    subCategory,
    price,
    importPrice,
    qty,
    sizes,
    description,
    unit,
  } = req.body;
  const { id } = req.params;
  try {
    const product = await Product.updateProduct({
      id,
      name,
      mainCategory,
      subCategory,
      price,
      importPrice,
      qty,
      sizes,
      description,
      unit,
    });
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
    await Product.deleteOne({ _id: id });
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
  const data: IProductSkuPayload[] = req.body;
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ status: 400, message: "Product ID is required" });
    return;
  }
  const { errorMessage, index } = validateProductSKU(data);
  if (errorMessage) {
    res
      .status(400)
      .json({ status: 400, message: `variant at ${index}: ${errorMessage}` });
    return;
  }
  const mappedData = data.map((item) => ({
    ...item,
    productId: id,
  }));

  try {
    const result = await ProductSKU.updateProductSKU(mappedData);
    res.status(200).json({ status: 200, message: "success", data: result });
  } catch (error) {
    res.status(400).json({ status: 404, message: error.message });
  }
};

export const createSKU = async (req, res) => {
  const data: IProductSkuPayload[] = req.body;
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ status: 400, message: "Product ID is required" });
    return;
  }
  const { errorMessage, index } = validateProductSKU(data);
  if (errorMessage) {
    res
      .status(400)
      .json({ status: 400, message: `variant at ${index}: ${errorMessage}` });
    return;
  }

  const mappedData = data.map((item) => {
    return {
      ...item,
      productId: id,
    };
  });

  try {
    const productSkus = await ProductSKU.storeProductSKU(mappedData);
    res
      .status(200)
      .json({ status: 200, message: "success", data: productSkus });
  } catch (error) {
    res.status(400).json({ status: 404, message: error.message });
  }
};
