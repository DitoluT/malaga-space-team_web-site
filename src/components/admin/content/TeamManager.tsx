import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Linkedin } from 'lucide-react';
import { GlassButton } from '../../GlassButton';
import { API_ENDPOINTS } from '../../../config/api';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image_url: string;
  linkedin_url: string;
  category: string;
  display_order: number;
}

const CATEGORIES = [
  { value: 'academicSupervisors', label: 'Supervisión Académica (Academic Supervisors)' },
  { value: 'studentLeaders', label: 'Líderes Estudiantes (Team Leaders)' },
  { value: 'groundStation', label: 'Estación Terrena (Ground Station)' },
  { value: 'communications', label: 'Comunicaciones (Communications)' },
  { value: 'adcs', label: 'ADCS' },
  { value: 'eps', label: 'Sistemas de Potencia (EPS)' },
  { value: 'software', label: 'Software de Vuelo (On-Board Software)' },
  { value: 'structure', label: 'Estructura (Structure)' },
];

export const TeamManager: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    image_url: '',
    linkedin_url: '',
    category: 'studentLeaders'
  });

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_ENDPOINTS.webTeam}/all`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) setMembers(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingMember ? `${API_ENDPOINTS.webTeam}/${editingMember.id}` : API_ENDPOINTS.webTeam;
    const method = editingMember ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      setShowModal(false);
      setEditingMember(null);
      setFormData({ name: '', role: '', image_url: '', linkedin_url: '', category: 'generalCoordination' });
      fetchMembers();
    } catch (e) {
      console.error(e);
      alert('Error al guardar');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar miembro del equipo?')) return;
    try {
      await fetch(`${API_ENDPOINTS.webTeam}/${id}`, { method: 'DELETE', credentials: 'include' });
      fetchMembers();
    } catch (e) {
      console.error(e);
    }
  };

  const openEdit = (m: TeamMember) => {
    setEditingMember(m);
    setFormData({
        name: m.name,
        role: m.role,
        image_url: m.image_url || '',
        linkedin_url: m.linkedin_url || '',
        category: m.category
    });
    setShowModal(true);
  };

  const openAdd = () => {
    setEditingMember(null);
    setFormData({ name: '', role: '', image_url: '', linkedin_url: '', category: 'studentLeaders' });
    setShowModal(true);
  };

  const getCategoryLabel = (cat: string) => CATEGORIES.find(c => c.value === cat)?.label || cat;

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h3 className="text-xl text-white font-semibold">Equipo</h3>
        <GlassButton variant="primary" icon={Plus} onClick={openAdd}>Añadir Miembro</GlassButton>
      </div>

      {loading ? (
         <div className="text-center text-white/60">Cargando...</div>
      ) : members.length === 0 ? (
         <div className="text-center text-white/40 p-8 border border-white/10 rounded-lg">No hay miembros en el equipo.</div>
      ) : (
        <div className="space-y-6">
            {CATEGORIES.map(cat => {
                const catMembers = members.filter(m => m.category === cat.value);
                if (catMembers.length === 0) return null;
                return (
                    <div key={cat.value}>
                        <h4 className="text-white/80 font-bold mb-3 border-b border-white/10 pb-1">{cat.label}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {catMembers.map(m => (
                                <div key={m.id} className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-start space-x-4 hover:bg-white/10 transition-colors">
                                    <div className="w-12 h-12 rounded-full bg-white/10 overflow-hidden flex-shrink-0">
                                        {m.image_url ? <img src={m.image_url} alt={m.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-white/40">Img</div>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h5 className="text-white font-bold truncate">{m.name}</h5>
                                        <p className="text-blue-400 text-xs mb-1 truncate">{m.role}</p>
                                        {m.linkedin_url && <a href={m.linkedin_url} target="_blank" className="text-white/40 hover:text-white"><Linkedin className="w-4 h-4" /></a>}
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <button onClick={() => openEdit(m)} className="p-1.5 bg-white/10 rounded hover:bg-white/20 text-white transition-colors"><Edit2 className="w-3 h-3" /></button>
                                        <button onClick={() => handleDelete(m.id)} className="p-1.5 bg-red-500/10 rounded hover:bg-red-500/20 text-red-400 transition-colors"><Trash2 className="w-3 h-3" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-white/20 p-6 rounded-xl w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl text-white font-bold mb-6">{editingMember ? 'Editar' : 'Añadir'} Miembro</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-1">Nombre *</label>
                <input className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-1">Rol / Cargo *</label>
                <input className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                      value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-1">Categoría</label>
                <select className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value} className="bg-slate-800">{c.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-1">Imagen URL</label>
                <input className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                      value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="https://..." />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-1">LinkedIn URL</label>
                <input className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                      value={formData.linkedin_url} onChange={e => setFormData({...formData, linkedin_url: e.target.value})} placeholder="https://linkedin.com/in/..." />
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
