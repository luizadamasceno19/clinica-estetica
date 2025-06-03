
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  User, 
  Search, 
  FileText, 
  Home,
  Stethoscope
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/doctors', icon: Stethoscope, label: 'Médicos' },
    { path: '/patients', icon: Users, label: 'Pacientes' },
    { path: '/appointments', icon: Calendar, label: 'Consultas' },
    { path: '/search', icon: Search, label: 'Pesquisar' },
    { path: '/reports', icon: FileText, label: 'Relatórios' },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-900 to-blue-800 text-white w-64 min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center">
          <span className="text-green-300">Estética</span>
          <span className="text-white">Clinic</span>
        </h1>
        <p className="text-blue-200 text-center text-sm mt-2">Sistema de Gestão</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-blue-700 ${
                isActive ? 'bg-blue-700 border-r-4 border-green-300' : ''
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-green-300' : 'text-blue-200'}`} />
              <span className={`font-medium ${isActive ? 'text-white' : 'text-blue-100'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-8">
        <div className="bg-blue-800 p-4 rounded-lg">
          <p className="text-sm text-blue-200">
            Clínica de Estética Premium
          </p>
          <p className="text-xs text-blue-300 mt-1">
            Versão 1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
