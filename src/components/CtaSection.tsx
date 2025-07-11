import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-20 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <motion.div 
            className="mb-8 lg:mb-0 lg:w-2/3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Join the CubeSat Project Team</h2>
            <p className="text-primary-foreground max-w-xl">
              We're looking for passionate students and researchers to join our multidisciplinary team. 
              Whether you're interested in aerospace engineering, electronics, programming, or science, 
              there's a place for you in our CubeSat project.
            </p>
          </motion.div>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90"
              asChild
            >
              <a href="/contact">
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-transparent border-white text-white hover:bg-white/10"
              asChild
            >
              <a href="mailto:spaceteam@uma.es">
                <Send className="mr-2 h-4 w-4" />
                Email the Team
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}