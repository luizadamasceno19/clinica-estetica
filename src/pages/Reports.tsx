
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, Download, TrendingUp, Users, Calendar, Stethoscope } from 'lucide-react';

const Reports = () => {
  const { appointments, doctors } = useApp();
  const [reportType, setReportType] = useState('doctor');

  // Dados para relatório por médico
  const doctorReports = doctors.map(doctor => {
    const doctorAppointments = appointments.filter(apt => apt.doctorId === doctor.id);
    return {
      doctorName: doctor.name,
      specialty: doctor.specialty,
      total: doctorAppointments.length,
      completed: doctorAppointments.filter(apt => apt.status === 'completed').length,
      scheduled: doctorAppointments.filter(apt => apt.status === 'scheduled').length,
      cancelled: doctorAppointments.filter(apt => apt.status === 'cancelled').length
    };
  });

  // Dados para relatório por especialidade
  const specialtyReports = [...new Set(doctors.map(d => d.specialty))].map(specialty => {
    const specialtyAppointments = appointments.filter(apt => apt.specialty === specialty);
    return {
      specialty,
      total: specialtyAppointments.length,
      completed: specialtyAppointments.filter(apt => apt.status === 'completed').length,
      scheduled: specialtyAppointments.filter(apt => apt.status === 'scheduled').length,
      cancelled: specialtyAppointments.filter(apt => apt.status === 'cancelled').length
    };
  });

  // Dados para gráfico de pizza - status das consultas
  const statusData = [
    { name: 'Agendadas', value: appointments.filter(apt => apt.status === 'scheduled').length, color: '#3B82F6' },
    { name: 'Concluídas', value: appointments.filter(apt => apt.status === 'completed').length, color: '#10B981' },
    { name: 'Canceladas', value: appointments.filter(apt => apt.status === 'cancelled').length, color: '#EF4444' }
  ];

  // Dados para gráfico de barras por mês
  const monthlyData = appointments.reduce((acc, apt) => {
    const month = new Date(apt.date).toLocaleDateString('pt-BR', { month: 'short' });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.total += 1;
      if (apt.status === 'completed') existing.completed += 1;
    } else {
      acc.push({
        month,
        total: 1,
        completed: apt.status === 'completed' ? 1 : 0
      });
    }
    return acc;
  }, [] as any[]);

  const handleExportReport = () => {
    const data = reportType === 'doctor' ? doctorReports : specialtyReports;
    const csvContent = [
      reportType === 'doctor' 
        ? ['Médico', 'Especialidade', 'Total', 'Concluídas', 'Agendadas', 'Canceladas']
        : ['Especialidade', 'Total', 'Concluídas', 'Agendadas', 'Canceladas'],
      ...data.map(item => 
        reportType === 'doctor' 
          ? [item.doctorName, item.specialty, item.total, item.completed, item.scheduled, item.cancelled]
          : [item.specialty, item.total, item.completed, item.scheduled, item.cancelled]
      )
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const currentData = reportType === 'doctor' ? doctorReports : specialtyReports;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600 mt-2">Análise detalhada da clínica por médico e especialidade</p>
        </div>
        <div className="flex space-x-3">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tipo de relatório" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="doctor">Por Médico</SelectItem>
              <SelectItem value="specialty">Por Especialidade</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportReport} className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Consultas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.length > 0 
                ? Math.round((appointments.filter(apt => apt.status === 'completed').length / appointments.length) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Taxa de consultas concluídas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Médicos Ativos</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doctors.length}</div>
            <p className="text-xs text-muted-foreground">
              {specialtyReports.length} especialidades
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Especialidade Top</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {specialtyReports.length > 0 
                ? specialtyReports.reduce((prev, current) => prev.total > current.total ? prev : current).specialty
                : 'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Mais consultas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#3B82F6" name="Total" />
                <Bar dataKey="completed" fill="#10B981" name="Concluídas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Report Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Relatório Detalhado {reportType === 'doctor' ? 'por Médico' : 'por Especialidade'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-medium text-gray-900">
                    {reportType === 'doctor' ? 'Médico' : 'Especialidade'}
                  </th>
                  {reportType === 'doctor' && (
                    <th className="text-left p-4 font-medium text-gray-900">Especialidade</th>
                  )}
                  <th className="text-center p-4 font-medium text-gray-900">Total</th>
                  <th className="text-center p-4 font-medium text-gray-900">Concluídas</th>
                  <th className="text-center p-4 font-medium text-gray-900">Agendadas</th>
                  <th className="text-center p-4 font-medium text-gray-900">Canceladas</th>
                  <th className="text-center p-4 font-medium text-gray-900">Taxa Sucesso</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">
                      {reportType === 'doctor' ? item.doctorName : item.specialty}
                    </td>
                    {reportType === 'doctor' && (
                      <td className="p-4 text-blue-600">{item.specialty}</td>
                    )}
                    <td className="p-4 text-center font-semibold">{item.total}</td>
                    <td className="p-4 text-center text-green-600 font-medium">{item.completed}</td>
                    <td className="p-4 text-center text-blue-600 font-medium">{item.scheduled}</td>
                    <td className="p-4 text-center text-red-600 font-medium">{item.cancelled}</td>
                    <td className="p-4 text-center font-medium">
                      {item.total > 0 ? Math.round((item.completed / item.total) * 100) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
