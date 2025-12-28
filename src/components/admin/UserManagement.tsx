import React, { useState, useEffect } from 'react';
import { Plus, Users, RefreshCw } from 'lucide-react';
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
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Users className="w-8 h-8 mr-3 text-blue-400" />
              Panel de Administración
            </h1>
            <p className="text-white/60 mt-1">
              Gestión de usuarios y permisos del sistema
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

        {/* Content */}
        <GlassContainer className="p-0 overflow-hidden">
          <UserList
            users={users}
            loading={loading}
            onDelete={handleDeleteUser}
            currentUserId={currentUser.id}
          />
        </GlassContainer>
      </div>

      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddUser}
        />
      )}
    </div>
  );
};
