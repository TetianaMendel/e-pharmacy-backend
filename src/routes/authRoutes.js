import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  registerUser,
  loginUser,
  getUserInfo,
  logoutUser,
} from '../controllers/authController.js';
import {
  registerUserSchema,
  loginUserSchema,
} from '../validations/authValidation.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.post(
  '/api/user/register',
  celebrate(registerUserSchema),
  registerUser,
);

router.post(
  '/api/user/login',
  celebrate(loginUserSchema),
  loginUser,
);

router.get(
  '/api/user/user-info',
  authenticate,
  getUserInfo,
);

router.get(
  '/api/user/logout',
  authenticate,
  logoutUser,
);

export default router;
