import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Link } from 'lucide-react';
import { GlassButton } from '../../GlassButton';
import { API_ENDPOINTS } from '../../../config/api';

interface Sponsor {
  id: number;
  name: string;
  short_name: string;
  description: string;
  role: string;
  icon: string;
  color: string;
  website: string;
  contribution: string;
  active: number;
  display_order: number;
}

const ICONS = [
  { value: 'Users', label: 'Usuarios (Users)' },
  { value: 'Lightbulb', label: 'Bombilla (Idea)' },
  { value: 'Link', label: 'Enlace (Link)' },
  { value: 'Rocket', label: 'Cohete (Rocket)' },
  { value: 'Star', label: 'Estrella (Star)' },
];

const COLORS = [
  { value: 'from-blue-400 to-blue-600', label: 'Azul' },
  { value: 'from-green-400 to-green-600', label: 'Verde' },
  { value: 'from-purple-400 to-purple-600', label: 'Morado' },
  { value: 'from-orange-400 to-orange-600', label: 'Naranja' },
  { value: 'from-red-400 to-red-600', label: 'Rojo' },
];

export const SponsorsManager: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    short_name: '',
    description: '',
    role: '',
    icon: 'Users',
    color: 'from-blue-400 to-blue-600',
    website: '',
    contribution: ''
  });

  const fetchSponsors = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_ENDPOINTS.webSponsors}/all`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) setSponsors(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSponsors(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingSponsor ? `${API_ENDPOINTS.webSponsors}/${editingSponsor.id}` : API_ENDPOINTS.webSponsors;
    const method = editingSponsor ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      setShowModal(false);
      setEditingSponsor(null);
      setFormData({ name: '', short_name: '', description: '', role: '', icon: 'Users', color: 'from-blue-400 to-blue-600', website: '', contribution: '' });
      fetchSponsors();
    } catch (e) {
      console.error(e);
      alert('Error al guardar');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar patrocinador?')) return;
    try {
      await fetch(`${API_ENDPOINTS.webSponsors}/${id}`, { method: 'DELETE', credentials: 'include' });
      fetchSponsors();
    } catch (e) {
      console.error(e);
    }
  };

  const openEdit = (s: Sponsor) => {
    setEditingSponsor(s);
    setFormData({
        name: s.name,
        short_name: s.short_name || '',
        description: s.description || '',
        role: s.role || '',
        icon: s.icon || 'Users',
        color: s.color || 'from-blue-400 to-blue-600',
        website: s.website || '',
        contribution: s.contribution || ''
    });
    setShowModal(true);
  };

  const openAdd = () => {
    setEditingSponsor(null);
    setFormData({ name: '', short_name: '', description: '', role: '', icon: 'Users', color: 'from-blue-400 to-blue-600', website: '', contribution: '' });
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h3 className="text-xl text-white font-semibold">Patrocinadores / Colaboradores</h3>
        <GlassButton variant="primary" icon={Plus} onClick={openAdd}>Añadir Patrocinador</GlassButton>
      </div>

      {loading ? (
         <div className="text-center text-white/60">Cargando...</div>
      ) : sponsors.length === 0 ? (
         <div className="text-center text-white/40 p-8 border border-white/10 rounded-lg">No hay patrocinadores.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sponsors.map(s => (
                <div key={s.id} className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <h5 className="text-white font-bold">{s.name}</h5>
                        <div className="flex space-x-2">
                            <button onClick={() => openEdit(s)} className="p-1.5 bg-white/10 rounded hover:bg-white/20 text-white transition-colors"><Edit2 className="w-3 h-3" /></button>
                            <button onClick={() => handleDelete(s.id)} className="p-1.5 bg-red-500/10 rounded hover:bg-red-500/20 text-red-400 transition-colors"><Trash2 className="w-3 h-3" /></button>
                        </div>
                    </div>
                    <p className="text-blue-400 text-sm mb-2 font-medium">{s.role}</p>
                    <p className="text-white/70 text-sm mb-2 line-clamp-2">{s.description}</p>
                    <div className="mt-auto flex items-center justify-between text-xs text-white/50 border-t border-white/10 pt-2">
                        <span>{s.contribution ? 'Con contribución' : 'Sin contribución'}</span>
                        {s.website && <a href={s.website} target="_blank" className="hover:text-white"><Link className="w-3 h-3" /></a>}
                    </div>
                </div>
            ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-white/20 p-6 rounded-xl w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl text-white font-bold mb-6">{editingSponsor ? 'Editar' : 'Añadir'} Patrocinador</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-1">Nombre Completo *</label>
                <input className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="Nombre del Patrocinador" />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-1">Nombre Corto (Opcional)</label>
                <input className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                      value={formData.short_name} onChange={e => setFormData({...formData, short_name: e.target.value})} placeholder="Ej: ESA" />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-1">Rol / Tipo</label>
                <input className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                      value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="Ej: Colaborador Principal" />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-1">Descripción</label>
                <textarea className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none h-24 resize-none"
                      value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Descripción del patrocinador..." />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-1">Contribución (Texto)</label>
                <input className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                      value={formData.contribution} onChange={e => setFormData({...formData, contribution: e.target.value})} placeholder="Ej: Aportación económica" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-white/70 text-sm mb-1">Icono</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                        value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})}>
                        {ICONS.map(i => <option key={i.value} value={i.value} className="bg-slate-800">{i.label}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-white/70 text-sm mb-1">Color</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                        value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})}>
                        {COLORS.map(c => <option key={c.value} value={c.value} className="bg-slate-800">{c.label}</option>)}
                    </select>
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-1">Sitio Web URL</label>
                <input className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                      value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} placeholder="https://..." />
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
