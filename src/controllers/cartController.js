
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import { Cart } from '../models/cart.js';
import { Product } from '../models/product.js';
import { Order } from '../models/order.js';

export const getCartItems = async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ userId }).populate(
    'items.productId',
    'name photo price suppliers stock category',
  );

  if (!cart) {
    return res.status(200).json({ items: [], total: 0 });
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

  if (!Number.isInteger(quantity) || quantity < 0) {
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

export const checkout = async (req, res) => {
  const userId = req.user._id;

  const { name, email, phone, address, paymentMethod } = req.body;

  if (!name || !email || !phone || !address || !paymentMethod) {
    throw createHttpError(400, 'All fields are required');
  }

  if (!['Cash On Delivery', 'Bank'].includes(paymentMethod)) {
    throw createHttpError(400, 'Invalid payment method');
  }

  const cart = await Cart.findOne({ userId }).populate('items.productId');

  if (!cart || cart.items.length === 0) {
    throw createHttpError(400, 'Cart is empty');
  }

  const items = cart.items.map((item) => {
    const product = item.productId;

    if (!product) {
      throw createHttpError(404, 'Product not found');
    }

    const price = Number(product.price);
    const stock = Number(product.stock);

    if (!Number.isFinite(price) || price < 0) {
      throw createHttpError(400, 'Invalid product price');
    }

    if (
      !Number.isFinite(stock) ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > stock
    ) {
      throw createHttpError(400, 'Not enough stock');
    }

    return {
      productId: product._id,
      name: product.name,
      price,
      quantity: item.quantity,
    };
  });

  const total = Number(
    items
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2),
  );

  const order = await Order.create({
    userId,
    name,
    email,
    phone,
    address,
    paymentMethod,
    items,
    total,
    status: 'Pending',
  });

  await Cart.updateOne(
    { _id: cart._id },
    { $set: { items: [] } },
  );

  res.status(201).json({
    message: 'Order placed successfully',
    order,
  });
};
