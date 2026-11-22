import { Product } from '../models/product.js';

export const getProducts = async (req, res, next) => {
  try {
    const { search, category } = req.query;

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = 12;
    const skip = (page - 1) * limit;

    const filter = {};

    if (search) {
      filter.name = {
        $regex: String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        $options: 'i',
      };
    }

    if (category) {
      filter.category = category;
    }

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ _id: 1 }).skip(skip).limit(limit),
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
