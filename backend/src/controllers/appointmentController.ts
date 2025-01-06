import { Request, Response } from 'express';
import User from '../models/User';

interface AppointmentRequestBody {
  name: string;
  phone: string;
  email: string;
  description?: string; // Optional
  date: string;
  time: string;
}

// For logged-in users
export const bookAppointmentWithAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { date, time, description } = req.body;

    // Use the user ID from the request
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if the time slot is already booked by this user
    const isAlreadyBooked = user.appointments.some(
      (appointment) => appointment.date === date && appointment.time === time
    );
    if (isAlreadyBooked) {
      res.status(400).json({ message: 'This time slot is already booked.' });
      return;
    }

    // Add appointment
    user.appointments.push({ date, time, description });
    await user.save();

    res.status(201).json({ message: 'Appointment booked successfully.', appointments: user.appointments });
  } catch (error) {
    res.status(500).json({ message: 'Failed to book appointment.' });
  }
};


// For non-account users
export const bookAppointmentWithoutAccount = async (
  req: Request<{}, {}, AppointmentRequestBody>,
  res: Response
): Promise<void> => {
  const { name, phone, email, description, date, time } = req.body;

  if (!name || !phone || !email || !date || !time) {
    res.status(400).json({ message: 'All required fields must be filled.' });
    return;
  }

  try {
    // Save appointment logic (e.g., sending email or saving in a separate collection)
    res.status(201).json({ message: 'Appointment booked successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to book appointment.' });
  }
};
