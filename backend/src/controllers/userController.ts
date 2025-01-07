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

