
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Doctor, Patient, Appointment } from '@/types';

interface AppContextType {
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  addDoctor: (doctor: Omit<Doctor, 'id'>) => void;
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteDoctor: (id: string) => void;
  deletePatient: (id: string) => void;
  deleteAppointment: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: '1',
      code: 'DR001',
      name: 'Dr. Ana Silva',
      specialty: 'Dermatologia Estética',
      email: 'ana.silva@clinica.com',
      phone: '(11) 99999-0001'
    },
    {
      id: '2',
      code: 'DR002',
      name: 'Dr. Carlos Mendes',
      specialty: 'Cirurgia Plástica',
      email: 'carlos.mendes@clinica.com',
      phone: '(11) 99999-0002'
    }
  ]);

  const [patients, setPatients] = useState<Patient[]>([
    {
      id: '1',
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      phone: '(11) 98888-0001',
      birthDate: '1985-05-15'
    },
    {
      id: '2',
      name: 'João Oliveira',
      email: 'joao.oliveira@email.com',
      phone: '(11) 98888-0002',
      birthDate: '1978-12-03'
    }
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      date: '2024-06-05',
      time: '14:00',
      patientId: '1',
      patientName: 'Maria Santos',
      doctorId: '1',
      doctorName: 'Dr. Ana Silva',
      specialty: 'Dermatologia Estética',
      status: 'scheduled'
    }
  ]);

  const addDoctor = (doctor: Omit<Doctor, 'id'>) => {
    const newDoctor = { ...doctor, id: Date.now().toString() };
    setDoctors(prev => [...prev, newDoctor]);
  };

  const addPatient = (patient: Omit<Patient, 'id'>) => {
    const newPatient = { ...patient, id: Date.now().toString() };
    setPatients(prev => [...prev, newPatient]);
  };

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment = { ...appointment, id: Date.now().toString() };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointment = (id: string, updatedAppointment: Partial<Appointment>) => {
    setAppointments(prev => 
      prev.map(apt => apt.id === id ? { ...apt, ...updatedAppointment } : apt)
    );
  };

  const deleteDoctor = (id: string) => {
    setDoctors(prev => prev.filter(doctor => doctor.id !== id));
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(patient => patient.id !== id));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
  };

  return (
    <AppContext.Provider value={{
      doctors,
      patients,
      appointments,
      addDoctor,
      addPatient,
      addAppointment,
      updateAppointment,
      deleteDoctor,
      deletePatient,
      deleteAppointment
    }}>
      {children}
    </AppContext.Provider>
  );
};
