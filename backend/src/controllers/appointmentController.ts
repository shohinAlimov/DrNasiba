import { Request, Response } from 'express';
import Appointment, { IAppointment } from '../models/Appointment';

// Time slots configuration
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

    // Get existing appointments for the date
    const existingAppointments = await Appointment.find({
      date: new Date(date)
    });

    // Create a map of existing appointments
    const appointmentMap = new Map(
      existingAppointments.map(app => [app.time, app])
    );

    // Generate all time slots with their status
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

export const bookAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, time } = req.body;

    if (!date || !time) {
      res.status(400).json({ error: 'Date and time are required' });
      return;
    }

    // Check if the appointment already exists
    const existingAppointment = await Appointment.findOne({
      date: new Date(date),
      time
    });

    if (existingAppointment) {
      res.status(409).json({ error: 'This appointment slot is already booked' });
      return;
    }

    // Create new appointment
    const appointment = new Appointment({
      date: new Date(date),
      time,
      status: 'Занято'
    });

    await appointment.save();

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};