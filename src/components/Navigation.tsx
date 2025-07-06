import React, { useState, useEffect, createContext, useContext } from 'react';
import { Menu, X } from 'lucide-react';
import { GlassContainer } from './GlassContainer';

interface NavigationContextType {
  hideNavigation: () => void;
  showNavigation: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProps {
  children?: React.ReactNode;
}

export const Navigation: React.FC<NavigationProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHiddenByModal, setIsHiddenByModal] = useState(false);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      // Don't change visibility if hidden by modal
      if (isHiddenByModal) return;
      
      if (currentScrollY < 50) {
        // Always show when near top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Hide when scrolling down
        setIsVisible(false);
        setIsMenuOpen(false); // Close mobile menu when hiding
      } else if (currentScrollY < lastScrollY) {
        // Show when scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    const handleScroll = () => {
      requestAnimationFrame(controlNavbar);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isHiddenByModal]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen) {
        const target = event.target as Element;
        if (!target.closest('[data-mobile-nav]')) {
          setIsMenuOpen(false);
        }
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMenuOpen]);

  const navItems = [
    { href: "#inicio", label: "Inicio" },
    { href: "#acerca", label: "Acerca de" },
    { href: "#subsistemas", label: "Subsistemas" },
    { href: "#equipo", label: "Equipo" },
    { href: "#contacto", label: "Contacto" }
  ];

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const hideNavigation = () => {
    setIsHiddenByModal(true);
    setIsVisible(false);
    setIsMenuOpen(false);
  };

  const showNavigation = () => {
    setIsHiddenByModal(false);
    // Only show if we're not in a scroll-down state
    if (window.scrollY < 50 || window.scrollY < lastScrollY) {
      setIsVisible(true);
    }
  };

  const shouldShowNav = isVisible && !isHiddenByModal;

  return (
    <NavigationContext.Provider value={{ hideNavigation, showNavigation }}>
      <>
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
          shouldShowNav ? 'translate-y-0' : '-translate-y-full'
        }`} data-mobile-nav>
          <div className="px-4 py-4">
            <div className="max-w-7xl mx-auto">
              <GlassContainer className="nav-glass">
                <div className="px-6 py-4">
                  {/* Desktop Navigation */}
                  <div className="hidden md:flex items-center justify-center space-x-8">
                    {navItems.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => handleNavClick(item.href)}
                        className="text-white/90 hover:text-white transition-colors duration-300 font-medium cursor-pointer px-4 py-2 rounded-lg hover:bg-white/10"
                      >
                        {item.label}
                      </button>
                    ))}
                    
                    {/* CTA Button */}
                    <div className="ml-6">
                      <GlassContainer className="nav-cta-glass">
                        <button
                          onClick={() => handleNavClick('#equipo')}
                          className="px-6 py-2 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 bg-gradient-to-r from-blue-500/30 to-blue-600/30 border border-blue-400/50 hover:from-blue-400/40 hover:to-blue-500/40 hover:border-blue-300/60 relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          <span className="relative z-10 drop-shadow-lg">Únete al Equipo</span>
                        </button>
                      </GlassContainer>
                    </div>
                  </div>

                  {/* Mobile Navigation Header */}
                  <div className="md:hidden flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 flex items-center justify-center">
                        <img 
                          src="/image copy copy.png" 
                          alt="MST Logo" 
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <div>
                        <span className="text-white font-bold text-lg">MST</span>
                        <div className="text-xs text-white/70 leading-none">Málaga Space Team</div>
                      </div>
                    </div>
                    <button
                      onClick={handleMenuToggle}
                      className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors z-10 relative"
                      data-mobile-nav
                    >
                      {isMenuOpen ? (
                        <X className="w-5 h-5 text-white" />
                      ) : (
                        <Menu className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </GlassContainer>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`} data-mobile-nav>
            <div className="px-4 pb-6">
              <div className="max-w-7xl mx-auto">
                <GlassContainer className="nav-glass">
                  <div className="p-4 space-y-3">
                    {navItems.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => handleNavClick(item.href)}
                        className="w-full text-left text-white/90 hover:text-white transition-colors duration-300 font-medium cursor-pointer px-4 py-3 rounded-lg hover:bg-white/10 text-base"
                        data-mobile-nav
                      >
                        {item.label}
                      </button>
                    ))}
                    
                    {/* Mobile CTA Button */}
                    <div className="mt-4 pt-3 border-t border-white/20" data-mobile-nav>
                      <GlassContainer className="nav-cta-mobile-glass">
                        <button
                          onClick={() => handleNavClick('#equipo')}
                          className="w-full text-center text-white font-semibold px-4 py-4 rounded-lg transition-all duration-300 bg-gradient-to-r from-blue-500/30 to-blue-600/30 border border-blue-400/50 hover:from-blue-400/40 hover:to-blue-500/40 hover:border-blue-300/60 relative overflow-hidden group"
                          data-mobile-nav
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          <span className="relative z-10 drop-shadow-lg text-base">🚀 Únete al Equipo</span>
                        </button>
                      </GlassContainer>
                    </div>
                  </div>
                </GlassContainer>
              </div>
            </div>
          </div>
        </nav>

        {/* Spacer for fixed navigation */}
        <div className="h-20 md:h-24"></div>
        
        {/* Render children within the NavigationContext */}
        {children}
      </>
    </NavigationContext.Provider>
  );
};

export { NavigationContext };