import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import path from 'path';

// Helper function to generate a JWT token
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '1h', // Token expiration time
  });
};

// Register User
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Account already taken' }); // Stop execution if user exists
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    const createdUser = await user.save();

    // Generate token for the new user
    const token = generateToken(createdUser.id);

    // Respond with the created user's details and token
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// Login User
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const token = generateToken(user.id);
    res.status(200).json({ id: user.id, name: user.name, email: user.email, token });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
