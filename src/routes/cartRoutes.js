import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  getCartItems,
  updateCart,
} from '../controllers/cartController.js';

const router = Router();

router.get('/api/cart', authenticate, getCartItems);
router.put('/api/cart/update', authenticate, updateCart);

export default router;
