
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search as SearchIcon, Calendar, User, Stethoscope, Clock } from 'lucide-react';

const Search = () => {
  const { appointments, doctors } = useApp();
  const [searchDoctor, setSearchDoctor] = useState('');
  const [searchSpecialty, setSearchSpecialty] = useState('');
  const [searchDate, setSearchDate] = useState('');

  const specialties = [...new Set(doctors.map(d => d.specialty))];

  const filteredAppointments = appointments.filter(appointment => {
    const matchesDoctor = !searchDoctor || 
      appointment.doctorName.toLowerCase().includes(searchDoctor.toLowerCase());
    
    const matchesSpecialty = !searchSpecialty || 
      appointment.specialty === searchSpecialty;
    
    const matchesDate = !searchDate || 
      appointment.date === searchDate;
    
    return matchesDoctor && matchesSpecialty && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Agendada';
      case 'completed':
        return 'Concluída';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pesquisar Consultas</h1>
        <p className="text-gray-600 mt-2">Encontre consultas por médico, especialidade ou data</p>
      </div>

      {/* Search Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="doctor">Buscar por Médico</Label>
            <div className="relative mt-2">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="doctor"
                placeholder="Nome do médico..."
                value={searchDoctor}
                onChange={(e) => setSearchDoctor(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="specialty">Filtrar por Especialidade</Label>
            <Select value={searchSpecialty} onValueChange={setSearchSpecialty}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecione a especialidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as especialidades</SelectItem>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date">Filtrar por Data</Label>
            <Input
              id="date"
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="mt-2"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2 mt-4">
          <button
            onClick={() => {
              setSearchDoctor('');
              setSearchSpecialty('');
              setSearchDate('');
            }}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Limpar Filtros
          </button>
          <button
            onClick={() => setSearchDate(new Date().toISOString().split('T')[0])}
            className="px-4 py-2 text-sm text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Consultas de Hoje
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resultados</CardTitle>
            <SearchIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredAppointments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendadas</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {filteredAppointments.filter(a => a.status === 'scheduled').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredAppointments.filter(a => a.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canceladas</CardTitle>
            <Stethoscope className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {filteredAppointments.filter(a => a.status === 'cancelled').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{appointment.patientName}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Stethoscope className="w-4 h-4" />
                        <span>{appointment.doctorName}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-blue-600 font-medium">
                        <User className="w-4 h-4" />
                        <span>{appointment.specialty}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
                        <Calendar className="w-5 h-5" />
                        <span>{new Date(appointment.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.time}</span>
                      </div>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma consulta encontrada</h3>
            <p className="text-gray-600">
              {searchDoctor || searchSpecialty || searchDate
                ? 'Tente ajustar os filtros de busca'
                : 'Use os filtros acima para encontrar consultas específicas'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
