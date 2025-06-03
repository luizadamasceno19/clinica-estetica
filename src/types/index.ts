
export interface Doctor {
  id: string;
  code: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Report {
  doctorName: string;
  specialty: string;
  appointmentCount: number;
  completedCount: number;
  cancelledCount: number;
}
