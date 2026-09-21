/**
 * ====================================
 * ➕ MODAL PARA AÑADIR/EDITAR ITEMS
 * ====================================
 */

import React, { useState, useEffect } from 'react';
import { X, Save, Package } from 'lucide-react';
import { GlassContainer } from '../GlassContainer';
import { GlassButton } from '../GlassButton';

interface ItemModalProps {
  item: any | null;
  onSave: (itemData: any) => void;
  onClose: () => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    numero_serie: '',
    descripcion: '',
    categoria: '',
    ubicacion: '',
    responsable: '',
    cantidad: 1,
    estado: 'Disponible',
    notas: ''
  });

  useEffect(() => {
    if (item) {
      setFormData({
        nombre: item.nombre || '',
        numero_serie: item.numero_serie || '',
        descripcion: item.descripcion || '',
        categoria: item.categoria || '',
        ubicacion: item.ubicacion || '',
        responsable: item.responsable || '',
        cantidad: item.cantidad || 1,
        estado: item.estado || 'Disponible',
        notas: item.notas || ''
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <GlassContainer className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {item ? 'Editar Item' : 'Nuevo Item'}
                </h2>
                <p className="text-white/60 text-sm">
                  {item ? 'Modifica la información del item' : 'Añade un nuevo item al inventario'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white/90" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[calc(90vh-200px)] overflow-y-auto pr-2">
            {/* Nombre */}
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Nombre <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                placeholder="Ej: Arduino Uno"
              />
            </div>

            {/* Número de Serie */}
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Número de Serie
              </label>
              <input
                type="text"
                name="numero_serie"
                value={formData.numero_serie}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                placeholder="Ej: SN12345678"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 resize-none"
                placeholder="Breve descripción del item..."
              />
            </div>

            {/* Grid de 2 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Categoría */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Categoría
                </label>
                <input
                  type="text"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="Ej: Electrónica"
                  list="categorias"
                />
                <datalist id="categorias">
                  <option value="Electrónica" />
                  <option value="Mecánica" />
                  <option value="Software" />
                  <option value="Herramientas" />
                  <option value="Materiales" />
                </datalist>
              </div>

              {/* Estado */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Estado
                </label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                >
                  <option value="Disponible">Disponible</option>
                  <option value="En uso">En uso</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Dañado">Dañado</option>
                  <option value="Prestado">Prestado</option>
                </select>
              </div>
            </div>

            {/* Grid de 2 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Ubicación */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Ubicación
                </label>
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="Ej: Lab A, Estante 3"
                />
              </div>

              {/* Responsable */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Responsable
                </label>
                <input
                  type="text"
                  name="responsable"
                  value={formData.responsable}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  placeholder="Nombre de la persona"
                />
              </div>
            </div>

            {/* Grid de 2 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cantidad */}
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Cantidad
                </label>
                <input
                  type="number"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                />
              </div>
            </div>

            {/* Notas */}
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Notas
              </label>
              <textarea
                name="notas"
                value={formData.notas}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400/50 resize-none"
                placeholder="Información adicional..."
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
              <GlassButton type="button" variant="secondary" size="md" onClick={onClose}>
                Cancelar
              </GlassButton>
              <GlassButton type="submit" variant="primary" size="md">
                <Save className="w-4 h-4 mr-2" />
                {item ? 'Guardar Cambios' : 'Crear Item'}
              </GlassButton>
            </div>
          </form>
        </div>
      </GlassContainer>
    </div>
  );
};
