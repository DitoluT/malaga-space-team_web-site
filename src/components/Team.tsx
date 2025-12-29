import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { API_ENDPOINTS } from "../config/api";

// Helper function for role translation
const useTranslatedRole = () => {
  const { t } = useTranslation();
  return (role: string) => {
    // Basic sanitization to try to match i18n keys if they exist
    const key = role.toLowerCase().replace(/\s+/g, '').replace('proffessor', 'professor');
    // If we have dynamic roles from DB, we might just return the role itself if no translation found
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
const useTeamMembers = (category: string) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.webTeam);
        const data = await res.json();
        if (data.success) {
          const allMembers = data.data as TeamMember[];
          setMembers(allMembers.filter(m => m.category === category));
        }
      } catch (e) {
        console.error("Failed to fetch team members", e);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [category]);

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
          {/* <Badge variant="outline" className="mb-4">Team</Badge> */}
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden h-full flex flex-col">
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
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{getTranslatedRole(member.role)}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  {member.department && <Badge variant="secondary" className="mb-2">{member.department}</Badge>}
                </CardContent>
                <CardFooter className="flex justify-start space-x-2 border-t pt-4">
                  {member.linkedin_url && (
                    <Button variant="ghost" size="icon" asChild>
                      <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {member.github_url && (
                    <Button variant="ghost" size="icon" asChild>
                      <a href={member.github_url} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {member.email && (
                    <Button variant="ghost" size="icon" asChild>
                      <a href={`mailto:${member.email}`} aria-label="Email">
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export function LeaderTeam() {
  const { t } = useTranslation();
  const { members, loading } = useTeamMembers('academicSupervisors');
  return <TeamGrid title={t('team.treeModal.sections.directors')} members={members} loading={loading} />;
}

export function LeaderStudentTeam() {
  const { members, loading } = useTeamMembers('studentLeaders');
  return <TeamGrid title="Team Leaders" members={members} loading={loading} />;
}

export function GSTeam() {
  const { members, loading } = useTeamMembers('groundStation');
  return <TeamGrid title="Ground Station Team" members={members} loading={loading} />;
}

export function CommsTeam() {
  const { members, loading } = useTeamMembers('communications');
  return <TeamGrid title="Communications Team" members={members} loading={loading} />;
}

export function ADCSTeam() {
  const { members, loading } = useTeamMembers('adcs');
  return <TeamGrid title="Altitude Determination and Control System Team" members={members} loading={loading} />;
}

export function StructureTeam() {
  const { members, loading } = useTeamMembers('structure');
  return <TeamGrid title="Structure Team" members={members} loading={loading} />;
}

export function EPSTeam() {
  const { members, loading } = useTeamMembers('eps');
  return <TeamGrid title="Electrical Power System Team" members={members} loading={loading} />;
}

export function OBSoftTeam() {
  const { members, loading } = useTeamMembers('software');
  return <TeamGrid title="On-Board Software Team" members={members} loading={loading} />;
}
