import express from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { getUserDetails, updateUser, uploadLogo } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/me', protect, getUserDetails); // Get user details
router.put('/me', protect, updateUser); // Update user details
router.put('/me/logo', protect, upload.single('logo'), uploadLogo); // Upload and update user logo

export default router;
