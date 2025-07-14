import React from 'react';
import { SpaceBackground } from './components/SpaceBackground';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { StatsSection } from './components/StatsSection';
import { MissionSection } from './components/MissionSection';
import { TimelineSection } from './components/TimelineSection';
import { SubsystemsSection } from './components/SubsystemsSection';
import { TeamSection } from './components/TeamSection';
import { SponsorsSection } from './components/SponsorsSection';
import { ContactFormWithEmailJS } from './content/contactContent';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      <SpaceBackground />
      <Navigation>
        <main className="relative z-10">
          <HeroSection />
          <StatsSection />
          <MissionSection />
          <TimelineSection />
          <SubsystemsSection />
          <TeamSection />
          <SponsorsSection />
          <ContactFormWithEmailJS />
        </main>
        
        <Footer />
      </Navigation>
    </div>
  );
}

export default App;