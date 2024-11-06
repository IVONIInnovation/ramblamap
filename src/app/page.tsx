'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

type PersonType = {
  id: number;
  type: 'single' | 'couple' | 'family';
  gender?: 'M' | 'F';
  role?: 'parent' | 'child';
  baseSpeed: number;
  direction: number;
  startProgress: number;
  baseLane: number;
  waviness: number;
  waveOffset: number;
  progress: number;
  lane: number;
  pathHistory: Array<{ x: number; y: number }>;
  futureSteps: any[];
};

type DetailedStats = {
  singles: {
    total: number;
    male: number;
    female: number;
  };
  couples: {
    total: number;
    count: number;
  };
  families: {
    total: number;
    count: number;
    parents: number;
    children: {
      total: number;
      boys: number;
      girls: number;
    };
  };
};

const StatsPanel = ({ 
  label, 
  value, 
  detailedStats, 
  isOpen, 
  onClick 
}: { 
  label: string;
  value: number;
  detailedStats: any;
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="relative">
      <div 
        className={`bg-gray-50 p-2 rounded text-center cursor-pointer transition-colors ${isOpen ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
        onClick={onClick}
      >
        <div className="text-xs text-gray-600 capitalize">{label}</div>
        <div className="text-sm font-bold">{value}</div>
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
          {label === 'singles' && (
            <div className="space-y-1">
              <div className="text-xs text-gray-500">Total Singles: {detailedStats.total}</div>
              <div className="flex justify-between text-xs">
                <span className="text-blue-600">Males: {detailedStats.male}</span>
                <span className="text-pink-400">Females: {detailedStats.female}</span>
              </div>
              <div className="text-xs text-gray-500">
                Ratio: {((detailedStats.male / detailedStats.total) * 100).toFixed(1)}% M / {((detailedStats.female / detailedStats.total) * 100).toFixed(1)}% F
              </div>
            </div>
          )}
          
          {label === 'couples' && (
            <div className="space-y-1">
              <div className="text-xs text-gray-500">Total Couples: {detailedStats.count}</div>
              <div className="text-xs text-gray-500">Total People: {detailedStats.total}</div>
            </div>
          )}
          
          {label === 'families' && (
            <div className="space-y-1">
              <div className="text-xs text-gray-500">Total Families: {detailedStats.count}</div>
              <div className="text-xs text-gray-500">Parents: {detailedStats.parents}</div>
              <div className="text-xs text-gray-500 mt-1">Children: {detailedStats.children.total}</div>
              <div className="flex justify-between text-xs">
                <span className="text-green-500">Boys: {detailedStats.children.boys}</span>
                <span className="text-yellow-500">Girls: {detailedStats.children.girls}</span>
              </div>
              <div className="text-xs text-gray-500">
                Children Ratio: {((detailedStats.children.boys / detailedStats.children.total) * 100).toFixed(1)}% B / {((detailedStats.children.girls / detailedStats.children.total) * 100).toFixed(1)}% G
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const PeopleMovement = () => {
  const generateGroups = () => {
    const groups = [];
    let id = 0;
    
    // Generate couples (55%)
    for (let i = 0; i < 20; i++) {
      const baseSpeed = 0.04 + Math.random() * 0.01;
      const direction = Math.random() > 0.5 ? 1 : -1;
      const startProgress = Math.random() * 100;
      const baseLane = Math.random() > 0.5 ? 0.5 : -0.5;
      const waviness = Math.random() > 0.7 ? 0.15 + Math.random() * 0.1 : 0; // Some couples meander
      
      groups.push([
        {
          id: id++,
          type: 'couple',
          baseSpeed,
          direction,
          startProgress,
          baseLane: baseLane - 0.1,
          waviness,
          waveOffset: Math.random() * Math.PI * 2
        },
        {
          id: id++,
          type: 'couple',
          baseSpeed,
          direction,
          startProgress,
          baseLane: baseLane + 0.1,
          waviness,
          waveOffset: Math.random() * Math.PI * 2
        }
      ]);
    }
    
    // Generate singles (25%)
    for (let i = 0; i < 15; i++) {
      const waviness = Math.random() > 0.6 ? 0.2 + Math.random() * 0.15 : 0; // Singles meander more
      groups.push([{
        id: id++,
        type: 'single',
        gender: Math.random() > 0.35 ? 'M' : 'F',
        baseSpeed: 0.04 + Math.random() * 0.01,
        direction: Math.random() > 0.5 ? 1 : -1,
        startProgress: Math.random() * 100,
        baseLane: (Math.random() > 0.5 ? 1 : -1) * (0.3 + Math.random() * 0.4),
        waviness,
        waveOffset: Math.random() * Math.PI * 2
      }]);
    }
    
    // Generate families (20%)
    for (let i = 0; i < 8; i++) {
      const baseSpeed = 0.035 + Math.random() * 0.01;
      const direction = Math.random() > 0.5 ? 1 : -1;
      const startProgress = Math.random() * 100;
      const baseLane = (Math.random() > 0.5 ? 1 : -1) * 0.5;
      const waviness = Math.random() > 0.8 ? 0.1 + Math.random() * 0.05 : 0;
      const waveOffset = Math.random() * Math.PI * 2;
      
      
      const familyGroup = [
        // Parents - one male, one female
        {
          id: id++,
          type: 'family',
          role: 'parent',
          gender: 'M',
          baseSpeed,
          direction,
          startProgress,
          baseLane: baseLane - 0.15,
          waviness,
          waveOffset
        },
        {
          id: id++,
          type: 'family',
          role: 'parent',
          gender: 'F',
          baseSpeed,
          direction,
          startProgress,
          baseLane: baseLane + 0.15,
          waviness,
          waveOffset
        }
      ];
      
      // Add 1-2 children
      const childCount = Math.random() > 0.5 ? 2 : 1;
      for (let c = 0; c < childCount; c++) {
        familyGroup.push({
          id: id++,
          type: 'family',
          role: 'child',
          gender: Math.random() > 0.5 ? 'M' : 'F',
          baseSpeed,
          direction,
          startProgress,
          baseLane: baseLane + (c === 0 ? -0.05 : 0.05),
          waviness,
          waveOffset
        });
      }
      
      groups.push(familyGroup);
    }
    
    return groups.flat();
  };

  const [people, setPeople] = useState(() => 
    generateGroups().map(person => ({
      ...person,
      progress: person.startProgress,
      lane: person.baseLane,
      pathHistory: [],
      futureSteps: []
    }))
  );
  
  const [hoveredPerson, setHoveredPerson] = useState(null);
  const [stats, setStats] = useState({
    singles: 0,
    couples: 0,
    families: 0
  });

  
const [detailedStats, setDetailedStats] = useState<DetailedStats>({
  singles: { total: 0, male: 0, female: 0 },
  couples: { total: 0, count: 0 },
  families: { total: 0, count: 0, parents: 0, children: { total: 0, boys: 0, girls: 0 } }
});
const [openStatPanel, setOpenStatPanel] = useState<string | null>(null);


  useEffect(() => {
  const newDetailedStats = {
    singles: {
      total: people.filter(p => p.type === 'single').length,
      male: people.filter(p => p.type === 'single' && p.gender === 'M').length,
      female: people.filter(p => p.type === 'single' && p.gender === 'F').length
    },
    couples: {
      total: people.filter(p => p.type === 'couple').length,
      count: people.filter(p => p.type === 'couple').length / 2
    },
    families: {
      total: people.filter(p => p.type === 'family').length,
      count: people.filter(p => p.type === 'family' && p.role === 'parent').length / 2,
      parents: people.filter(p => p.type === 'family' && p.role === 'parent').length,
      children: {
        total: people.filter(p => p.type === 'family' && p.role === 'child').length,
        boys: people.filter(p => p.type === 'family' && p.role === 'child' && p.gender === 'M').length,
        girls: people.filter(p => p.type === 'family' && p.role === 'child' && p.gender === 'F').length
      }
    }
  };
  
  setDetailedStats(newDetailedStats);
  setStats({
    singles: newDetailedStats.singles.total,
    couples: newDetailedStats.couples.count,
    families: newDetailedStats.families.count
  });
}, [people]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPeople(currentPeople =>
        currentPeople.map(person => {
          let newProgress = person.progress + (person.baseSpeed * person.direction);
          
          let newLane = person.baseLane;
          if (person.waviness) {
            newLane += Math.sin((newProgress / 10) + person.waveOffset) * person.waviness;
          }
          
          if (newProgress > 70 && newProgress < 85) {
            const baseStream = person.baseLane > 0 ? 0.8 : -0.8;
            newLane = baseStream + (person.waviness ? Math.sin((newProgress / 10) + person.waveOffset) * (person.waviness * 0.5) : 0);
          }
          
          if (newProgress > 85 && newProgress < 95) {
            const returnFactor = (95 - newProgress) / 10;
            newLane = (person.baseLane * returnFactor + newLane * (1 - returnFactor));
          }
          
          if (newProgress > 100) newProgress = 0;
          if (newProgress < 0) newProgress = 100;
          
          const pos = getPosition(newProgress, newLane);
          const newHistory = [...person.pathHistory, { x: pos.x, y: pos.y }].slice(-20);
          
          return {
            ...person,
            progress: newProgress,
            lane: newLane,
            pathHistory: newHistory
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const getPosition = (progress: number, lane: number) => {
    const x = 50 + (progress / 100) * 500;
    const y = 150 + (lane * 30);
    return { x, y };
  };

  const getPersonColor = (person: any) => {
    switch (person.type) {
      case 'single':
        return person.gender === 'M' ? '#4169e1' : '#ff69b4';
      case 'couple':
        return '#9333ea';
      case 'family':
        if (person.role === 'parent') return '#6366f1';
        return person.gender === 'M' ? '#22c55e' : '#eab308';
      default:
        return '#666666';
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6">
      <Card className="p-6 w-full max-w-4xl">
        <div className="flex justify-between items-start mb-4">
          <div className="font-sans text-xl font-bold">La Rambla: Movimiento de personas</div>
          <img 
            src="https://www.elisava.net/wp-content/themes/elisava/images/logo.svg"
            alt="Elisava Logo"
            className="h-6.5 object-contain"
          />
        </div>
        
        <div className="mb-4 grid grid-cols-3 gap-2">
            <StatsPanel
              label="singles"
              value={stats.singles}
              detailedStats={detailedStats.singles}
              isOpen={openStatPanel === 'singles'}
              onClick={() => setOpenStatPanel(openStatPanel === 'singles' ? null : 'singles')}
            />
            <StatsPanel
              label="couples"
              value={stats.couples}
              detailedStats={detailedStats.couples}
              isOpen={openStatPanel === 'couples'}
              onClick={() => setOpenStatPanel(openStatPanel === 'couples' ? null : 'couples')}
            />
            <StatsPanel
              label="families"
              value={stats.families}
              detailedStats={detailedStats.families}
              isOpen={openStatPanel === 'families'}
              onClick={() => setOpenStatPanel(openStatPanel === 'families' ? null : 'families')}
            />
          </div>

        <svg className="w-full h-96 bg-slate-50" viewBox="0 0 600 300">
          <rect x="50" y="80" width="500" height="20" fill="#666"/>
          <rect x="50" y="200" width="500" height="20" fill="#666"/>
          <rect x="50" y="100" width="500" height="100" fill="#e5e7eb"/>
          <rect x="500" y="50" width="50" height="200" fill="#666"/>
          
          <path
            d="M 50 130 L 450 130 M 510 130 L 550 130"
            stroke="#d1d5db"
            strokeWidth="1"
            strokeDasharray="5,5"
          />
          <path
            d="M 50 170 L 450 170 M 510 170 L 550 170"
            stroke="#d1d5db"
            strokeWidth="1"
            strokeDasharray="5,5"
          />

          <g transform="translate(480, 150)">
            <rect x="-15" y="-15" width="30" height="30" fill="#dc2626" rx="5"/>
            <text x="0" y="7" textAnchor="middle" fill="white" className="text-lg font-bold">M</text>
            <text x="0" y="35" textAnchor="middle" fill="#666" className="text-xs">Pl. Catalunya</text>
          </g>

          {Array.from({ length: 20 }).map((_, i) => (
            <React.Fragment key={`trees-${i}`}>
              <circle cx={75 + i * 25} cy={70} r={4} fill="#2d9344"/>
              <circle cx={75 + i * 25} cy={230} r={4} fill="#2d9344"/>
            </React.Fragment>
          ))}

          {people.map(person => {
            const pos = getPosition(person.progress, person.lane);
            const isHovered = hoveredPerson === person.id;
            const color = getPersonColor(person);
            
            return (
              <g key={person.id}>
                {isHovered && person.pathHistory.map((histPos, i, arr) => {
                  if (i === 0) return null;
                  const prevPos = arr[i - 1];
                  return (
                    <g key={`path-${i}`}>
                      <line
                        x1={prevPos.x}
                        y1={prevPos.y}
                        x2={histPos.x}
                        y2={histPos.y}
                        stroke={color}
                        strokeWidth="2"
                        opacity={i / arr.length * 0.5}
                      />
                      {i === arr.length - 1 && (
                        <polygon
                          points={`${histPos.x},${histPos.y} 
                                  ${histPos.x - person.direction * 8},${histPos.y - 4} 
                                  ${histPos.x - person.direction * 8},${histPos.y + 4}`}
                          fill={color}
                        />
                      )}
                    </g>
                  );
                })}
                
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isHovered ? 6 : (person.role === 'child' ? 3 : 4)}
                  fill={color}
                  opacity={0.8}
                  onMouseEnter={() => setHoveredPerson(person.id)}
                  onMouseLeave={() => setHoveredPerson(null)}
                  className="cursor-pointer transition-all duration-200"
                />
                
                {isHovered && (
                  <g>
                    <rect
                      x={pos.x + 10}
                      y={pos.y - 20}
                      width="60"
                      height="20"
                      fill="white"
                      stroke="#666"
                      rx="4"
                    />
                    <text
                      x={pos.x + 15}
                      y={pos.y - 5}
                      className="text-xs"
                      fill="#333"
                    >
                      {person.type === 'family' ? 
                        `${person.role}` : 
                        person.type}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
        
        <div className="mt-2 text-xs text-gray-600 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-blue-600 mr-1"></div>
              Soltero (H)
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-pink-400 mr-1"></div>
              Soltera (M)
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-purple-600 mr-1"></div>
              Pareja
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-indigo-500 mr-1"></div>
              Padres
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
              Chico
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
              Niña
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
};

export default function Page() {
  return <PeopleMovement />;
}
