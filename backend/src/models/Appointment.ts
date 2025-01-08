import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  date: Date;
  time: string;
  status: 'Свободно' | 'Занято';
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema: Schema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Свободно', 'Занято'],
    default: 'Свободно',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique appointments
AppointmentSchema.index({ date: 1, time: 1 }, { unique: true });

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);