import React from "react";
import { 
  Satellite, 
  Mail, 
  MapPin, 
  Phone, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Github,
  Linkedin
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Satellite className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Málaga Space Team</span>
            </div>
            <p className="text-sm text-gray-400 max-w-md">
              Advancing space technology education and research through Space at the University of Málaga.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <p className="text-sm text-gray-400">
                  ETS Ingeniería de Telecomunicaciones, Campus de Teatinos, Blvr. Louis Pasteur, 35, Teatinos-Universidad, 29010 Málaga
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <a href="mailto:cubesat@uma.es" className="text-sm text-gray-400 hover:text-primary transition-colors">
                  spaceteam@uma.es
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex space-x-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/in/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="GitHub">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Málaga Space Team. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="/privacy" className="text-sm text-gray-400 hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-sm text-gray-400 hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}