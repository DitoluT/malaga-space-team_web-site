import React, { useState, useEffect } from 'react';
import { X, User, Lock, Mail, Shield, Loader2 } from 'lucide-react';
import { GlassButton } from '../GlassButton';

interface AddUserModalProps {
  onClose: () => void;
  onSave: (userData: any, isUpdate?: boolean) => Promise<void>;
  initialData?: any;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nombre_completo: '',
    email: '',
    rol: 'viewer' as 'viewer' | 'manager' | 'admin',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
      if (initialData) {
          setFormData({
              username: initialData.username,
              password: '', // Don't fill password
              nombre_completo: initialData.nombre_completo,
              email: initialData.email || '',
              rol: initialData.rol
          });
      }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSave(formData, !!initialData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900/90 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <h2 className="text-xl font-bold text-white">{initialData ? 'Editar Usuario' : 'Añadir Nuevo Usuario'}</h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Username */}
          <div>
            <label className="block text-white/70 text-sm mb-1">Usuario *</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-5 h-5 text-white/30" />
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
                placeholder="jdoe"
                disabled={!!initialData} // Usually username is immutable or needs care
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-white/70 text-sm mb-1">
                {initialData ? 'Nueva Contraseña (Opcional)' : 'Contraseña *'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-5 h-5 text-white/30" />
              <input
                type="password"
                required={!initialData}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                placeholder={initialData ? "Dejar en blanco para no cambiar" : "••••••"}
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-white/70 text-sm mb-1">Nombre Completo *</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-5 h-5 text-white/30" />
              <input
                type="text"
                required
                value={formData.nombre_completo}
                onChange={(e) => setFormData({...formData, nombre_completo: e.target.value})}
                className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-white/70 text-sm mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-5 h-5 text-white/30" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-white/70 text-sm mb-1">Rol *</label>
            <div className="relative">
              <Shield className="absolute left-3 top-2.5 w-5 h-5 text-white/30" />
              <select
                value={formData.rol}
                onChange={(e) => setFormData({...formData, rol: e.target.value as any})}
                className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none appearance-none"
              >
                <option value="viewer">Viewer (Solo lectura)</option>
                <option value="manager">Manager (Editar inventario)</option>
                <option value="admin">Admin (Gestión total)</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white/60 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <GlassButton
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Usuario'
              )}
            </GlassButton>
          </div>
        </form>
      </div>
    </div>
  );
};
