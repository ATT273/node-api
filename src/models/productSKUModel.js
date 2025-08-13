import mongoose from "mongoose";
import validator from "validator";

const ProductSKUSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  properties: {
    type: Object,
    default: {
      size: "",
      color: "",
    },
    required: true,
  },
});

ProductSKUSchema.statics.storeProductSKU = async function (data) {
  if (!data.productId) {
    throw new Error("product id is required");
  }
  if (!data.sku) {
    throw new Error("sku code is required");
  }
  if (!data.properties) {
    throw new Error("properties is required");
  }
  if (!data.price) {
    throw new Error(" price is required");
  }
  if (!data.qty) {
    throw new Error("quantity is required");
  }
  if (data.price < 0) {
    throw new Error("price and imp_price must be positive");
  }
  const product = await this.insertMany(data);
  return product;
};

ProductSKUSchema.statics.updateProductSKU = async function (data) {
  if (!data.productId) {
    throw new Error("product id is required");
  }
  if (!data.sku) {
    throw new Error("sku code is required");
  }
  if (!data.properties) {
    throw new Error("properties is required");
  }
  if (!data.price) {
    throw new Error(" price is required");
  }
  if (!data.qty) {
    throw new Error("quantity is required");
  }
  if (data.price < 0) {
    throw new Error("price and imp_price must be positive");
  }
  const product = await this.findOne({ productId: data.id, sku: data.sku });
  if (!product) {
    throw new Error("Product not found");
  }
  product.productId = data.productId;
  product.sku = data.sku;
  product.price = data.price;
  product.qty = data.qty;
  product.properties = data.properties;
  await product.save().then((updatedProductSKU) => {
    return product;
  });
};

export default mongoose.model("productSKU", ProductSKUSchema);
