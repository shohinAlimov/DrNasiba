import express, { Router } from 'express';
import {
  getAppointments,
  bookAppointment,
  getUserAppointments,
  deleteAppointment,
} from '../controllers/appointmentController';
import { protect } from '../middleware/authMiddleware';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

const router: Router = express.Router();

// Type the routes properly
router.get('/', getAppointments);
router.post('/book', protect as express.RequestHandler, bookAppointment as express.RequestHandler);
router.get('/user', protect as express.RequestHandler, getUserAppointments as express.RequestHandler);
router.delete('/:id', protect as express.RequestHandler, deleteAppointment as express.RequestHandler);

export default router;