import { Router } from 'express';
import {
  getNearestStores,
  getStores,
} from '../controllers/storeController.js';

const router = Router();

router.get('/api/stores/nearest', getNearestStores);
router.get('/api/stores', getStores);

export default router;
