import React, { useState, useEffect } from 'react';
import { User, Lock, Save, Upload } from 'lucide-react';
import { GlassButton } from '../GlassButton';
import { API_ENDPOINTS } from '../../config/api';

interface UserProfileProps {
  user: {
    id: number;
    username: string;
    nombre_completo: string;
    rol: string;
  };
}

interface TeamMember {
  id: number;
  name: string;
  image_url: string;
  linkedin_url: string;
  github_url: string;
  email: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null);
  const [loadingMember, setLoadingMember] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [memberFormData, setMemberFormData] = useState({
      name: '',
      image_url: '',
      linkedin_url: '',
      github_url: '',
      email: ''
  });

  useEffect(() => {
      fetchTeamMember();
  }, [user.id]);

  const fetchTeamMember = async () => {
      // We need to find the team member linked to this user.
      // Since we don't have a direct endpoint "get_my_team_member", we can search web_team.
      // Or we can add an endpoint.
      // For now, let's fetch all and filter (not efficient but works for small team).
      // A better way is GET /api/web/team?user_id=...
      try {
          const res = await fetch(`${API_ENDPOINTS.webTeam}/all`, { credentials: 'include' });
          const data = await res.json();
          if (data.success) {
              const member = data.data.find((m: any) => m.user_id === user.id);
              if (member) {
                  setTeamMember(member);
                  setMemberFormData({
                      name: member.name,
                      image_url: member.image_url || '',
                      linkedin_url: member.linkedin_url || '',
                      github_url: member.github_url || '',
                      email: member.email || ''
                  });
              }
          }
      } catch (e) {
          console.error(e);
      } finally {
          setLoadingMember(false);
      }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
        alert("Las contraseñas nuevas no coinciden");
        return;
    }

    try {
        const res = await fetch(API_ENDPOINTS.changePassword, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                current_password: passwordData.current,
                new_password: passwordData.new
            }),
            credentials: 'include'
        });
        const data = await res.json();
        if (data.success) {
            alert("Contraseña actualizada");
            setPasswordData({ current: '', new: '', confirm: '' });
        } else {
            alert(data.error || "Error al cambiar contraseña");
        }
    } catch (e) {
        console.error(e);
        alert("Error de red");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const uploadData = new FormData();
    uploadData.append('file', file);

    setUploading(true);
    try {
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: uploadData,
            credentials: 'include'
        });
        const data = await res.json();
        if (data.success) {
            setMemberFormData(prev => ({ ...prev, image_url: data.url }));
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!teamMember) return;

      try {
          const res = await fetch(`${API_ENDPOINTS.webTeam}/${teamMember.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(memberFormData),
              credentials: 'include'
          });
          const data = await res.json();
          if (data.success) {
              alert("Perfil público actualizado");
              fetchTeamMember();
          } else {
              alert(data.error || "Error al actualizar perfil");
          }
      } catch (e) {
          console.error(e);
          alert("Error de red");
      }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <User className="w-6 h-6 mr-3 text-blue-400" />
            Mi Perfil de Usuario
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <p className="text-white/60 text-sm mb-1">Nombre de Usuario</p>
                <p className="text-white font-medium text-lg mb-4">{user.username}</p>

                <p className="text-white/60 text-sm mb-1">Nombre Completo</p>
                <p className="text-white font-medium text-lg mb-4">{user.nombre_completo}</p>

                <p className="text-white/60 text-sm mb-1">Rol</p>
                <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-bold uppercase">{user.rol}</span>
            </div>

            <form onSubmit={handleChangePassword} className="bg-black/20 p-6 rounded-lg border border-white/5">
                <h3 className="text-white font-bold mb-4 flex items-center">
                    <Lock className="w-4 h-4 mr-2 text-yellow-400" />
                    Cambiar Contraseña
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-white/70 text-xs mb-1">Contraseña Actual</label>
                        <input type="password" required className="w-full bg-black/40 border border-white/10 rounded p-2 text-white text-sm"
                            value={passwordData.current} onChange={e => setPasswordData({...passwordData, current: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-white/70 text-xs mb-1">Nueva Contraseña</label>
                        <input type="password" required className="w-full bg-black/40 border border-white/10 rounded p-2 text-white text-sm"
                            value={passwordData.new} onChange={e => setPasswordData({...passwordData, new: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-white/70 text-xs mb-1">Confirmar Nueva Contraseña</label>
                        <input type="password" required className="w-full bg-black/40 border border-white/10 rounded p-2 text-white text-sm"
                            value={passwordData.confirm} onChange={e => setPasswordData({...passwordData, confirm: e.target.value})} />
                    </div>
                    <GlassButton type="submit" variant="primary" size="sm" className="w-full justify-center">Actualizar Contraseña</GlassButton>
                </div>
            </form>
        </div>
      </div>

      {loadingMember ? (
          <div className="text-center text-white/60">Cargando perfil público...</div>
      ) : teamMember ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <User className="w-6 h-6 mr-3 text-green-400" />
                Mi Ficha Pública (Web)
            </h2>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-shrink-0">
                        <label className="block text-white/70 text-sm mb-2 text-center">Foto de Perfil</label>
                        <div className="w-40 h-40 bg-black/40 rounded-full overflow-hidden border-2 border-white/20 mx-auto relative group">
                            {memberFormData.image_url ? (
                                <img src={memberFormData.image_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/30">Sin foto</div>
                            )}
                            <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Upload className="w-8 h-8 text-white" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        </div>
                        {uploading && <p className="text-center text-blue-400 text-xs mt-2">Subiendo...</p>}
                    </div>

                    <div className="flex-1 space-y-4">
                        <div>
                            <label className="block text-white/70 text-sm mb-1">Nombre Visible</label>
                            <input className="w-full bg-black/40 border border-white/10 rounded p-2.5 text-white focus:border-blue-500 focus:outline-none"
                                value={memberFormData.name} onChange={e => setMemberFormData({...memberFormData, name: e.target.value})} />
                        </div>

                        <div>
                            <label className="block text-white/70 text-sm mb-1">Email Público</label>
                            <input className="w-full bg-black/40 border border-white/10 rounded p-2.5 text-white focus:border-blue-500 focus:outline-none"
                                value={memberFormData.email} onChange={e => setMemberFormData({...memberFormData, email: e.target.value})} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/70 text-sm mb-1">LinkedIn URL</label>
                                <input className="w-full bg-black/40 border border-white/10 rounded p-2.5 text-white focus:border-blue-500 focus:outline-none"
                                    value={memberFormData.linkedin_url} onChange={e => setMemberFormData({...memberFormData, linkedin_url: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-white/70 text-sm mb-1">GitHub URL</label>
                                <input className="w-full bg-black/40 border border-white/10 rounded p-2.5 text-white focus:border-blue-500 focus:outline-none"
                                    value={memberFormData.github_url} onChange={e => setMemberFormData({...memberFormData, github_url: e.target.value})} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-white/70 text-sm mb-1">Imagen URL (Alternativo)</label>
                            <input className="w-full bg-black/40 border border-white/10 rounded p-2.5 text-white focus:border-blue-500 focus:outline-none"
                                value={memberFormData.image_url} onChange={e => setMemberFormData({...memberFormData, image_url: e.target.value})} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/10">
                    <GlassButton type="submit" variant="primary" icon={Save}>Guardar Cambios</GlassButton>
                </div>
            </form>
          </div>
      ) : (
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
              <p className="text-white/60">Tu usuario no está vinculado a ninguna ficha pública del equipo.</p>
              <p className="text-white/40 text-sm mt-2">Contacta con un administrador si deberías aparecer en el organigrama.</p>
          </div>
      )}
    </div>
  );
};
