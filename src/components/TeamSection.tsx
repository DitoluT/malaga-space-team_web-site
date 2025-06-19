import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
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

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  department: string;
  social?: {
    linkedin?: string;
    github?: string;
    email?: string;
  };
}

const teamMembers: TeamMemberProps[] = [
  {
    name: "Sergio Fortes",
    role: "Associate Proffessor",
    image: "https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    department: "Communications Engineering",
    social: {
      linkedin: "#",
      github: "#",
      email: "sfr@ic.uma.es"
    }
  },
  {
    name: "Rafael Godoy",
    role: "Technical Lead",
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    department: "Electrical Engineering",
    social: {
      linkedin: "#",
      github: "#",
      email: "carlos.martinez@uma.es"
    }
  },
  {
    name: "Dr. Laura Fernández",
    role: "Communications Lead",
    image: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    department: "Telecommunications",
    social: {
      linkedin: "#",
      github: "#",
      email: "laura.fernandez@uma.es"
    }
  },
  {
    name: "Prof. Antonio López",
    role: "Software Lead",
    image: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    department: "Computer Science",
    social: {
      linkedin: "#",
      github: "#",
      email: "antonio.lopez@uma.es"
    }
  }
];

export function TeamSection() {
  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Our Team</Badge>
          <h2 className="text-3xl font-bold mb-4">Meet the Leadership Team</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our multidisciplinary team brings together expertise from various fields to make the CubeSat project a success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden h-full flex flex-col">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <Badge variant="secondary" className="mb-2">{member.department}</Badge>
                </CardContent>
                <CardFooter className="flex justify-start space-x-2 border-t pt-4">
                  {member.social?.linkedin && (
                    <Button variant="ghost\" size="icon\" asChild>
                      <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {member.social?.github && (
                    <Button variant="ghost" size="icon" asChild>
                      <a href={member.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
                        <Github className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {member.social?.email && (
                    <Button variant="ghost" size="icon" asChild>
                      <a href={`mailto:${member.social.email}`} aria-label="Email">
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild>
            <a href="/about#team">View Full Team</a>
          </Button>
        </div>
      </div>
    </section>
  );
}