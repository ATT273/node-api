import mongoose from 'mongoose';
import validator from 'validator';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  main_category: {
    type: String,
    required: true,
  },
  sub_category: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    default: 'pcs',
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: true,
  },
  imp_price: {
    type: Number,
    required: true,
  },
  qty: {
    type: Number,
    default: 0,
  },
  size: {
    type: Array,
    default: [],
  }
}, { timestamps: true });

ProductSchema.statics.storeProduct = async function (data) {

  if (!data.name) {
    throw new Error('product name is required');
  }
  if (!data.main_category) {
    throw new Error('main_category is required');
  }
  if (!data.sub_category) {
    throw new Error('sub_category is required');
  }
  if (!data.price) {
    throw new Error(' price is required');
  }
  if (!data.imp_price) {
    throw new Error('imp_price is required');
  }
  if (data.price < 0 || data.imp_price < 0) {
    throw new Error('price and imp_price must be positive');
  }
  const product = await this.create(data);
  return product;
}

ProductSchema.statics.updateProduct = async function (data) {

  if (!data.name) {
    throw new Error('product name is required');
  }
  if (!data.main_category) {
    throw new Error('main_category is required');
  }
  if (!data.sub_category) {
    throw new Error('sub_category is required');
  }
  if (!data.price) {
    throw new Error(' price is required');
  }
  if (!data.imp_price) {
    throw new Error('imp_price is required');
  }
  if (data.price < 0 || data.imp_price < 0) {
    throw new Error('price and imp_price must be positive');
  }
  const product = await this.findOne({ _id: data.id });
  console.log('prod', product);
  if (!product) {
    throw new Error('Product not found');
  }
  product.name = data.name;
  product.main_category = data.main_category;
  product.sub_category = data.sub_category;
  product.price = data.price;
  product.imp_price = data.imp_price;
  product.qty = data.qty;
  product.size = data.size;
  product.description = data.description;
  await product.save().then((updatedproduct) => {
    return updatedproduct;
  });
}
export default mongoose.model('products', ProductSchema);