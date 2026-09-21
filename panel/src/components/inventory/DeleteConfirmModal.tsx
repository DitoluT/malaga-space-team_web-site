/**
 * ====================================
 * ⚠️ MODAL DE CONFIRMACIÓN DE ELIMINACIÓN
 * ====================================
 */

import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { GlassContainer } from '../GlassContainer';
import { GlassButton } from '../GlassButton';

interface DeleteConfirmModalProps {
  itemName: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  itemName,
  onConfirm,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <GlassContainer className="w-full max-w-md">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">
                  Confirmar Eliminación
                </h2>
                <p className="text-white/60 text-sm">
                  Esta acción no se puede deshacer
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

          {/* Content */}
          <div className="mb-6">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-white/90 mb-2">
                ¿Estás seguro de que deseas eliminar el siguiente item?
              </p>
              <p className="text-white font-semibold text-lg">
                "{itemName}"
              </p>
            </div>
            <p className="text-white/70 text-sm mt-4">
              El item será eliminado permanentemente del inventario. Esta acción solo está disponible para administradores.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <GlassButton variant="secondary" size="md" onClick={onClose}>
              Cancelar
            </GlassButton>
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-red-500/80 hover:bg-red-500 text-white font-semibold rounded-lg transition-all flex items-center space-x-2 border border-red-400/30"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar</span>
            </button>
          </div>
        </div>
      </GlassContainer>
    </div>
  );
};
