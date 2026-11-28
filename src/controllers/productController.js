import { Product } from '../models/product.js';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';

export const getProducts = async (req, res, next) => {
  try {
    const { search, category, discount } = req.query;

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = 12;
    const skip = (page - 1) * limit;

    const filter = {};

    if (search) {
      filter.name = {
        $regex: String(search)
          .trim()
          .replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        $options: 'i',
      };
    }

    if (category) {
      filter.category = category;
    }

    if (discount !== undefined) {
      if (
        typeof discount !== 'string' ||
        !/^\d+$/.test(discount) ||
        Number(discount) > 100
      ) {
        throw createHttpError(
          400,
          'Discount must be an integer between 0 and 100'
        );
      }

      filter.discount = Number(discount);
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ _id: 1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      products,
      total,
      page,
      perPage: limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw createHttpError(400, 'Invalid product ID');
  }

  const product = await Product.findById(id);

  if (!product) {
    throw createHttpError(404, 'Product not found');
  }

  res.status(200).json(product);
};
