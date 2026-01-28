import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { GlassButton } from '../../GlassButton';
import { API_ENDPOINTS } from '../../../config/api';

interface TimelineEvent {
  id: number;
  year: string;
  title: string;
  description: string;
  display_order: number;
}

export const TimelineManager: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);

  const [formData, setFormData] = useState({ year: '', title: '', description: '' });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_ENDPOINTS.webTimeline}/all`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        // Sort by year/display_order if needed, usually backend handles it or we do it here
        setEvents(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingEvent ? `${API_ENDPOINTS.webTimeline}/${editingEvent.id}` : API_ENDPOINTS.webTimeline;
    const method = editingEvent ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      setShowModal(false);
      setEditingEvent(null);
      setFormData({ year: '', title: '', description: '' });
      fetchEvents();
    } catch (e) {
      console.error(e);
      alert('Error al guardar');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar evento?')) return;
    try {
      await fetch(`${API_ENDPOINTS.webTimeline}/${id}`, { method: 'DELETE', credentials: 'include' });
      fetchEvents();
    } catch (e) {
      console.error(e);
    }
  };

  const openEdit = (ev: TimelineEvent) => {
    setEditingEvent(ev);
    setFormData({ year: ev.year, title: ev.title, description: ev.description });
    setShowModal(true);
  };

  const openAdd = () => {
    setEditingEvent(null);
    setFormData({ year: '', title: '', description: '' });
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h3 className="text-xl text-white font-semibold">Cronología (Timeline)</h3>
        <GlassButton variant="primary" icon={Plus} onClick={openAdd}>Añadir Evento</GlassButton>
      </div>

      {loading ? (
         <div className="text-center text-white/60">Cargando...</div>
      ) : events.length === 0 ? (
         <div className="text-center text-white/40 p-8 border border-white/10 rounded-lg">No hay eventos en la cronología.</div>
      ) : (
        <div className="space-y-3">
          {events.map(ev => (
            <div key={ev.id} className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
                <div>
                   <span className="text-blue-400 font-bold text-lg block mb-1">{ev.year}</span>
                   <h4 className="text-white font-semibold">{ev.title}</h4>
                   <p className="text-white/60 text-sm mt-1 max-w-2xl">{ev.description}</p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button onClick={() => openEdit(ev)} className="p-2 bg-white/10 rounded hover:bg-white/20 text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(ev.id)} className="p-2 bg-red-500/10 rounded hover:bg-red-500/20 text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-white/20 p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h3 className="text-xl text-white font-bold mb-6">{editingEvent ? 'Editar' : 'Añadir'} Evento</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-1">Año/Fecha *</label>
                <input className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                      value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} required placeholder="Ej: 2023, Diciembre 2024" />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-1">Título *</label>
                <input className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none"
                      value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="Título del hito" />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-1">Descripción *</label>
                <textarea className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white focus:border-blue-500 focus:outline-none min-h-[100px]"
                      value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required placeholder="Descripción detallada..." />
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
