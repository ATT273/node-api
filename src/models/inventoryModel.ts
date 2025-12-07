import mongoose, { Schema, Document, Model, FilterQuery } from "mongoose";
import { IBaseMetadata, IBaseQuery } from "../types";

export interface IInventory extends Document {
  skuId: mongoose.Types.ObjectId;
  changeType: string;
  qtyChange: number;
  refOrderId?: mongoose.Types.ObjectId;
  note?: string;
}

export interface IInventoryListResponse extends Document {
  id: mongoose.Types.ObjectId;
  skuId: mongoose.Types.ObjectId;
  skuCode: string;
  productId: mongoose.Types.ObjectId;
  productName: string;
  changeType: string;
  qtyChange: number;
  refOrderId?: mongoose.Types.ObjectId;
  note?: string;
}

export interface IPaginatedResult<T> {
  data: T[];
  meta: IBaseMetadata;
}

export interface IInventoryPayload extends IInventory {}

const ChangeType = ["SALES", "IMPORT", "ADJUSTMENT", "RETURN"] as const;

interface IProductModel extends Model<IInventory> {
  getList(query: IBaseQuery): Promise<IPaginatedResult<IInventoryListResponse>> | null;
  storeInventory(product: IInventoryPayload): Promise<{ success: boolean; message: string } | null>;
}

const InventorySchema = new Schema(
  {
    skuId: {
      type: Schema.Types.ObjectId,
      ref: "ProductSku",
      required: true,
    },
    changeType: {
      type: String,
      enum: ChangeType,
      required: true,
    },
    qtyChange: {
      type: Number,
      required: true,
    },
    refOrderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

InventorySchema.statics.storeInventory = async function (data: IInventoryPayload) {
  if (!data.skuId) {
    throw new Error("skuId is required");
  }
  if (!data.changeType) {
    throw new Error("changeType is required");
  }
  if (!data.qtyChange) {
    throw new Error("qtyChange is required");
  }
  if (data.qtyChange < 0) {
    throw new Error("qtyChange must be positive");
  }
  const product = await this.create(data);
  return product;
};

InventorySchema.statics.getList = async function (query: any) {
  try {
    const { page = 1, limit = 20, search = "", sortBy = "createdAt", sortOrder = "desc", type } = query;

    const skip = (page - 1) * limit;
    const conditions: FilterQuery<IInventory> = {};

    // 🔍 Search: ví dụ tìm theo "note"
    if (search) {
      conditions.note = { $regex: search, $options: "i" };
    }

    // 🧩 Filter theo type (ChangeType)
    if (type) {
      conditions.changeType = type;
    }

    // 🔃 Sắp xếp
    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    // 🧮 Đếm tổng số bản ghi trước khi phân trang
    const total = await this.countDocuments(conditions);
    // 📋 Truy vấn Mongoose
    const result = await this.find(conditions)
      .populate({
        path: "skuId",
        select: "sku productId",
        populate: {
          path: "productId",
          select: "name",
        },
      }) // lấy thêm mã SKU nếu cần
      // .populate("refOrderId", "orderCode") // lấy thêm mã đơn hàng nếu có
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const flattenedResult = result.map((item) => ({
      ...item,
      id: item._id,
      skuId: item.skuId._id,
      skuCode: item.skuId.sku,
      productName: item.skuId.productId.name,
      productId: item.skuId.productId._id,
      refOrderId: item.refOrderId ? item.refOrderId._id : null,
      orderCode: item.refOrderId ? item.refOrderId.orderCode : null,
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      data: flattenedResult,
      meta: {
        page,
        limit,
        total,
        count: flattenedResult.length,
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

const Inventory = mongoose.model<IInventory, IProductModel>("Inventory", InventorySchema);
export default Inventory;
