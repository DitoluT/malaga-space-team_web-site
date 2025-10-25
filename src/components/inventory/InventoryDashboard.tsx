/**
 * ====================================
 * 📊 DASHBOARD PRINCIPAL - INVENTARIO
 * ====================================
 */

import React, { useState, useEffect } from 'react';
import {
  Search, Plus, Edit2, Trash2, Eye, LogOut, Users,
  Package, MapPin, Calendar, Filter,
  RefreshCw, Download, AlertCircle, CheckCircle,
  XCircle, Clock, BarChart3
} from 'lucide-react';
import { GlassContainer } from '../GlassContainer';
import { GlassButton } from '../GlassButton';
import { ItemModal } from './ItemModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface User {
  id: number;
  username: string;
  nombre_completo: string;
  rol: 'viewer' | 'manager' | 'admin';
}

interface InventoryItem {
  id: number;
  nombre: string;
  numero_serie?: string;
  descripcion?: string;
  categoria?: string;
  ubicacion?: string;
  responsable?: string;
  cantidad: number;
  estado: string;
  fecha_agregado: string;
  fecha_ultima_modificacion: string;
  notas?: string;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export const InventoryDashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Cargar items
  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/inventory/items', {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setItems(data.items);
        setFilteredItems(data.items);
      }
    } catch (error) {
      console.error('Error al cargar items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar estadísticas
  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/inventory/stats', {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchStats();
  }, []);

  // Filtrar items
  useEffect(() => {
    let filtered = items;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.nombre.toLowerCase().includes(search) ||
        item.numero_serie?.toLowerCase().includes(search) ||
        item.descripcion?.toLowerCase().includes(search) ||
        item.ubicacion?.toLowerCase().includes(search) ||
        item.responsable?.toLowerCase().includes(search)
      );
    }

    if (filterCategory) {
      filtered = filtered.filter(item => item.categoria === filterCategory);
    }

    if (filterStatus) {
      filtered = filtered.filter(item => item.estado === filterStatus);
    }

    setFilteredItems(filtered);
  }, [searchTerm, items, filterCategory, filterStatus]);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3001/api/inventory/logout', {
        method: 'POST',
        credentials: 'include',
      });
      onLogout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleCreateItem = () => {
    setSelectedItem(null);
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsItemModalOpen(true);
  };

  const handleDeleteItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleSaveItem = async (itemData: any) => {
    try {
      const url = selectedItem
        ? `http://localhost:3001/api/inventory/items/${selectedItem.id}`
        : 'http://localhost:3001/api/inventory/items';
      
      const method = selectedItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(itemData),
      });

      const data = await response.json();
      if (data.success) {
        setIsItemModalOpen(false);
        fetchItems();
        fetchStats();
      }
    } catch (error) {
      console.error('Error al guardar item:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/inventory/items/${selectedItem.id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      const data = await response.json();
      if (data.success) {
        setIsDeleteModalOpen(false);
        fetchItems();
        fetchStats();
      }
    } catch (error) {
      console.error('Error al eliminar item:', error);
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'Disponible':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'En uso':
        return <Clock className="w-4 h-4 text-blue-400" />;
      case 'Mantenimiento':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'Dañado':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Package className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleBadgeColor = (rol: string) => {
    switch (rol) {
      case 'admin':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'manager':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'viewer':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const canEdit = user.rol === 'manager' || user.rol === 'admin';
  const canDelete = user.rol === 'admin';

  const categories = [...new Set(items.map(item => item.categoria).filter(Boolean))];
  const statuses = [...new Set(items.map(item => item.estado))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-8">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <GlassContainer className="mb-6">
          <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Sistema de Inventario
              </h1>
              <div className="flex items-center space-x-3">
                <span className="text-white/70">
                  Bienvenido, <span className="font-semibold text-white">{user.nombre_completo}</span>
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(user.rol)}`}>
                  {user.rol.toUpperCase()}
                </span>
              </div>
            </div>
            <GlassButton variant="secondary" size="md" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </GlassButton>
          </div>
        </GlassContainer>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <GlassContainer>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Package className="w-8 h-8 text-blue-400" />
                  <BarChart3 className="w-5 h-5 text-white/40" />
                </div>
                <div className="text-2xl font-bold text-white">{stats.totalItems}</div>
                <div className="text-white/60 text-sm">Total Items</div>
              </div>
            </GlassContainer>

            <GlassContainer>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <MapPin className="w-8 h-8 text-purple-400" />
                  <BarChart3 className="w-5 h-5 text-white/40" />
                </div>
                <div className="text-2xl font-bold text-white">{stats.byLocation.length}</div>
                <div className="text-white/60 text-sm">Ubicaciones</div>
              </div>
            </GlassContainer>

            <GlassContainer>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-orange-400" />
                  <BarChart3 className="w-5 h-5 text-white/40" />
                </div>
                <div className="text-2xl font-bold text-white">{stats.byCategory.length}</div>
                <div className="text-white/60 text-sm">Categorías</div>
              </div>
            </GlassContainer>
          </div>
        )}

        {/* Search and Filters */}
        <GlassContainer className="mb-6">
          <div className="p-6 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, número de serie, ubicación, responsable..."
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                {canEdit && (
                  <GlassButton variant="primary" size="md" onClick={handleCreateItem}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Item
                  </GlassButton>
                )}
                <GlassButton variant="secondary" size="md" onClick={fetchItems}>
                  <RefreshCw className="w-4 h-4" />
                </GlassButton>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              >
                <option value="">Todas las categorías</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              >
                <option value="">Todos los estados</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              {(filterCategory || filterStatus) && (
                <button
                  onClick={() => {
                    setFilterCategory('');
                    setFilterStatus('');
                  }}
                  className="px-4 py-2 text-white/70 hover:text-white text-sm transition-colors"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        </GlassContainer>

        {/* Items Table */}
        <GlassContainer>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center">
                <RefreshCw className="w-8 h-8 text-white/40 animate-spin mx-auto mb-4" />
                <p className="text-white/60">Cargando inventario...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/60 mb-2">
                  {searchTerm || filterCategory || filterStatus
                    ? 'No se encontraron items con los filtros aplicados'
                    : 'No hay items en el inventario'}
                </p>
                {canEdit && !searchTerm && !filterCategory && !filterStatus && (
                  <GlassButton variant="primary" size="sm" onClick={handleCreateItem} className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Añadir Primer Item
                  </GlassButton>
                )}
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-white/80 font-semibold text-sm">Nombre</th>
                    <th className="text-left p-4 text-white/80 font-semibold text-sm">Nº Serie</th>
                    <th className="text-left p-4 text-white/80 font-semibold text-sm">Categoría</th>
                    <th className="text-left p-4 text-white/80 font-semibold text-sm">Ubicación</th>
                    <th className="text-left p-4 text-white/80 font-semibold text-sm">Responsable</th>
                    <th className="text-left p-4 text-white/80 font-semibold text-sm">Cantidad</th>
                    <th className="text-left p-4 text-white/80 font-semibold text-sm">Estado</th>
                    <th className="text-right p-4 text-white/80 font-semibold text-sm">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-medium text-white">{item.nombre}</div>
                        {item.descripcion && (
                          <div className="text-xs text-white/60 mt-1">{item.descripcion}</div>
                        )}
                      </td>
                      <td className="p-4 text-white/70 text-sm">
                        {item.numero_serie || '-'}
                      </td>
                      <td className="p-4">
                        {item.categoria && (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                            {item.categoria}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-white/70 text-sm">
                        {item.ubicacion || '-'}
                      </td>
                      <td className="p-4 text-white/70 text-sm">
                        {item.responsable || '-'}
                      </td>
                      <td className="p-4 text-white/70 text-sm text-center">
                        {item.cantidad}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(item.estado)}
                          <span className="text-white/70 text-sm">{item.estado}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end space-x-2">
                          {canEdit && (
                            <button
                              onClick={() => handleEditItem(item)}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4 text-blue-400" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteItem(item)}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </GlassContainer>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-white/40 text-sm">
            Mostrando {filteredItems.length} de {items.length} items
          </p>
        </div>
      </div>

      {/* Modals */}
      {isItemModalOpen && (
        <ItemModal
          item={selectedItem}
          onSave={handleSaveItem}
          onClose={() => setIsItemModalOpen(false)}
        />
      )}

      {isDeleteModalOpen && selectedItem && (
        <DeleteConfirmModal
          itemName={selectedItem.nombre}
          onConfirm={handleConfirmDelete}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};
