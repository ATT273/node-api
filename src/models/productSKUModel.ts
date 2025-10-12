import mongoose, { Schema, Document, Model } from "mongoose";
import { IProductImage } from "./productModel";

export interface IProductSku extends Document {
  id: string;
  productId: mongoose.Types.ObjectId;
  price: number;
  qty: number;
  sku: string;
}

export interface IProductSkuPayload {
  id?: string;
  productId: mongoose.Types.ObjectId;
  price: number;
  qty: number;
  sku: string;
  size?: string;
  images: IProductImage[];
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
});

ProductSKUSchema.statics.storeProductSKU = async function (data: IProductSkuPayload[]) {
  const productSku = await this.insertMany(data);
  return productSku;
};

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

const ProductSku = mongoose.model<IProductSku, IProductSkuModel>("ProductSkus", ProductSKUSchema);
export default ProductSku;
