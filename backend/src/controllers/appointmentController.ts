import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
import Appointment from '../models/Appointment';

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '14:00',
  '15:00', '16:00', '17:00'
];

export const getAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date } = req.query;

    if (!date || typeof date !== 'string') {
      res.status(400).json({ error: 'Date parameter is required' });
      return;
    }

    const existingAppointments = await Appointment.find({
      date: new Date(date)
    });

    const appointmentMap = new Map(
      existingAppointments.map(app => [app.time, app])
    );

    const slots = TIME_SLOTS.map(time => ({
      time,
      status: appointmentMap.has(time) ? 'Занято' : 'Свободно'
    }));

    res.json(slots);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const bookAppointment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { date, time } = req.body;

    // Add type guard for user
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const userId = req.user.id;

    if (!date || !time) {
      res.status(400).json({ error: 'Date and time are required' });
      return;
    }

    const existingAppointment = await Appointment.findOne({
      date: new Date(date),
      time,
    });

    if (existingAppointment) {
      res.status(409).json({ error: 'This appointment slot is already booked' });
      return;
    }

    const appointment = new Appointment({
      date: new Date(date),
      time,
      status: 'Занято',
      userId,
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserAppointments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Add type guard for user
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const userId = req.user.id;

    const appointments = await Appointment.find({ userId })
      .sort({ date: 1, time: 1 })
      .exec();

    // Map _id to id for frontend consistency
    const formattedAppointments = appointments.map((appt) => ({
      id: appt._id, // Ensure this correctly maps _id to id
      date: appt.date,
      time: appt.time,
      status: appt.status,
    }));

    res.json(formattedAppointments); // Send formatted appointments
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const deleteAppointment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Add type guard for user
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    const userId = req.user.id;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }

    if (appointment.userId.toString() !== userId) {
      res.status(403).json({ error: 'Not authorized to delete this appointment' });
      return;
    }

    await appointment.deleteOne();
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};