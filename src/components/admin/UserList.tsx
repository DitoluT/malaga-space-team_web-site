import React from 'react';
import { Trash2, User, Shield, CheckCircle, XCircle } from 'lucide-react';
import { GlassButton } from '../GlassButton';

interface User {
  id: number;
  username: string;
  nombre_completo: string;
  rol: 'viewer' | 'manager' | 'admin';
  email?: string;
  activo: number;
  fecha_creacion: string;
  ultimo_acceso?: string;
}

interface UserListProps {
  users: User[];
  loading: boolean;
  onDelete: (id: number) => void;
  currentUserId: number;
}

export const UserList: React.FC<UserListProps> = ({ users, loading, onDelete, currentUserId }) => {
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full mx-auto mb-4"></div>
        <p className="text-white/60">Cargando usuarios...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-10 bg-white/5 rounded-lg border border-white/10">
        <User className="w-12 h-12 text-white/20 mx-auto mb-4" />
        <p className="text-white/60">No hay usuarios registrados.</p>
      </div>
    );
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="px-2 py-1 bg-purple-500/20 text-purple-200 rounded-full text-xs font-medium border border-purple-500/30 flex items-center w-fit">
            <Shield className="w-3 h-3 mr-1" />
            Admin
          </span>
        );
      case 'manager':
        return (
          <span className="px-2 py-1 bg-blue-500/20 text-blue-200 rounded-full text-xs font-medium border border-blue-500/30 flex items-center w-fit">
            <User className="w-3 h-3 mr-1" />
            Manager
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-slate-500/20 text-slate-200 rounded-full text-xs font-medium border border-slate-500/30 flex items-center w-fit">
            <User className="w-3 h-3 mr-1" />
            Viewer
          </span>
        );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-4 px-4 text-white/60 font-medium text-sm">Usuario</th>
            <th className="text-left py-4 px-4 text-white/60 font-medium text-sm">Rol</th>
            <th className="text-left py-4 px-4 text-white/60 font-medium text-sm">Email</th>
            <th className="text-left py-4 px-4 text-white/60 font-medium text-sm">Estado</th>
            <th className="text-left py-4 px-4 text-white/60 font-medium text-sm">Último Acceso</th>
            <th className="text-right py-4 px-4 text-white/60 font-medium text-sm">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-white/5 transition-colors">
              <td className="py-4 px-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs mr-3">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-white font-medium">{user.nombre_completo}</div>
                    <div className="text-white/40 text-xs">@{user.username}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                {getRoleBadge(user.rol)}
              </td>
              <td className="py-4 px-4">
                <div className="text-white/70 text-sm">{user.email || '-'}</div>
              </td>
              <td className="py-4 px-4">
                {user.activo ? (
                  <div className="flex items-center text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4 mr-1.5" />
                    Activo
                  </div>
                ) : (
                  <div className="flex items-center text-red-400 text-sm">
                    <XCircle className="w-4 h-4 mr-1.5" />
                    Inactivo
                  </div>
                )}
              </td>
              <td className="py-4 px-4">
                <div className="text-white/70 text-sm">
                  {user.ultimo_acceso ? new Date(user.ultimo_acceso).toLocaleDateString() : 'Nunca'}
                </div>
              </td>
              <td className="py-4 px-4 text-right">
                {user.id !== currentUserId && (
                  <GlassButton
                    variant="danger"
                    size="sm"
                    icon={Trash2}
                    onClick={() => onDelete(user.id)}
                    title="Eliminar usuario"
                  >
                    Eliminar
                  </GlassButton>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
