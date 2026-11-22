import { Router } from 'express';
import { getNearestStores } from '../controllers/storeController.js';

const router = Router();

router.get('/api/stores/nearest', getNearestStores);

export default router;
