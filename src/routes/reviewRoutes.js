import { Router } from 'express';
import { getCustomerReviews } from '../controllers/reviewController.js';

const router = Router();

router.get('/api/customer-reviews', getCustomerReviews);

export default router;
