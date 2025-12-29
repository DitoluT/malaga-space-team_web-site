import React, { useState } from 'react';
import { Users, Clock, Briefcase } from 'lucide-react';
import { PartnersManager } from './PartnersManager';
import { TimelineManager } from './TimelineManager';
import { TeamManager } from './TeamManager';

type Tab = 'partners' | 'timeline' | 'team';

export const ContentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('partners');

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 border-b border-white/10 pb-2">
        <button
            onClick={() => setActiveTab('partners')}
            className={`px-4 py-2 rounded-t-lg flex items-center space-x-2 transition-colors ${activeTab === 'partners' ? 'bg-white/10 text-white font-medium' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
        >
            <Briefcase className="w-4 h-4" />
            <span>Colaboradores</span>
        </button>
        <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2 rounded-t-lg flex items-center space-x-2 transition-colors ${activeTab === 'timeline' ? 'bg-white/10 text-white font-medium' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
        >
            <Clock className="w-4 h-4" />
            <span>Cronología</span>
        </button>
        <button
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2 rounded-t-lg flex items-center space-x-2 transition-colors ${activeTab === 'team' ? 'bg-white/10 text-white font-medium' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
        >
            <Users className="w-4 h-4" />
            <span>Equipo</span>
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        {activeTab === 'partners' && <PartnersManager />}
        {activeTab === 'timeline' && <TimelineManager />}
        {activeTab === 'team' && <TeamManager />}
      </div>
    </div>
  );
};
