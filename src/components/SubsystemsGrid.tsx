import React from "react";
import { motion } from "framer-motion";
import { 
  Cpu, 
  Battery, 
  Radio, 
  SquareStack, 
  Compass, 
  Workflow,
  ArrowUpRight 
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SubsystemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  slug: string;
  color: string;
}

const subsystems: SubsystemProps[] = [
  {
    icon: <SquareStack className="h-10 w-10" />,
    title: "Structure",
    description: "Mechanical design, material selection, and structural analysis to ensure the CubeSat can withstand launch and space conditions.",
    slug: "structure",
    color: "from-blue-600 to-blue-400"
  },
  {
    icon: <Battery className="h-10 w-10" />,
    title: "Power",
    description: "Power generation, storage, and distribution systems to provide electricity to all subsystems throughout the mission.",
    slug: "power",
    color: "from-green-600 to-green-400"
  },
  {
    icon: <Compass className="h-10 w-10" />,
    title: "ADCS",
    description: "Attitude Determination and Control System for satellite orientation and stability in orbit.",
    slug: "adcs",
    color: "from-orange-600 to-orange-400"
  },
  {
    icon: <Cpu className="h-10 w-10" />,
    title: "CDHS",
    description: "Command and Data Handling System that processes commands, manages data flow, and controls satellite operations.",
    slug: "cdhs",
    color: "from-purple-600 to-purple-400"
  },
  {
    icon: <Workflow className="h-10 w-10" />,
    title: "Payload",
    description: "Scientific instruments and experimental equipment designed to fulfill the CubeSat's mission objectives.",
    slug: "payload",
    color: "from-red-600 to-red-400"
  },
  {
    icon: <Radio className="h-10 w-10" />,
    title: "Communications",
    description: "Telecommunications systems for data transmission between the satellite and ground stations on Earth.",
    slug: "communications",
    color: "from-cyan-600 to-cyan-400"
  }
];

export function SubsystemsGrid() {
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
            CubeSat Subsystems
          </motion.h2>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Our CubeSat is comprised of six main subsystems, each handling critical functions needed for successful operation in space.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subsystems.map((subsystem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow overflow-hidden group border-2 hover:border-primary">
                <div className={`bg-gradient-to-r ${subsystem.color} text-white p-6`}>
                  {subsystem.icon}
                </div>
                <CardHeader>
                  <CardTitle>{subsystem.title}</CardTitle>
                  <CardDescription>Subsystem</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p>{subsystem.description}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="group-hover:text-primary transition-colors w-full justify-between"
                    asChild
                  >
                    <a href={`/subsystems/${subsystem.slug}`}>
                      Learn More
                      <ArrowUpRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}