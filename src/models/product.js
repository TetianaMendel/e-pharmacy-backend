import { model, Schema } from 'mongoose';

const productSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  suppliers: {
    type: String,
    required: true,
    trim: true,
  },
  stock: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
});

export const Product = model('Product', productSchema);
