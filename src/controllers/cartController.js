import { Cart } from '../models/cart.js';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import { Product } from '../models/product.js';

export const getCartItems = async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ userId }).populate(
    'items.productId',
    'name photo price suppliers stock category',
  );

  if (!cart) {
    return res.status(200).json({
      items: [],
      total: 0,
    });
  }

  const items = cart.items.map((item) => ({
    product: item.productId,
    quantity: item.quantity,
  }));

  const total = items.reduce((sum, item) => {
    if (!item.product) return sum;

    return sum + Number(item.product.price) * item.quantity;
  }, 0);

  res.status(200).json({
    items,
    total: Number(total.toFixed(2)),
  });
};

export const updateCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(productId)) {
    throw createHttpError(400, 'Invalid product ID');
  }

  if (
    !Number.isInteger(quantity) ||
    quantity < 0
  ) {
    throw createHttpError(400, 'Invalid quantity');
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw createHttpError(404, 'Product not found');
  }

  if (quantity > Number(product.stock)) {
    throw createHttpError(400, 'Not enough stock');
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({
      userId,
      items: [],
    });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId,
  );

  if (quantity === 0) {
    if (itemIndex !== -1) {
      cart.items.splice(itemIndex, 1);
    }
  } else if (itemIndex !== -1) {
    cart.items[itemIndex].quantity = quantity;
  } else {
    cart.items.push({
      productId,
      quantity,
    });
  }

  await cart.save();

  res.status(200).json({
    message: 'Cart updated successfully',
  });
};
