import { model, Schema } from 'mongoose';

const reviewSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  testimonial: {
    type: String,
    required: true,
    trim: true,
  },
});

export const Review = model('Review', reviewSchema);
