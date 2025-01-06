import { Request, Response } from 'express';
import User from '../models/User';

// Get user details
export const getUserDetails = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user details
export const updateUser = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Update fields
    const { name, surname, email, phone } = req.body;
    if (name) user.name = name;
    if (surname) user.surname = surname;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    const updatedUser = await user.save();

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      surname: updatedUser.surname,
      email: updatedUser.email,
      phone: updatedUser.phone,
      logo: updatedUser.logo,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user logo
export const updateLogo = async (req: any, res: Response): Promise<void> => {
  try {
    const { logo } = req.body; // Expecting the logo URL or Base64 data
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.logo = logo;
    const updatedUser = await user.save();

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      logo: updatedUser.logo,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const uploadLogo = async (req: any, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.logo = `/uploads/${req.file.filename}`; // Save the uploaded file's path
    const updatedUser = await user.save();

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      surname: updatedUser.surname,
      email: updatedUser.email,
      phone: updatedUser.phone,
      logo: updatedUser.logo,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const addAppointment = async (req: any, res: Response): Promise<void> => {
  try {
    const { date, time } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if the time slot is already booked by the same user
    const isAlreadyBooked = user.appointments.some(
      (appointment) => appointment.date === date && appointment.time === time
    );
    if (isAlreadyBooked) {
      res.status(400).json({ message: 'This time slot is already booked.' });
      return;
    }

    // Add appointment to user's list
    user.appointments.push({ date, time });
    await user.save();

    res.status(201).json({ message: 'Appointment booked successfully.', appointments: user.appointments });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAppointments = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user.id).select('appointments');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user.appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
