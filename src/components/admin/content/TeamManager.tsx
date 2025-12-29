import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Linkedin, User, Upload } from 'lucide-react';
import { GlassButton } from '../../GlassButton';
import { API_ENDPOINTS } from '../../../config/api';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  title?: string;
  image_url: string;
  linkedin_url: string;
  category: string;
  department: string;
  display_order: number;
  user_id?: number;
}

interface User {
  id: number;
  username: string;
  nombre_completo: string;
}

const CATEGORIES = [
  { value: 'leader', label: 'Líder / Responsable' },
  { value: 'member', label: 'Miembro' },
  { value: 'director', label: 'Director / Profesor' }, // Keep for professors
];

const DEPARTMENTS = [
  { value: 'professors', label: 'Profesores' },
  { value: 'management', label: 'Management' },
  { value: 'structure_energy', label: 'Estructura y Energía' },
  { value: 'comms', label: 'Comunicaciones' },
  { value: 'ground_station', label: 'Estación Terrena' },
  { value: 'control_software', label: 'Sistemas de Control y Software' },
  { value: 'marketing', label: 'Marketing' },
];

export const TeamManager: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    title: '',
    image_url: '',
    linkedin_url: '',
    category: 'member',
    department: 'management',
    user_id: '' as string | number // allow empty
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resMembers, resUsers] = await Promise.all([
        fetch(`${API_ENDPOINTS.webTeam}/all`, { credentials: 'include' }),
        fetch(`${API_ENDPOINTS.users}`, { credentials: 'include' })
      ]);

      const dataMembers = await resMembers.json();
      if (dataMembers.success) setMembers(dataMembers.data);

      const dataUsers = await resUsers.json();
      if (dataUsers.success) setUsers(dataUsers.users);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const uploadData = new FormData();
    uploadData.append('file', file);

    setUploading(true);
    try {
        const res2 = await fetch('/api/upload', {
            method: 'POST',
            body: uploadData,
            credentials: 'include'
        });
        const data = await res2.json();
        if (data.success) {
            setFormData(prev => ({ ...prev, image_url: data.url }));
        } else {
            alert('Error uploading image');
        }
    } catch (error) {
        console.error(error);
        alert('Upload failed');
    } finally {
        setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingMember ? `${API_ENDPOINTS.webTeam}/${editingMember.id}` : API_ENDPOINTS.webTeam;
    const method = editingMember ? 'PUT' : 'POST';

    // Prepare payload
    const payload = {
        ...formData,
        user_id: formData.user_id ? Number(formData.user_id) : null
    };

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      setShowModal(false);
      setEditingMember(null);
      resetForm();
      fetchData();
    } catch (e) {
      console.error(e);
      alert('Error al guardar');
    }
  };

  const resetForm = () => {
      setFormData({ name: '', role: '', title: '', image_url: '', linkedin_url: '', category: 'member', department: 'management', user_id: '' });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar miembro del equipo?')) return;
    try {
      await fetch(`${API_ENDPOINTS.webTeam}/${id}`, { method: 'DELETE', credentials: 'include' });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const openEdit = (m: TeamMember) => {
    setEditingMember(m);
    setFormData({
        name: m.name,
        role: m.role || '',
        title: m.title || '',
        image_url: m.image_url || '',
        linkedin_url: m.linkedin_url || '',
        category: m.category || 'member',
        department: m.department || 'management',
        user_id: m.user_id || ''
    });
    setShowModal(true);
  };

  const openAdd = () => {
    setEditingMember(null);
    resetForm();
    setShowModal(true);
  };

  const getCategoryLabel = (cat: string) => CATEGORIES.find(c => c.value === cat)?.label || cat;
  const getDepartmentLabel = (dep: string) => DEPARTMENTS.find(d => d.value === dep)?.label || dep;

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
        <div className="space-y-8">
            {DEPARTMENTS.map(dept => {
                const deptMembers = members.filter(m => m.department === dept.value);
                if (deptMembers.length === 0) return null;
                return (
                    <div key={dept.value}>
                        <h4 className="text-blue-300 font-bold mb-4 text-lg border-b border-white/10 pb-2">{dept.label}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {deptMembers.map(m => (
                                <div key={m.id} className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-start space-x-4 hover:bg-white/10 transition-colors relative">
                                    <div className="w-12 h-12 rounded-full bg-white/10 overflow-hidden flex-shrink-0">
                                        {m.image_url ? <img src={m.image_url} alt={m.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-white/40">Img</div>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h5 className="text-white font-bold truncate">{m.name}</h5>
                                        <p className="text-blue-400 text-xs mb-0.5 truncate">{m.role}</p>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${m.category === 'leader' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-white/10 text-white/50'}`}>
                                                {getCategoryLabel(m.category)}
                                            </span>
                                            {m.user_id && <User className="w-3 h-3 text-green-400" title="Usuario vinculado" />}
                                        </div>
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
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="Nombre Completo" />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-1">Rol / Cargo *</label>
                <input className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                      value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required placeholder="Ej: Ingeniero de Software" />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-1">Título Académico</label>
                <input className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                      value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ej: PhD, Estudiante de Máster..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-white/70 text-sm mb-1">Nivel Jerárquico</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                        value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                        {CATEGORIES.map(c => <option key={c.value} value={c.value} className="bg-slate-800">{c.label}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-white/70 text-sm mb-1">Departamento</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                        value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                        {DEPARTMENTS.map(d => <option key={d.value} value={d.value} className="bg-slate-800">{d.label}</option>)}
                    </select>
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-1">Imagen</label>
                <div className="flex space-x-2">
                    <input className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                        value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="URL o Subir archivo..." />
                    <label className="cursor-pointer bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-lg border border-white/10 transition-colors">
                        <Upload className="w-5 h-5" />
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                </div>
                {uploading && <p className="text-xs text-blue-400 mt-1">Subiendo...</p>}
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-1">Usuario Vinculado</label>
                <select className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                    value={formData.user_id} onChange={e => setFormData({...formData, user_id: e.target.value})}>
                    <option value="" className="bg-slate-800">-- Sin vincular --</option>
                    {users.map(u => (
                        <option key={u.id} value={u.id} className="bg-slate-800">{u.username} ({u.nombre_completo})</option>
                    ))}
                </select>
                <p className="text-xs text-white/40 mt-1">Vincular permite al usuario editar esta ficha.</p>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-1">LinkedIn URL</label>
                <input className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                      value={formData.linkedin_url} onChange={e => setFormData({...formData, linkedin_url: e.target.value})} placeholder="https://linkedin.com/in/..." />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
               <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-white/60 hover:text-white transition-colors">Cancelar</button>
               <GlassButton type="submit" variant="primary" disabled={uploading}>Guardar</GlassButton>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
