import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  image?: string;
  cta?: {
    primary: { text: string; href: string };
    secondary?: { text: string; href: string };
  };
}

export function HeroSection({ 
  title, 
  subtitle, 
  image = "https://images.pexels.com/photos/41162/moon-landing-apollo-11-nasa-buzz-aldrin-41162.jpeg", 
  cta 
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/70 z-10"></div>
        <img
          src={image}
          alt="Space background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-24 md:py-32 lg:py-40 relative z-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {title}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              {subtitle}
            </p>
          </motion.div>

          {cta && (
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button 
                size="lg" 
                asChild
                className="bg-primary hover:bg-primary/90 text-white font-medium"
              >
                <a href={cta.primary.href}>
                  {cta.primary.text}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>

              {cta.secondary && (
                <Button 
                  variant="outline" 
                  size="lg" 
                  asChild
                  className="bg-transparent border-white text-white hover:bg-white/10"
                >
                  <a href={cta.secondary.href}>
                    {cta.secondary.text}
                  </a>
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Floating Satellite Icon */}
      <motion.div 
        className="hidden lg:block absolute bottom-20 right-20 z-20"
        animate={{ y: [0, -15, 0] }}
        transition={{ 
          repeat: Infinity, 
          duration: 4,
          ease: "easeInOut" 
        }}
      >
        <div className="bg-primary/20 backdrop-blur-lg p-4 rounded-full">
          <Rocket className="h-12 w-12 text-primary" />
        </div>
      </motion.div>
    </section>
  );
}