import React, { useState, useEffect } from 'react';
import PatientPortal from './components/PatientPortal';
import CaregiverPortal from './components/CaregiverPortal';

const DEFAULT_ROUTINES = [
  { id: '1', name: 'Morning Heart Medication', time: '08:30', type: 'medication', completed: false },
  { id: '2', name: 'Healthy Oatmeal Breakfast', time: '09:00', type: 'meal', completed: true },
  { id: '3', name: 'Brush Teeth & Wash Face', time: '10:30', type: 'hygiene', completed: false },
  { id: '4', name: 'Gentle Stroll in Backyard Garden', time: '11:00', type: 'exercise', completed: false },
  { id: '5', name: 'Lunch & Fresh Water', time: '13:00', type: 'meal', completed: false }
];

const DEFAULT_MEMORIES = [
  { 
    id: 'm1', 
    title: 'Family Seaside Vacation in Maine', 
    year: '2018', 
    relation: 'Family Trip', 
    description: 'You, Sarah, and little grandson David sitting on the wooden dock watching the lighthouse sunset. We enjoyed fresh lobster rolls and the ocean breeze.', 
    photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60' 
  },
  { 
    id: 'm2', 
    title: 'Apple Pie Baking Sunday', 
    year: '2021', 
    relation: 'Daughter Sarah', 
    description: 'Sarah teaching you her secret butter-crust recipe. The entire home smelled of warm cinnamon, brown sugar, and sweet baked apples.', 
    photoUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=800&auto=format&fit=crop&q=60' 
  },
  { 
    id: 'm3', 
    title: 'David graduating High School', 
    year: '2023', 
    relation: 'Grandson David', 
    description: 'David holding his blue cap and diploma proudly next to you. You gave him a giant hug and told him how incredibly proud you were.', 
    photoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60' 
  }
];

const DEFAULT_BEHAVIOR_LOGS = [
  { id: 'l1', date: '5/26/2026', mood: 'Happy', sleepHours: 8, fluidIntake: 8, notes: 'Very pleasant morning, sang along to old songs. Adored memory slideshow.' },
  { id: 'l2', date: '5/27/2026', mood: 'Calm', sleepHours: 7, fluidIntake: 6, notes: 'Calm and cooperative. Successfully followed all routine medicine checks.' },
  { id: 'l3', date: '5/28/2026', mood: 'Confused', sleepHours: 6, fluidIntake: 5, notes: 'Mild confusion in the evening (sundowning). High contrast orientation board helped ground him.' },
  { id: 'l4', date: '5/29/2026', mood: 'Anxious', sleepHours: 5, fluidIntake: 7, notes: 'Restless in the morning. Played Nature Match card game which quickly reduced anxiety.' },
  { id: 'l5', date: '5/30/2026', mood: 'Happy', sleepHours: 8, fluidIntake: 8, notes: 'Highly rested, woke up laughing. Walked 30 mins in the garden.' }
];

