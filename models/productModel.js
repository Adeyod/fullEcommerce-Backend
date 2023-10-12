import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    description: { type: String, required: true },
    stock: { type: Number, required: true },
    price: { type: Number, required: true },
    // discountPercentage: { type: Number },
    images: { type: Object, required: false },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
