import React, { useState, useEffect } from 'react';
import { InventoryLogin } from '../inventory/InventoryLogin';
import { UserManagement } from './UserManagement';
import { ContentManagement } from './content/ContentManagement';
import { API_ENDPOINTS } from '../../config/api';
import { Loader2, ShieldAlert, Users, Layout, LogOut } from 'lucide-react';

interface User {
  id: number;
  username: string;
  nombre_completo: string;
  rol: 'viewer' | 'manager' | 'admin';
}

export const AdminApp: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [activeSection, setActiveSection] = useState<'users' | 'content'>('users');

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.verify, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          if (data.user.rol === 'admin') {
            setUser(data.user);
          } else {
            setAccessDenied(true);
          }
        }
      }
    } catch (error) {
      console.error('Error al verificar sesión:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData: User) => {
    if (userData.rol === 'admin') {
      setUser(userData);
      setAccessDenied(false);
    } else {
      setAccessDenied(true);
    }
  };

  const handleLogout = async () => {
       try {
        await fetch(API_ENDPOINTS.logout, { method: 'POST', credentials: 'include' });
        setUser(null);
        window.location.href = '/inventario';
       } catch (e) {
           console.error(e);
       }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white/40 animate-spin mx-auto mb-4" />
          <p className="text-white/60">Verificando permisos de administrador...</p>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Acceso Denegado</h1>
          <p className="text-white/70 mb-6">
            No tienes permisos de administrador para acceder a este panel.
          </p>
          <button
            onClick={() => window.location.href = '/inventario'}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Volver al Inventario
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return <InventoryLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex text-white font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-slate-950 border-r border-white/10 p-4 flex flex-col flex-shrink-0">
          <div className="mb-8 px-2 pt-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Panel Admin</h1>
            <p className="text-xs text-white/40">Gestión Integral</p>
          </div>

          <nav className="space-y-1 flex-1">
            <button
                onClick={() => setActiveSection('users')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeSection === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
            >
                <Users className="w-5 h-5" />
                <span>Usuarios</span>
            </button>
            <button
                onClick={() => setActiveSection('content')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeSection === 'content' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
            >
                <Layout className="w-5 h-5" />
                <span>Contenido Web</span>
            </button>
          </nav>

          <div className="border-t border-white/10 pt-4 mt-4">
              <div className="px-4 py-2 mb-2">
                  <p className="text-sm text-white font-medium truncate">{user.nombre_completo}</p>
                  <p className="text-xs text-white/40 capitalize">{user.rol}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
              >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
              </button>
          </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
          </div>

         <div className="relative z-10">
            {activeSection === 'users' ? (
                <UserManagement currentUser={user} />
            ) : (
                <div className="p-8">
                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
                        <Layout className="w-8 h-8 mr-3 text-blue-400" />
                        Gestión de Contenido
                    </h2>
                    <p className="text-white/60 mb-8 pl-11">Edita las secciones públicas de la web (Partners, Cronología, Equipo).</p>
                    <ContentManagement />
                </div>
            )}
         </div>
      </div>
    </div>
  );
};
