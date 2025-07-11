import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NewsItemProps {
  title: string;
  date: Date;
  excerpt: string;
  image: string;
  slug: string;
  tags: string[];
}

const newsItems: NewsItemProps[] = [
  {
    title: "University of Málaga Secures Funding for CubeSat Project",
    date: new Date("2023-11-10"),
    excerpt: "The European Space Agency has approved funding for our CubeSat project, marking a significant milestone in our space research initiatives.",
    image: "https://images.pexels.com/photos/256219/pexels-photo-256219.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    slug: "funding-secured",
    tags: ["Funding", "Milestone"]
  },
  {
    title: "Engineering Students Complete Satellite Prototype",
    date: new Date("2024-02-05"),
    excerpt: "A team of undergraduate and graduate students has successfully completed the first prototype of our CubeSat's structure subsystem.",
    image: "https://images.pexels.com/photos/2156/sky-earth-space-working.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    slug: "prototype-completed",
    tags: ["Development", "Student Achievement"]
  },
  {
    title: "International Conference on Small Satellites Features UMA Research",
    date: new Date("2024-04-22"),
    excerpt: "Our research team presented their innovative approach to CubeSat power management at this year's International Conference on Small Satellites.",
    image: "https://images.pexels.com/photos/2166/flight-sky-earth-space.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    slug: "conference-presentation",
    tags: ["Research", "Conference"]
  }
];

export function NewsPreview() {
  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <Badge variant="outline" className="mb-4">Latest Updates</Badge>
            <h2 className="text-3xl font-bold mb-2">News & Announcements</h2>
            <p className="text-muted-foreground max-w-2xl">
              Stay up to date with the latest developments, achievements, and milestones from our CubeSat project.
            </p>
          </div>
          <Button 
            variant="outline" 
            className="mt-4 md:mt-0"
            asChild
          >
            <a href="/news">
              View All News
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{format(item.date, "MMMM d, yyyy")}</span>
                  </div>
                  <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground line-clamp-3">{item.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {item.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <a href={`/news/${item.slug}`}>
                      Read More
                      <ArrowRight className="h-4 w-4 ml-2" />
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