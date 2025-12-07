import mongoose, { Schema, Document, Model, FilterQuery } from "mongoose";
import ProductSku, { IProductSku } from "./productSKUModel";
import { IBaseMetadata, IBaseQuery } from "../types";

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

export interface IProductResponse extends Document {
  id: mongoose.Types.ObjectId;
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
  images: IProductImage[];
}

export interface IPaginatedResult<T> {
  data: T[];
  meta: IBaseMetadata;
}

export interface IProductImage {
  url: string;
  name: string;
  id: number;
}
interface IProductModel extends Model<IProduct> {
  getProductDetails(id: string): Promise<(IProduct & { skus: IProductSku[] }) | null>;
  storeProduct(product: IProductPayload): Promise<IProduct | null>;
  updateProduct(product: IProductPayload): Promise<IProduct | null>;
  getList(query: IBaseQuery): Promise<IPaginatedResult<IProductResponse>> | null;
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
    images: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

ProductSchema.virtual("skus", {
  ref: "ProductSku", // model liên kết
  localField: "_id", // field của Product
  foreignField: "productId", // field của ProductSku
});
ProductSchema.set("toObject", { virtuals: true });
ProductSchema.set("toJSON", { virtuals: true });

ProductSchema.statics.getList = async function (query: any) {
  try {
    const { page = 1, limit = 20, keyword = "", sortBy = "createdAt", sortOrder = "desc", filter = {} } = query;

    const skip = (page - 1) * limit;

    const conditions: FilterQuery<IProduct> = {};

    // 🔍 Search: ví dụ tìm theo "name"
    if (keyword) {
      conditions.name = { $regex: keyword, $options: "i" };
    }

    // 🔃 Sắp xếp
    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    // 🧮 Đếm tổng số bản ghi trước khi phân trang
    const total = await this.countDocuments(conditions);
    // 📋 Truy vấn Mongoose
    const result = await this.find(conditions).populate("skus").sort(sort).skip(skip).limit(limit).lean();

    const foramttedProducts = result.map((product) => {
      return {
        ...product,
        id: product._id.toString(),
        skus: product.skus.map((sku) => {
          return { ...sku, id: sku._id.toString() };
        }),
      };
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: foramttedProducts,
      meta: {
        page,
        limit,
        total,
        count: foramttedProducts.length,
        totalPages,
      },
    };
  } catch (err) {
    console.error("[getList] Error:", err);
    return {
      data: [],
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    };
  }
};

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
  product.unit = data.unit;
  product.images = data.images;
  await product.save().then((updatedProduct: IProduct) => {
    return updatedProduct;
  });
};

ProductSchema.statics.getProductDetails = async function (id: string) {
  const product = (await this.findById(id).lean().exec()) as IProduct | null;
  const foramttedProduct = product ? { ...product, id: product._id.toString() } : null;
  if (!product) return null;

  const skus = await ProductSku.find({
    productId: new mongoose.Types.ObjectId(id),
  }).lean<IProductSku[]>();
  const formattedSkus = skus.map((sku) => {
    return { ...sku, id: sku._id.toString() };
  });
  return { ...foramttedProduct, skus: formattedSkus };
};

const Product = mongoose.model<IProduct, IProductModel>("Product", ProductSchema);
export default Product;
