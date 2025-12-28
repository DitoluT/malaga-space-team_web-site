import React, { useState, useEffect } from 'react';
import { InventoryLogin } from '../inventory/InventoryLogin';
import { UserManagement } from './UserManagement';
import { API_ENDPOINTS } from '../../config/api';
import { Loader2, ShieldAlert } from 'lucide-react';

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

  return <UserManagement currentUser={user} />;
};