export default function App() {
  const [role, setRole] = useState('patient'); // 'patient' or 'caregiver'
  const [theme, setTheme] = useState('light'); // 'light', 'dark', 'accessible'
  
  // Shared database state
  const [sharedState, setSharedState] = useState({
    patientName: 'John',
    weather: { temp: 22, desc: 'Mild & Sunny morning skies', icon: '☀️' },
    caregiver: { name: 'Emily (RN)', avatarUrl: '' },
    routines: DEFAULT_ROUTINES,
    memories: DEFAULT_MEMORIES,
    behaviorLogs: DEFAULT_BEHAVIOR_LOGS
  });

  // Global Alarm states
  const [helpAlarmActive, setHelpAlarmActive] = useState(false);

  // Sync theme changes with DOM HTML element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Sync routine completion toggle
  const handleToggleRoutine = (id) => {
    setSharedState((prev) => ({
      ...prev,
      routines: prev.routines.map((item) => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  // Add routine scheduler form trigger
  const handleAddRoutine = (newRoutine) => {
    setSharedState((prev) => ({
      ...prev,
      routines: [...prev.routines, newRoutine]
    }));
  };

  // Delete routine card
  const handleDeleteRoutine = (id) => {
    setSharedState((prev) => ({
      ...prev,
      routines: prev.routines.filter((item) => item.id !== id)
    }));
  };

  // Add behavioral diary log
  const handleLogBehavior = (newLog) => {
    setSharedState((prev) => ({
      ...prev,
      behaviorLogs: [newLog, ...prev.behaviorLogs]
    }));
  };

  // Add scrapbook memory slide
  const handleAddMemory = (newMemory) => {
    setSharedState((prev) => ({
      ...prev,
      memories: [...prev.memories, newMemory]
    }));
  };

  // Save configurations in Settings
  const handleUpdateSettings = (updates) => {
    setSharedState((prev) => ({
      ...prev,
      ...updates
    }));
  };

  // Trigger Panic/Help Overlay
  const handleTriggerHelpAlarm = (isActive) => {
    setHelpAlarmActive(isActive);
  };

  const handleDismissHelpAlarm = () => {
    setHelpAlarmActive(false);
  };

  return (
    <div className="app-container">
      {/* Red Alert Siren shown only to caregiver if patient requests emergency help */}
      {helpAlarmActive && role === 'caregiver' && (
        <div className="siren-notification-banner" role="alert">
          <div className="siren-content">
            <span className="siren-icon">🚨</span>
            <span>EMERGENCY ALARM: Patient John is requesting HELP!</span>
          </div>
          <button className="siren-dismiss-btn" onClick={handleDismissHelpAlarm}>
            Acknowledge & Mute Alarm
          </button>
        </div>
      )}

      <header className="main-header">
        <div className="logo-section">
          <div className="logo-icon">M</div>
          <h1 className="logo-text">Mind Bridge</h1>
        </div>

        <div className="header-controls">
          {/* Visual Accessibility Theme Switcher */}
          <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: '8px' }}>
            <button 
              className={`switch-btn ${theme === 'light' ? 'active' : ''}`} 
              onClick={() => setTheme('light')}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
            >
              ☀️ Light
            </button>
            <button 
              className={`switch-btn ${theme === 'dark' ? 'active' : ''}`} 
              onClick={() => setTheme('dark')}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
            >
              🌙 Dark
            </button>
            <button 
              className={`switch-btn ${theme === 'accessible' ? 'active' : ''}`} 
              onClick={() => setTheme('accessible')}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', border: '1px solid var(--text-primary)' }}
              title="Enhance size and contrast for elderly readability"
            >
              ♿ High Contrast
            </button>
          </div>

          {/* Quick toggle to jump between Role Portals */}
          <div style={{ display: 'flex', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem', gap: '0.5rem' }}>
            <button 
              className={`switch-btn ${role === 'patient' ? 'active' : ''}`} 
              onClick={() => setRole('patient')}
            >
              👶 Patient Portal
            </button>
            <button 
              className={`switch-btn ${role === 'caregiver' ? 'active' : ''}`} 
              onClick={() => setRole('caregiver')}
            >
              👩‍⚕️ Caregiver Portal
            </button>
          </div>
        </div>
      </header>

      <main className="portal-content">
        {role === 'patient' ? (
          <PatientPortal 
            sharedState={sharedState}
            onToggleRoutine={handleToggleRoutine}
            onTriggerHelp={handleTriggerHelpAlarm}
          />
        ) : (
          <CaregiverPortal 
            sharedState={sharedState}
            onAddRoutine={handleAddRoutine}
            onDeleteRoutine={handleDeleteRoutine}
            onLogBehavior={handleLogBehavior}
            onAddMemory={handleAddMemory}
            onUpdateSettings={handleUpdateSettings}
          />
        )}
      </main>

      <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', padding: '1rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        © 2026 Mind Bridge. Supporting caregivers and empowering patients with security and dignity.
      </footer>
    </div>
  );
}
