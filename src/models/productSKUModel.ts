import mongoose, { Schema, Document, Model } from "mongoose";

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

ProductSKUSchema.statics.storeProductSKU = async function (
  data: IProductSkuPayload[]
) {
  const productSku = await this.insertMany(data);
  return productSku;
};

ProductSKUSchema.statics.updateProductSKU = async function (
  data: IProductSkuPayload[]
) {
  const _skus = data.map((item) => new ProductSku(item));
  const { insertedIds, upsertedIds } = await this.bulkSave(_skus);
  return { insertedIds, upsertedIds };
};

const ProductSku = mongoose.model<IProductSku, IProductSkuModel>(
  "ProductSkus",
  ProductSKUSchema
);
export default ProductSku;
