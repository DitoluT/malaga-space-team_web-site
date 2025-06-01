import React from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle,
  CalendarDays
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

type StatusType = "completed" | "in-progress" | "upcoming" | "delayed";

interface StatusItemProps {
  title: string;
  date: string;
  status: StatusType;
  description: string;
}

const statusItems: StatusItemProps[] = [
  {
    title: "Project Initiation",
    date: "March 2023",
    status: "completed",
    description: "Project approved by the University Board and initial funding secured."
  },
  {
    title: "Design Phase",
    date: "September 2023",
    status: "completed",
    description: "CubeSat design finalized and reviewed by aerospace engineering partners."
  },
  {
    title: "Component Acquisition",
    date: "January 2024",
    status: "in-progress",
    description: "Procurement of hardware components and testing equipment."
  },
  {
    title: "Assembly & Integration",
    date: "June 2024",
    status: "upcoming",
    description: "Integration of all subsystems and initial testing procedures."
  },
  {
    title: "Testing & Verification",
    date: "October 2024",
    status: "upcoming",
    description: "Environmental testing and verification of all systems."
  },
  {
    title: "Launch Preparation",
    date: "March 2025",
    status: "upcoming",
    description: "Final checks and preparations for launch."
  }
];

const StatusIcon = ({ status }: { status: StatusType }) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case "in-progress":
      return <Clock className="h-5 w-5 text-blue-500" />;
    case "upcoming":
      return <Circle className="h-5 w-5 text-gray-400" />;
    case "delayed":
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    default:
      return <Circle className="h-5 w-5 text-gray-400" />;
  }
};

const StatusLabel = ({ status }: { status: StatusType }) => {
  switch (status) {
    case "completed":
      return <Badge variant="green">Completed</Badge>;
    case "in-progress":
      return <Badge variant="blue">In Progress</Badge>;
    case "upcoming":
      return <Badge variant="secondary">Upcoming</Badge>;
    case "delayed":
      return <Badge variant="yellow">Delayed</Badge>;
    default:
      return <Badge variant="secondary">Upcoming</Badge>;
  }
};

export function ProjectStatus() {
  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Project Timeline</Badge>
          <h2 className="text-3xl font-bold mb-4">Current Project Status</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Track the progress of our CubeSat project from conception to launch with our detailed timeline.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border transform md:-translate-x-px"></div>

          <div className="space-y-12">
            {statusItems.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline circle */}
                <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-card border-2 border-primary flex items-center justify-center transform -translate-x-1/2 z-10">
                  <StatusIcon status={item.status} />
                </div>

                {/* Content */}
                <div className={`w-full md:w-1/2 ${
                  index % 2 === 0 ? "md:pr-12" : "md:pl-12"
                }`}>
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{item.title}</CardTitle>
                        <StatusLabel status={item.status} />
                      </div>
                      <CardDescription className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-2" />
                        {item.date}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{item.description}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Empty space for the other side */}
                <div className="hidden md:block w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}