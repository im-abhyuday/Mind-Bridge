import React from 'react';
import RealityOrientationBoard from './RealityOrientationBoard';
import HelpInterface from './HelpInterface';
import PatientRoutineList from './PatientRoutineList';
import MemoryVault from './MemoryVault';
import CognitiveGames from './CognitiveGames';

export default function PatientPortal({ 
  sharedState, 
  onToggleRoutine, 
  onTriggerHelp 
}) {
  const { patientName, weather, caregiver, routines, memories } = sharedState;

  return (
    <div className="patient-portal">
      {/* Top Banner introducing a simple breathing advice for patients */}
      <div 
        className="patient-panel" 
        style={{ 
          background: 'linear-gradient(135deg, var(--accent-purple-soft), var(--bg-secondary))', 
          borderWidth: '2px',
          borderColor: 'var(--accent-purple)',
          marginBottom: '2rem', 
          padding: '1.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--accent-purple)', marginBottom: '0.25rem' }}>
            Welcome to Your Mind Bridge, {patientName}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', fontWeight: 500 }}>
            Today is a good day. Explore your scrapbook or challenge your mind with a game!
          </p>
        </div>
        <div style={{ fontSize: '2.5rem' }}>🌸</div>
      </div>

      <div className="patient-dashboard">
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <RealityOrientationBoard 
            patientName={patientName}
            weather={weather}
            caregiver={caregiver}
          />
          
          <PatientRoutineList 
            routines={routines}
            onToggleRoutine={onToggleRoutine}
          />
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <HelpInterface 
            onTriggerHelp={onTriggerHelp}
            caregiver={caregiver}
          />

          <MemoryVault 
            memories={memories}
          />
        </div>
      </div>

      {/* Cognitive games span full bottom region for immersive play */}
      <div style={{ marginTop: '2rem' }}>
        <CognitiveGames />
      </div>
    </div>
  );
}
