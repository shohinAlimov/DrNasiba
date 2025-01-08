import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { getUserDetails, updateUser, uploadLogo } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = express.Router();

// Public routes - these use regular Request type
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes - need type assertions for middleware and handlers
router.get(
  '/me',
  protect as express.RequestHandler,
  getUserDetails as express.RequestHandler
);

router.put(
  '/me',
  protect as express.RequestHandler,
  updateUser as express.RequestHandler
);

router.put(
  '/me/logo',
  protect as express.RequestHandler,
  upload.single('logo'),
  uploadLogo as express.RequestHandler
);

export default router;