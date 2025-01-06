export type AppointmentSlot = {
  time: string;
  status: 'Свободно' | 'Занято';
};

export type AppointmentData = {
  [key: string]: AppointmentSlot[];
};

export type BookingFormData = {
  date: Date;
  time: string;
};
