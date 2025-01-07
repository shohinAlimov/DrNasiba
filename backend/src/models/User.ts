import mongoose, { Document } from 'mongoose';

// Define the IUser interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  logo?: string; // Optional field
}

// Create the schema for the User model
const AppointmentSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Store date as a string (e.g., "YYYY-MM-DD")
  time: { type: String, required: true }, // Store time as a string (e.g., "HH:mm")
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, default: '' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    logo: { type: String, default: '' },
    appointments: [AppointmentSchema], // Array of appointment objects
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

export default User;

