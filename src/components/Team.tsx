import React, { useEffect, useState } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { API_ENDPOINTS } from "../config/api";

// Helper function for role translation
const useTranslatedRole = () => {
  const { t } = useTranslation();
  return (role: string) => {
    const key = role.toLowerCase().replace(/\s+/g, '').replace('proffessor', 'professor');
    return t(`team.roles.${key}`, role);
  };
};

interface TeamMember {
  id: number;
  name: string;
  role: string;
  department: string;
  category: string;
  image_url: string;
  linkedin_url?: string;
  github_url?: string;
  email?: string;
}

// Hook to fetch team members
const useTeamMembers = (filters: { category?: string; department?: string }) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.webTeam);
        const data = await res.json();
        if (data.success) {
          const allMembers = data.data as TeamMember[];
          const filtered = allMembers.filter(m => {
             if (filters.category && m.category !== filters.category) return false;
             if (filters.department && m.department !== filters.department) return false;
             return true;
          });
          setMembers(filtered);
        }
      } catch (e) {
        console.error("Failed to fetch team members", e);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [JSON.stringify(filters)]);

  return { members, loading };
};

const TeamGrid = ({ title, members, loading }: { title: string, members: TeamMember[], loading: boolean }) => {
  const getTranslatedRole = useTranslatedRole();
  
  if (loading) return <div className="py-8 text-center text-muted-foreground">Loading...</div>;
  if (members.length === 0) return null;

  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member, index) => (
            <div
              key={member.id}
              className="bg-card rounded-lg overflow-hidden border shadow-sm flex flex-col h-full hover:shadow-md transition-shadow duration-300"
            >
                <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  {member.image_url ? (
                    <img
                        src={member.image_url}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <span className="text-4xl text-gray-300 select-none">{member.name.charAt(0)}</span>
                  )}
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{getTranslatedRole(member.role)}</p>
                </div>
                <div className="px-4 text-center">
                  {member.department && <span className="inline-block bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">{member.department}</span>}
                </div>
                <div className="p-4 mt-auto flex justify-center space-x-2 border-t">
                  {member.linkedin_url && (
                      <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className="p-2 hover:bg-muted rounded-full transition-colors">
                        <Linkedin className="h-4 w-4" />
                      </a>
                  )}
                  {member.github_url && (
                      <a href={member.github_url} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="p-2 hover:bg-muted rounded-full transition-colors">
                        <Github className="h-4 w-4" />
                      </a>
                  )}
                  {member.email && (
                      <a href={`mailto:${member.email}`} aria-label="Email" className="p-2 hover:bg-muted rounded-full transition-colors">
                        <Mail className="h-4 w-4" />
                      </a>
                  )}
                </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export function LeaderTeam() {
  const { t } = useTranslation();
  const { members, loading } = useTeamMembers({ category: 'director' });
  return <TeamGrid title={t('team.treeModal.sections.directors')} members={members} loading={loading} />;
}

export function LeaderStudentTeam() {
  const { members, loading } = useTeamMembers({ category: 'coordinator' }); // Mapping studentLeaders to coordinator
  return <TeamGrid title="Team Leaders" members={members} loading={loading} />;
}

export function GSTeam() {
  const { members, loading } = useTeamMembers({ department: 'groundStation' });
  return <TeamGrid title="Ground Station Team" members={members} loading={loading} />;
}

export function CommsTeam() {
  const { members, loading } = useTeamMembers({ department: 'comms' });
  return <TeamGrid title="Communications Team" members={members} loading={loading} />;
}

export function ADCSTeam() {
  const { members, loading } = useTeamMembers({ department: 'adcs' });
  return <TeamGrid title="Altitude Determination and Control System Team" members={members} loading={loading} />;
}

export function StructureTeam() {
  const { members, loading } = useTeamMembers({ department: 'structure' });
  return <TeamGrid title="Structure Team" members={members} loading={loading} />;
}

export function EPSTeam() {
  const { members, loading } = useTeamMembers({ department: 'eps' });
  return <TeamGrid title="Electrical Power System Team" members={members} loading={loading} />;
}

export function OBSoftTeam() {
  const { members, loading } = useTeamMembers({ department: 'software' });
  return <TeamGrid title="On-Board Software Team" members={members} loading={loading} />;
}
