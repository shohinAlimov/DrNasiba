import express, { Router } from 'express';
import { getAppointments, bookAppointment } from '../controllers/appointmentController';

const router: Router = express.Router();

router.get('/', getAppointments);
router.post('/book', bookAppointment);

export default router;