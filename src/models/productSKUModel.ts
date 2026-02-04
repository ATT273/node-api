import mongoose, { Schema, Document, Model } from "mongoose";
import { IProductSkuImage, IProductSkuImagePayload } from "../types/product-sku.types";

export interface IProductSku extends Document {
  id: string;
  productId: mongoose.Types.ObjectId;
  price: number;
  qty: number;
  sku: string;
  images: IProductSkuImage[];
}

export interface IProductSkuPayload {
  id?: string;
  productId: mongoose.Types.ObjectId;
  price: number;
  qty: number;
  sku: string;
  size?: string;
  images: IProductSkuImagePayload[];
}
export interface IProductSkuUpsertData extends Omit<IProductSkuPayload, "id"> {
  _id?: mongoose.Types.ObjectId; // Use _id for existing documents
}
interface IProductSkuModel extends Model<IProductSku> {
  storeProductSKU(data: IProductSkuPayload[]): Promise<IProductSku | null>;
  updateProductSKU(data: IProductSkuPayload[]): Promise<IProductSku | null>;
}

const ProductSKUSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
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
  images: {
    type: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        url: { type: String, required: true },
        productImageId: { type: Number, required: true },
      },
    ],
  },
});

// ProductSKUSchema.statics.storeProductSKU = async function (data: IProductSkuPayload[]) {
//   const productSku = await this.insertMany(data);
//   return productSku;
// };

ProductSKUSchema.statics.updateProductSKU = async function (data: IProductSkuUpsertData[]) {
  const _skus = data.map((item) => {
    if (item._id) {
      return {
        updateOne: {
          filter: { _id: item._id },
          update: { $set: item },
          upsert: true,
        },
      };
    }

    // If no _id, insert as a new document
    return {
      insertOne: {
        document: item,
      },
    };
  });
  const { insertedIds, upsertedIds } = await this.bulkWrite(_skus);
  return { insertedIds, upsertedIds };
};

const ProductSku = mongoose.model<IProductSku, IProductSkuModel>("ProductSku", ProductSKUSchema);
export default ProductSku;
