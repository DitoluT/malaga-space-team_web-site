/**
 * ====================================
 * 📦 APLICACIÓN PRINCIPAL DE INVENTARIO
 * ====================================
 */

import React, { useState, useEffect } from 'react';
import { InventoryLogin } from './InventoryLogin';
import { InventoryDashboard } from './InventoryDashboard';
import { ChangePasswordModal } from './ChangePasswordModal';
import { API_ENDPOINTS } from '../../config/api';
import { Loader2 } from 'lucide-react';

interface User {
  id: number;
  username: string;
  nombre_completo: string;
  rol: 'viewer' | 'manager' | 'admin';
  requiere_cambio_password?: boolean;
}

export const InventoryApp: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Verificar sesión al cargar
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
          setUser(data.user);
          // Si requiere cambio de contraseña, mostrar modal
          if (data.user.requiere_cambio_password) {
            setShowChangePassword(true);
          }
        }
      }
    } catch (error) {
      console.error('Error al verificar sesión:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData: User, requiresPasswordChange: boolean) => {
    setUser(userData);
    if (requiresPasswordChange) {
      setShowChangePassword(true);
    }
  };

  const handlePasswordChangeSuccess = () => {
    setShowChangePassword(false);
    // Actualizar estado del usuario
    if (user) {
      setUser({ ...user, requiere_cambio_password: false });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setShowChangePassword(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white/40 animate-spin mx-auto mb-4" />
          <p className="text-white/60">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!user ? (
        <InventoryLogin onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          <InventoryDashboard user={user} onLogout={handleLogout} />
          {showChangePassword && (
            <ChangePasswordModal
              isFirstTime={true}
              onSuccess={handlePasswordChangeSuccess}
            />
          )}
        </>
      )}
    </>
  );
};
