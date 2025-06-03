
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Calendar, Users, Stethoscope, Clock, TrendingUp, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { doctors, patients, appointments } = useApp();
  
  const todayAppointments = appointments.filter(apt => 
    apt.date === new Date().toISOString().split('T')[0]
  );
  
  const completedAppointments = appointments.filter(apt => apt.status === 'completed');
  const upcomingAppointments = appointments.filter(apt => 
    apt.status === 'scheduled' && new Date(apt.date) >= new Date()
  );

  const stats = [
    {
      title: 'Total de Médicos',
      value: doctors.length,
      icon: Stethoscope,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total de Pacientes',
      value: patients.length,
      icon: Users,
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-600'
    },
    {
      title: 'Consultas Hoje',
      value: todayAppointments.length,
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600'
    },
    {
      title: 'Próximas Consultas',
      value: upcomingAppointments.length,
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      textColor: 'text-orange-600'
    }
  ];

  const recentAppointments = appointments.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Visão geral da clínica de estética</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
              {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Consultas Recentes</h2>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentAppointments.length > 0 ? (
                recentAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{appointment.patientName}</p>
                      <p className="text-sm text-gray-600">{appointment.doctorName}</p>
                      <p className="text-xs text-gray-500">{appointment.specialty}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(appointment.date).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-sm text-gray-600">{appointment.time}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        appointment.status === 'scheduled' 
                          ? 'bg-blue-100 text-blue-800' 
                          : appointment.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status === 'scheduled' ? 'Agendada' : 
                         appointment.status === 'completed' ? 'Concluída' : 'Cancelada'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Nenhuma consulta encontrada</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Estatísticas Rápidas</h2>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Consultas Completadas</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(completedAppointments.length / appointments.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {completedAppointments.length}/{appointments.length}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Ocupação Hoje</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(todayAppointments.length / 10) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {todayAppointments.length}/10
                  </span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Especialidade mais procurada</p>
                <p className="text-lg font-bold text-blue-600 mt-1">Dermatologia Estética</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
