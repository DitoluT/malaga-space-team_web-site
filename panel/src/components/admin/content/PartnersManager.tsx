import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, ExternalLink } from 'lucide-react';
import { GlassButton } from '../../GlassButton';
import { API_ENDPOINTS } from '../../../config/api';

interface Partner {
  id: number;
  name: string;
  logo_url: string;
  url: string;
  active: number;
  display_order: number;
}

export const PartnersManager: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  const [formData, setFormData] = useState({ name: '', logo_url: '', url: '' });

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_ENDPOINTS.webPartners}/all`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) setPartners(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPartners(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingPartner ? `${API_ENDPOINTS.webPartners}/${editingPartner.id}` : API_ENDPOINTS.webPartners;
    const method = editingPartner ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      setShowModal(false);
      setEditingPartner(null);
      setFormData({ name: '', logo_url: '', url: '' });
      fetchPartners();
    } catch (e) {
      console.error(e);
      alert('Error al guardar');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar colaborador?')) return;
    try {
      await fetch(`${API_ENDPOINTS.webPartners}/${id}`, { method: 'DELETE', credentials: 'include' });
      fetchPartners();
    } catch (e) {
      console.error(e);
    }
  };

  const openEdit = (p: Partner) => {
    setEditingPartner(p);
    setFormData({ name: p.name, logo_url: p.logo_url || '', url: p.url || '' });
    setShowModal(true);
  };

  const openAdd = () => {
    setEditingPartner(null);
    setFormData({ name: '', logo_url: '', url: '' });
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h3 className="text-xl text-white font-semibold">Colaboradores</h3>
        <GlassButton variant="primary" icon={Plus} onClick={openAdd}>Añadir Colaborador</GlassButton>
      </div>

      {loading ? (
         <div className="text-center text-white/60">Cargando...</div>
      ) : partners.length === 0 ? (
         <div className="text-center text-white/40 p-8 border border-white/10 rounded-lg">No hay colaboradores registrados.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.map(p => (
            <div key={p.id} className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col hover:bg-white/10 transition-colors">
                <div className="aspect-video bg-black/20 rounded-md mb-3 flex items-center justify-center overflow-hidden p-2">
                  {p.logo_url ? <img src={p.logo_url} alt={p.name} className="max-h-full max-w-full object-contain" /> : <span className="text-white/20">No Logo</span>}
                </div>
                <h4 className="text-white font-bold mb-1">{p.name}</h4>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs flex items-center mb-4 hover:underline truncate">
                  {p.url} <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                </a>
                <div className="mt-auto flex justify-end space-x-2">
                  <button onClick={() => openEdit(p)} className="p-2 bg-white/10 rounded hover:bg-white/20 text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-500/10 rounded hover:bg-red-500/20 text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-white/20 p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h3 className="text-xl text-white font-bold mb-6">{editingPartner ? 'Editar' : 'Añadir'} Colaborador</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-1">Nombre *</label>
                <input className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="Nombre de la organización" />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-1">Logo URL</label>
                <input className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                      value={formData.logo_url} onChange={e => setFormData({...formData, logo_url: e.target.value})} placeholder="https://..." />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-1">Website URL</label>
                <input className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                      value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} placeholder="https://..." />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
               <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-white/60 hover:text-white transition-colors">Cancelar</button>
               <GlassButton type="submit" variant="primary">Guardar</GlassButton>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
