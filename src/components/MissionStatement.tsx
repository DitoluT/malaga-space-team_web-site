import React from "react";
import { motion } from "framer-motion";
import { Rocket, Lightbulb, Users, Globe } from "lucide-react";

interface MissionItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const missionItems: MissionItemProps[] = [
  {
    icon: <Rocket className="h-6 w-6" />,
    title: "Technological Innovation",
    description: "Developing cutting-edge CubeSat technology to advance the field of aerospace engineering and satellite communication."
  },
  {
    icon: <Lightbulb className="h-6 w-6" />,
    title: "Educational Excellence",
    description: "Providing hands-on learning opportunities for students in engineering, computer science, and related fields."
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Collaborative Research",
    description: "Fostering collaboration between academic departments, industry partners, and space agencies."
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Global Impact",
    description: "Contributing meaningful data to address environmental monitoring, disaster response, and global communication challenges."
  }
];

export function MissionStatement() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Our Mission
          </motion.h2>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            The University of Málaga CubeSat Project aims to design, build, and launch a fully functional CubeSat to advance research, education, and innovation in space technology.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {missionItems.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-lg p-6 border hover:border-primary transition-colors duration-300"
            >
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4 text-primary">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}