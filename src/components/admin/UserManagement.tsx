import React, { useState, useEffect } from 'react';
import { Plus, Users, RefreshCw, Zap } from 'lucide-react';
import { GlassContainer } from '../GlassContainer';
import { GlassButton } from '../GlassButton';
import { UserList } from './UserList';
import { AddUserModal } from './AddUserModal';
import { API_ENDPOINTS } from '../../config/api';

interface UserManagementProps {
  currentUser: any;
}

export const UserManagement: React.FC<UserManagementProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState('');
  const [quickEmail, setQuickEmail] = useState('');
  const [quickLoading, setQuickLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.users, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        setError('Error al cargar usuarios');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (userData: any) => {
    const response = await fetch(API_ENDPOINTS.users, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Error al crear usuario');
    }

    await fetchUsers();
  };

  const handleQuickAdd = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!quickEmail.endsWith('@uma.es')) {
          alert('El correo debe ser del dominio @uma.es');
          return;
      }

      setQuickLoading(true);
      try {
          const response = await fetch(API_ENDPOINTS.users, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ quick_email: quickEmail })
          });
          const data = await response.json();
          if (data.success) {
              alert(`Usuario creado: ${data.message}`);
              setQuickEmail('');
              await fetchUsers();
          } else {
              alert(data.error || 'Error al crear usuario');
          }
      } catch (err) {
          console.error(err);
          alert('Error de conexión');
      } finally {
          setQuickLoading(false);
      }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      const response = await fetch(`${API_ENDPOINTS.users}/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();
      if (data.success) {
        await fetchUsers();
      } else {
        alert(data.error || 'Error al eliminar usuario');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    }
  };

  return (
    <div className="p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center">
              <Users className="w-8 h-8 mr-3 text-blue-400" />
              Gestión de Usuarios
            </h2>
            <p className="text-white/60 mt-1">
              Administra los accesos y permisos del sistema.
            </p>
          </div>

          <div className="flex items-center gap-3">
             <GlassButton
              variant="secondary"
              icon={RefreshCw}
              onClick={fetchUsers}
              title="Recargar lista"
            >
              Actualizar
            </GlassButton>
            <GlassButton
              variant="primary"
              icon={Plus}
              onClick={() => setShowAddModal(true)}
            >
              Añadir Usuario
            </GlassButton>
          </div>
        </div>

        {/* Quick Add Section */}
        <div className="mb-8 p-6 bg-blue-900/20 border border-blue-500/20 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                Creación Rápida
            </h3>
            <form onSubmit={handleQuickAdd} className="flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-xs text-white/60 mb-1">Correo UMA (@uma.es)</label>
                    <input
                        type="email"
                        required
                        placeholder="usuario@uma.es"
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                        value={quickEmail}
                        onChange={e => setQuickEmail(e.target.value)}
                    />
                </div>
                <GlassButton type="submit" variant="primary" disabled={quickLoading}>
                    {quickLoading ? 'Creando...' : 'Crear Usuario'}
                </GlassButton>
            </form>
            <p className="text-xs text-white/40 mt-2">
                Se creará el usuario con el alias del correo y contraseña temporal 'spaceteam'.
            </p>
        </div>

        {/* Content */}
        <GlassContainer className="p-0 overflow-hidden">
          <UserList
            users={users}
            loading={loading}
            onDelete={handleDeleteUser}
            currentUserId={currentUser.id}
          />
        </GlassContainer>

      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddUser}
        />
      )}
    </div>
  );
};
