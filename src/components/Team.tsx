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

const academicSupervisors: TeamMemberProps[] = [
  {
    name: "Sergio Fortes",
    role: "Associate Proffessor",
    image: "https://imgs.search.brave.com/8DJ7lhGsX9FKJ042s9P5az0V8zwFfw0ZVuSmU0YDiQ0/rs:fit:860:0:0:0/g:ce/aHR0cDovL3d3dy5p/Yy51bWEuZXMvcmVw/b3NpdG9yeS9maWxl/RG93bmxvYWRlcj9y/Zm5hbWU9NmIxNTUw/OTctMDQyZi00YjY0/LWE1OWEtNTNlMzNk/MTVkYmViLmpwZw",
    department: "University of Málaga",
    social: {
      linkedin: "https://www.linkedin.com/in/sergiofortes/",
      github: "#",
      email: "sfr@ic.uma.es"
    }
  },
  {
    name: "Rafael Godoy",
    role: "Technical Lead",
    image: "https://media.licdn.com/dms/image/v2/C4E03AQFHRhsAceENTQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1637837631482?e=1756339200&v=beta&t=iQGDxTIeN6lWhwLc5vQnaI3xSc9GgCSJPapxkhYKrl0",
    department: "Electrical Engineering",
    social: {
      linkedin: "#",
      github: "#",
      email: "carlos.martinez@uma.es"
    }
  },
  {
    name: "Paco Muro",
    role: "Communications Lead",
    image: "http://www.ic.uma.es/repository/fileDownloader?rfname=91c535ad-2d44-44ed-ac3b-ebf970f4bdfd.jpeg",
    department: "Telecommunications",
    social: {
      linkedin: "#",
      github: "#",
      email: "laura.fernandez@uma.es"
    }
  },
  {
    name: "Pepe Pulido",
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

const studentLeaders: TeamMemberProps[] = [
  {
    name: "Sergio Fortes",
    role: "Associate Proffessor",
    image: "https://imgs.search.brave.com/8DJ7lhGsX9FKJ042s9P5az0V8zwFfw0ZVuSmU0YDiQ0/rs:fit:860:0:0:0/g:ce/aHR0cDovL3d3dy5p/Yy51bWEuZXMvcmVw/b3NpdG9yeS9maWxl/RG93bmxvYWRlcj9y/Zm5hbWU9NmIxNTUw/OTctMDQyZi00YjY0/LWE1OWEtNTNlMzNk/MTVkYmViLmpwZw",
    department: "University of Málaga",
    social: {
      linkedin: "https://www.linkedin.com/in/sergiofortes/",
      github: "#",
      email: "sfr@ic.uma.es"
    }
  },
  {
    name: "Rafael Godoy",
    role: "Technical Lead",
    image: "https://media.licdn.com/dms/image/v2/C4E03AQFHRhsAceENTQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1637837631482?e=1756339200&v=beta&t=iQGDxTIeN6lWhwLc5vQnaI3xSc9GgCSJPapxkhYKrl0",
    department: "Electrical Engineering",
    social: {
      linkedin: "#",
      github: "#",
      email: "carlos.martinez@uma.es"
    }
  },
  {
    name: "Paco Muro",
    role: "Communications Lead",
    image: "http://www.ic.uma.es/repository/fileDownloader?rfname=91c535ad-2d44-44ed-ac3b-ebf970f4bdfd.jpeg",
    department: "Telecommunications",
    social: {
      linkedin: "#",
      github: "#",
      email: "laura.fernandez@uma.es"
    }
  },
  {
    name: "Pepe Pulido",
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

const gsMembers: TeamMemberProps[] = [
  {
    name: "Sergio Fortes",
    role: "Associate Proffessor",
    image: "https://imgs.search.brave.com/8DJ7lhGsX9FKJ042s9P5az0V8zwFfw0ZVuSmU0YDiQ0/rs:fit:860:0:0:0/g:ce/aHR0cDovL3d3dy5p/Yy51bWEuZXMvcmVw/b3NpdG9yeS9maWxl/RG93bmxvYWRlcj9y/Zm5hbWU9NmIxNTUw/OTctMDQyZi00YjY0/LWE1OWEtNTNlMzNk/MTVkYmViLmpwZw",
    department: "University of Málaga",
    social: {
      linkedin: "https://www.linkedin.com/in/sergiofortes/",
      github: "#",
      email: "sfr@ic.uma.es"
    }
  },
  {
    name: "Rafael Godoy",
    role: "Technical Lead",
    image: "https://media.licdn.com/dms/image/v2/C4E03AQFHRhsAceENTQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1637837631482?e=1756339200&v=beta&t=iQGDxTIeN6lWhwLc5vQnaI3xSc9GgCSJPapxkhYKrl0",
    department: "Electrical Engineering",
    social: {
      linkedin: "#",
      github: "#",
      email: "carlos.martinez@uma.es"
    }
  },
  {
    name: "Paco Muro",
    role: "Communications Lead",
    image: "http://www.ic.uma.es/repository/fileDownloader?rfname=91c535ad-2d44-44ed-ac3b-ebf970f4bdfd.jpeg",
    department: "Telecommunications",
    social: {
      linkedin: "#",
      github: "#",
      email: "laura.fernandez@uma.es"
    }
  },
  {
    name: "Pepe Pulido",
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

const commsMembers: TeamMemberProps[] = [
  {
    name: "Sergio Fortes",
    role: "Associate Proffessor",
    image: "https://imgs.search.brave.com/8DJ7lhGsX9FKJ042s9P5az0V8zwFfw0ZVuSmU0YDiQ0/rs:fit:860:0:0:0/g:ce/aHR0cDovL3d3dy5p/Yy51bWEuZXMvcmVw/b3NpdG9yeS9maWxl/RG93bmxvYWRlcj9y/Zm5hbWU9NmIxNTUw/OTctMDQyZi00YjY0/LWE1OWEtNTNlMzNk/MTVkYmViLmpwZw",
    department: "University of Málaga",
    social: {
      linkedin: "https://www.linkedin.com/in/sergiofortes/",
      github: "#",
      email: "sfr@ic.uma.es"
    }
  },
  {
    name: "Rafael Godoy",
    role: "Technical Lead",
    image: "https://media.licdn.com/dms/image/v2/C4E03AQFHRhsAceENTQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1637837631482?e=1756339200&v=beta&t=iQGDxTIeN6lWhwLc5vQnaI3xSc9GgCSJPapxkhYKrl0",
    department: "Electrical Engineering",
    social: {
      linkedin: "#",
      github: "#",
      email: "carlos.martinez@uma.es"
    }
  },
  {
    name: "Paco Muro",
    role: "Communications Lead",
    image: "http://www.ic.uma.es/repository/fileDownloader?rfname=91c535ad-2d44-44ed-ac3b-ebf970f4bdfd.jpeg",
    department: "Telecommunications",
    social: {
      linkedin: "#",
      github: "#",
      email: "laura.fernandez@uma.es"
    }
  },
  {
    name: "Pepe Pulido",
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

const adcsMembers: TeamMemberProps[] = [
  {
    name: "Sergio Fortes",
    role: "Associate Proffessor",
    image: "https://imgs.search.brave.com/8DJ7lhGsX9FKJ042s9P5az0V8zwFfw0ZVuSmU0YDiQ0/rs:fit:860:0:0:0/g:ce/aHR0cDovL3d3dy5p/Yy51bWEuZXMvcmVw/b3NpdG9yeS9maWxl/RG93bmxvYWRlcj9y/Zm5hbWU9NmIxNTUw/OTctMDQyZi00YjY0/LWE1OWEtNTNlMzNk/MTVkYmViLmpwZw",
    department: "University of Málaga",
    social: {
      linkedin: "https://www.linkedin.com/in/sergiofortes/",
      github: "#",
      email: "sfr@ic.uma.es"
    }
  },
  {
    name: "Rafael Godoy",
    role: "Technical Lead",
    image: "https://media.licdn.com/dms/image/v2/C4E03AQFHRhsAceENTQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1637837631482?e=1756339200&v=beta&t=iQGDxTIeN6lWhwLc5vQnaI3xSc9GgCSJPapxkhYKrl0",
    department: "Electrical Engineering",
    social: {
      linkedin: "#",
      github: "#",
      email: "carlos.martinez@uma.es"
    }
  },
  {
    name: "Paco Muro",
    role: "Communications Lead",
    image: "http://www.ic.uma.es/repository/fileDownloader?rfname=91c535ad-2d44-44ed-ac3b-ebf970f4bdfd.jpeg",
    department: "Telecommunications",
    social: {
      linkedin: "#",
      github: "#",
      email: "laura.fernandez@uma.es"
    }
  },
  {
    name: "Pepe Pulido",
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

const epsMembers: TeamMemberProps[] = [
  {
    name: "Sergio Fortes",
    role: "Associate Proffessor",
    image: "https://imgs.search.brave.com/8DJ7lhGsX9FKJ042s9P5az0V8zwFfw0ZVuSmU0YDiQ0/rs:fit:860:0:0:0/g:ce/aHR0cDovL3d3dy5p/Yy51bWEuZXMvcmVw/b3NpdG9yeS9maWxl/RG93bmxvYWRlcj9y/Zm5hbWU9NmIxNTUw/OTctMDQyZi00YjY0/LWE1OWEtNTNlMzNk/MTVkYmViLmpwZw",
    department: "University of Málaga",
    social: {
      linkedin: "https://www.linkedin.com/in/sergiofortes/",
      github: "#",
      email: "sfr@ic.uma.es"
    }
  },
  {
    name: "Rafael Godoy",
    role: "Technical Lead",
    image: "https://media.licdn.com/dms/image/v2/C4E03AQFHRhsAceENTQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1637837631482?e=1756339200&v=beta&t=iQGDxTIeN6lWhwLc5vQnaI3xSc9GgCSJPapxkhYKrl0",
    department: "Electrical Engineering",
    social: {
      linkedin: "#",
      github: "#",
      email: "carlos.martinez@uma.es"
    }
  },
  {
    name: "Paco Muro",
    role: "Communications Lead",
    image: "http://www.ic.uma.es/repository/fileDownloader?rfname=91c535ad-2d44-44ed-ac3b-ebf970f4bdfd.jpeg",
    department: "Telecommunications",
    social: {
      linkedin: "#",
      github: "#",
      email: "laura.fernandez@uma.es"
    }
  },
  {
    name: "Pepe Pulido",
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

const softMembers: TeamMemberProps[] = [
  {
    name: "Sergio Fortes",
    role: "Associate Proffessor",
    image: "https://imgs.search.brave.com/8DJ7lhGsX9FKJ042s9P5az0V8zwFfw0ZVuSmU0YDiQ0/rs:fit:860:0:0:0/g:ce/aHR0cDovL3d3dy5p/Yy51bWEuZXMvcmVw/b3NpdG9yeS9maWxl/RG93bmxvYWRlcj9y/Zm5hbWU9NmIxNTUw/OTctMDQyZi00YjY0/LWE1OWEtNTNlMzNk/MTVkYmViLmpwZw",
    department: "University of Málaga",
    social: {
      linkedin: "https://www.linkedin.com/in/sergiofortes/",
      github: "#",
      email: "sfr@ic.uma.es"
    }
  },
  {
    name: "Rafael Godoy",
    role: "Technical Lead",
    image: "https://media.licdn.com/dms/image/v2/C4E03AQFHRhsAceENTQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1637837631482?e=1756339200&v=beta&t=iQGDxTIeN6lWhwLc5vQnaI3xSc9GgCSJPapxkhYKrl0",
    department: "Electrical Engineering",
    social: {
      linkedin: "#",
      github: "#",
      email: "carlos.martinez@uma.es"
    }
  },
  {
    name: "Paco Muro",
    role: "Communications Lead",
    image: "http://www.ic.uma.es/repository/fileDownloader?rfname=91c535ad-2d44-44ed-ac3b-ebf970f4bdfd.jpeg",
    department: "Telecommunications",
    social: {
      linkedin: "#",
      github: "#",
      email: "laura.fernandez@uma.es"
    }
  },
  {
    name: "Pepe Pulido",
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

const structMembers: TeamMemberProps[] = [
  {
    name: "Sergio Fortes",
    role: "Associate Proffessor",
    image: "https://imgs.search.brave.com/8DJ7lhGsX9FKJ042s9P5az0V8zwFfw0ZVuSmU0YDiQ0/rs:fit:860:0:0:0/g:ce/aHR0cDovL3d3dy5p/Yy51bWEuZXMvcmVw/b3NpdG9yeS9maWxl/RG93bmxvYWRlcj9y/Zm5hbWU9NmIxNTUw/OTctMDQyZi00YjY0/LWE1OWEtNTNlMzNk/MTVkYmViLmpwZw",
    department: "University of Málaga",
    social: {
      linkedin: "https://www.linkedin.com/in/sergiofortes/",
      github: "#",
      email: "sfr@ic.uma.es"
    }
  },
  {
    name: "Rafael Godoy",
    role: "Technical Lead",
    image: "https://media.licdn.com/dms/image/v2/C4E03AQFHRhsAceENTQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1637837631482?e=1756339200&v=beta&t=iQGDxTIeN6lWhwLc5vQnaI3xSc9GgCSJPapxkhYKrl0",
    department: "Electrical Engineering",
    social: {
      linkedin: "#",
      github: "#",
      email: "carlos.martinez@uma.es"
    }
  },
  {
    name: "Paco Muro",
    role: "Communications Lead",
    image: "http://www.ic.uma.es/repository/fileDownloader?rfname=91c535ad-2d44-44ed-ac3b-ebf970f4bdfd.jpeg",
    department: "Telecommunications",
    social: {
      linkedin: "#",
      github: "#",
      email: "laura.fernandez@uma.es"
    }
  },
  {
    name: "Pepe Pulido",
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

export function LeaderTeam() {
  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Our Team</Badge>
          <h2 className="text-3xl font-bold mb-4">Academic Supervisors</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {academicSupervisors.map((member, index) => (
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
                    <Button variant="ghost" size="icon" asChild>
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
      </div>
    </section>
  );
}

export function LeaderStudentTeam() {
  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Student Leaders</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {studentLeaders.map((member, index) => (
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
                    <Button variant="ghost" size="icon" asChild>
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
      </div>
    </section>
  );
}

export function GSTeam() {
  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ground Station Team</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {gsMembers.map((member, index) => (
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
                    <Button variant="ghost" size="icon" asChild>
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
      </div>
    </section>
  );
}

export function CommsTeam() {
  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Communications Team</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {commsMembers.map((member, index) => (
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
                    <Button variant="ghost" size="icon" asChild>
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
      </div>
    </section>
  );
}

export function ADCSTeam() {
  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Altitude Determination and Control System Team</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {adcsMembers.map((member, index) => (
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
                    <Button variant="ghost" size="icon" asChild>
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
      </div>
    </section>
  );
}

export function StructureTeam() {
  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Structure Team</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {structMembers.map((member, index) => (
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
                    <Button variant="ghost" size="icon" asChild>
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
      </div>
    </section>
  );
}

export function EPSTeam() {
  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Electrical Power System Team</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {epsMembers.map((member, index) => (
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
                    <Button variant="ghost" size="icon" asChild>
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
      </div>
    </section>
  );
}

export function OBSoftTeam() {
  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">On-Board Software Team</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {softMembers.map((member, index) => (
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
                    <Button variant="ghost" size="icon" asChild>
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
      </div>
    </section>
  );
}