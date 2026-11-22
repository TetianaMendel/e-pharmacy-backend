import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  getCartItems,
  updateCart,
  checkout,
} from '../controllers/cartController.js';

const router = Router();

router.get('/api/cart', authenticate, getCartItems);

router.put('/api/cart/update', authenticate, updateCart);

router.post('/api/cart/checkout', authenticate, checkout);

export default router;
