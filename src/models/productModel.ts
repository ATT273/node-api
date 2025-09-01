import mongoose, { Schema, Document, Model } from "mongoose";
import { IProductSku } from "./productSKUModel";
import ProductSku from "./productSKUModel";

export interface IProduct extends Document {
  name: string;
  mainCategory: string;
  subCategory: string;
  unit: string;
  description?: string;
  price: number;
  importPrice: number;
  qty: number;
  sizes: string[];
}
export interface IProductPayload {
  id?: string;
  name: string;
  mainCategory: string;
  subCategory: string;
  unit: string;
  description?: string;
  price: number;
  importPrice: number;
  qty: number;
  sizes: string[];
}

interface IProductModel extends Model<IProduct> {
  getProductDetails(
    id: string
  ): Promise<(IProduct & { skus: IProductSku[] }) | null>;
  storeProduct(product: IProductPayload): Promise<IProduct | null>;
  updateProduct(product: IProductPayload): Promise<IProduct | null>;
}

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mainCategory: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      default: "pcs",
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    importPrice: {
      type: Number,
      required: true,
    },
    qty: {
      type: Number,
      default: 0,
    },
    sizes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

ProductSchema.statics.storeProduct = async function (data: IProductPayload) {
  if (!data.name) {
    throw new Error("product name is required");
  }
  if (!data.mainCategory) {
    throw new Error("mainCategory is required");
  }
  if (!data.subCategory) {
    throw new Error("subCategory is required");
  }
  if (!data.price) {
    throw new Error(" price is required");
  }
  if (!data.importPrice) {
    throw new Error("importPrice is required");
  }
  if (data.price < 0 || data.importPrice < 0) {
    throw new Error("price and importPrice must be positive");
  }
  const product = await this.create(data);
  return product;
};

ProductSchema.statics.updateProduct = async function (data: IProductPayload) {
  if (!data.name) {
    throw new Error("product name is required");
  }
  if (!data.mainCategory) {
    throw new Error("mainCategory is required");
  }
  if (!data.subCategory) {
    throw new Error("subCategory is required");
  }
  if (!data.price) {
    throw new Error(" price is required");
  }
  if (!data.importPrice) {
    throw new Error("importPrice is required");
  }
  if (data.price < 0 || data.importPrice < 0) {
    throw new Error("price and importPrice must be positive");
  }
  const product = await this.findOne({ _id: data.id });

  if (!product) {
    throw new Error("Product not found");
  }
  product.name = data.name;
  product.mainCategory = data.mainCategory;
  product.subCategory = data.subCategory;
  product.price = data.price;
  product.importPrice = data.importPrice;
  product.qty = data.qty;
  product.size = data.sizes;
  product.description = data.description;
  await product.save().then((updatedProduct: IProduct) => {
    return updatedProduct;
  });
};

ProductSchema.statics.getProductDetails = async function (id: string) {
  const product = (await this.findById(id).lean().exec()) as IProduct | null;

  if (!product) return null;

  const skus = await ProductSku.find({
    productId: new mongoose.Types.ObjectId(id),
  }).lean<IProductSku[]>();

  return { ...product, skus };
};

const Product = mongoose.model<IProduct, IProductModel>(
  "Product",
  ProductSchema
);
export default Product;
