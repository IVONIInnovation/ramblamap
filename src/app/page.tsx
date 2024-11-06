import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

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
      const waviness = Math.random() > 0.7 ? 0.15 + Math.random() * 0.1 : 0;
      
      groups.push([
        {
          id: id++,
          type: 'couple',
          gender: 'M',
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
          gender: 'F',
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
      const waviness = Math.random() > 0.6 ? 0.2 + Math.random() * 0.15 : 0;
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
  const [stats, setStats] = useState({});
  const [demographics, setDemographics] = useState({});

  useEffect(() => {
    const newStats = {
      singles: people.filter(p => p.type === 'single').length,
      couples: people.filter(p => p.type === 'couple').length / 2,
      families: people.filter(p => p.type === 'family' && p.role === 'parent').length / 2
    };
    
    const newDemographics = {
      singles: {
        total: people.filter(p => p.type === 'single').length,
        male: people.filter(p => p.type === 'single' && p.gender === 'M').length,
        female: people.filter(p => p.type === 'single' && p.gender === 'F').length
      },
      couples: {
        total: people.filter(p => p.type === 'couple').length / 2,
        pairs: people.filter(p => p.type === 'couple').length / 2
      },
      families: {
        total: people.filter(p => p.type === 'family' && p.role === 'parent').length / 2,
        parents: {
          total: people.filter(p => p.type === 'family' && p.role === 'parent').length,
          male: people.filter(p => p.type === 'family' && p.role === 'parent' && p.gender === 'M').length,
          female: people.filter(p => p.type === 'family' && p.role === 'parent' && p.gender === 'F').length
        },
        children: {
          total: people.filter(p => p.type === 'family' && p.role === 'child').length,
          boys: people.filter(p => p.type === 'family' && p.role === 'child' && p.gender === 'M').length,
          girls: people.filter(p => p.type === 'family' && p.role === 'child' && p.gender === 'F').length
        }
      }
    };

    setStats(newStats);
    setDemographics(newDemographics);
  }, [people]);

  // To be continued in Part 2...

  return null;
};

export default PeopleMovement;
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const PeopleMovement = () => {
  // Movement update logic
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

  const getPosition = (progress, lane) => {
    const x = 50 + (progress / 100) * 500;
    const y = 150 + (lane * 30);
    return { x, y };
  };

  const getPersonColor = (person) => {
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
    <Card className="p-6 w-full max-w-4xl">
      <div className="flex justify-between items-start mb-4">
        <div className="font-sans text-xl font-bold">La Rambla People Movement</div>
        <img 
          src="/api/placeholder/120/40"
          alt="Elisava Logo"
          className="h-10 object-contain"
        />
      </div>
      
      <Tabs defaultValue="overview" className="mb-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="singles">Singles ({stats.singles})</TabsTrigger>
          <TabsTrigger value="couples">Couples ({stats.couples})</TabsTrigger>
          <TabsTrigger value="families">Families ({stats.families})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="grid grid-cols-3 gap-2">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="bg-gray-50 p-2 rounded text-center">
              <div className="text-xs text-gray-600 capitalize">{key}</div>
              <div className="text-sm font-bold">{value}</div>
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="singles" className="grid grid-cols-3 gap-2">
          <div className="bg-gray-50 p-2 rounded text-center">
            <div className="text-xs text-gray-600">Total</div>
            <div className="text-sm font-bold">{demographics.singles?.total}</div>
          </div>
          <div className="bg-gray-50 p-2 rounded text-center">
            <div className="text-xs text-gray-600">Men</div>
            <div className="text-sm font-bold">{demographics.singles?.male}</div>
          </div>
          <div className="bg-gray-50 p-2 rounded text-center">
            <div className="text-xs text-gray-600">Women</div>
            <div className="text-sm font-bold">{demographics.singles?.female}</div>
          </div>
        </TabsContent>
        
        <TabsContent value="couples" className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 p-2 rounded text-center">
            <div className="text-xs text-gray-600">Total Couples</div>
            <div className="text-sm font-bold">{demographics.couples?.total}</div>
          </div>
          <div className="bg-gray-50 p-2 rounded text-center">
            <div className="text-xs text-gray-600">Male/Female Pairs</div>
            <div className="text-sm font-bold">{demographics.couples?.pairs}</div>
          </div>
        </TabsContent>
        
        <TabsContent value="families" className="grid grid-cols-3 gap-2">
          <div className="bg-gray-50 p-2 rounded text-center">
            <div className="text-xs text-gray-600">Total Families</div>
            <div className="text-sm font-bold">{demographics.families?.total}</div>
          </div>
          <div className="bg-gray-50 p-2 rounded text-center col-span-2">
            <div className="text-xs text-gray-600">Parents</div>
            <div className="text-sm">
              {demographics.families?.parents.male} fathers, {demographics.families?.parents.female} mothers
            </div>
          </div>
          <div className="bg-gray-50 p-2 rounded text-center col-span-3">
            <div className="text-xs text-gray-600">Children</div>
            <div className="text-sm">
              {demographics.families?.children.total} total 
              ({demographics.families?.children.boys} boys, {demographics.families?.children.girls} girls)
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Continued in Part 3... */}
    </Card>
  );
};

export default PeopleMovement;
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const PeopleMovement = () => {
  // ... Previous state and effects code goes here ...

  return (
    <Card className="p-6 w-full max-w-4xl">
      {/* Previous header and tabs code goes here */}
      
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

        <g transform="translate(250, 65)">
          <rect x="-25" y="-15" width="50" height="30" fill="#8B4513" rx="2"/>
          <text x="0" y="5" textAnchor="middle" fill="white" className="text-xs">Liceu</text>
        </g>

        <g transform="translate(150, 150)">
          <circle cx="0" cy="0" r="8" fill="#4682B4" opacity="0.8"/>
          <circle cx="0" cy="0" r="4" fill="#87CEEB"/>
          <path
            d="M -8,-8 L 8,8 M -8,8 L 8,-8"
            stroke="#87CEEB"
            strokeWidth="1"
            opacity="0.6"
          />
        </g>

        {[200, 300, 400].map((x) => (
          <g key={`kiosk-${x}`} transform={`translate(${x}, 150)`}>
            <rect x="-6" y="-6" width="12" height="12" fill="#4A5568" rx="1"/>
            <rect x="-5" y="-7" width="10" height="3" fill="#2D3748" rx="1"/>
          </g>
        ))}

        <g transform="translate(480, 150)">
          <rect x="-15" y="-15" width="30" height="30" fill="#dc2626" rx="5"/>
          <text x="0" y="7" textAnchor="middle" fill="white" className="text-lg font-bold">M</text>
          <text x="0" y="35" textAnchor="middle" fill="#666" className="text-xs">Pl. Catalunya</text>
        </g>

        {Array.from({ length: 20 }).map((_, i) => (
          <React.Fragment key={`trees-${i}`}>
            <circle 
              cx={75 + i * 25} 
              cy={70} 
              r={3 + Math.random()} 
              fill={`rgb(45, ${147 + Math.random() * 20}, 68)`}
            />
            <circle 
              cx={75 + i * 25} 
              cy={230} 
              r={3 + Math.random()} 
              fill={`rgb(45, ${147 + Math.random() * 20}, 68)`}
            />
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
            Single (M)
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-pink-400 mr-1"></div>
            Single (F)
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-purple-600 mr-1"></div>
            Couple
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-indigo-500 mr-1"></div>
            Parent
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
            Boy
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
            Girl
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PeopleMovement;
