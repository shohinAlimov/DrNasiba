import express from 'express';
import { bookAppointmentWithoutAccount, bookAppointmentWithAccount } from '../controllers/appointmentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public route for non-account users
router.post('/', bookAppointmentWithoutAccount);

// Protected route for logged-in users
router.post('/with-account', protect, bookAppointmentWithAccount);

export default router;
