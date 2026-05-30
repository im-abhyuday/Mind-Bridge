import React, { useState, useEffect } from 'react';

export default function HelpInterface({ onTriggerHelp, caregiver }) {
  const [isOpen, setIsOpen] = useState(false);
  const [breathPhase, setBreathPhase] = useState('In');

  // Calming breathing exercise timer inside the help modal
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setBreathPhase((prev) => (prev === 'In' ? 'Hold' : prev === 'Hold' ? 'Out' : 'In'));
    }, 3000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleHelpClick = () => {
    setIsOpen(true);
    onTriggerHelp(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    onTriggerHelp(false);
  };

  return (
    <div className="patient-panel help-section">
      <h3 className="patient-panel-title" style={{ justifyContent: 'center', border: 'none', padding: 0 }}>
        Need Assistance?
      </h3>
      <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.15rem' }}>
        Press the button below. Your caregiver will be notified immediately.
      </p>

      <button 
        className="help-button" 
        onClick={handleHelpClick}
        aria-label="Request help"
      >
        <span style={{ fontSize: '3rem' }}>🔔</span>
        <span>HELP</span>
        <span className="help-button-label">Press Here</span>
      </button>

      {isOpen && (
        <div className="help-overlay">
          <div className="help-overlay-card">
            <span className="helper-comfort-icon" role="img" aria-label="Calm heart">❤️</span>
            <h2 className="help-overlay-title">Help is on the Way!</h2>
            
            <p className="help-overlay-desc">
              Don't worry, <strong>{caregiver.name}</strong> has been notified and is coming to see you right now. 
              Everything is okay.
            </p>

            <div className="reassurance-loop">
              {caregiver.avatarUrl ? (
                <img 
                  src={caregiver.avatarUrl} 
                  alt={caregiver.name} 
                  className="reassurance-avatar" 
                  style={{ animation: 'none' }}
                />
              ) : (
                <div style={{ fontSize: '3rem' }}>👩‍⚕️</div>
              )}
            </div>

            {/* Breathing stabilization guide to calm immediate panic */}
            <div style={{ margin: '1.5rem 0', width: '100%' }}>
              <div 
                style={{ 
                  width: '120px', 
                  height: '120px', 
                  borderRadius: '50%', 
                  background: breathPhase === 'In' ? 'var(--accent-teal-soft)' : breathPhase === 'Hold' ? 'var(--accent-amber-soft)' : 'var(--accent-purple-soft)', 
                  border: '4px solid',
                  borderColor: breathPhase === 'In' ? 'var(--accent-teal)' : breathPhase === 'Hold' ? 'var(--accent-amber)' : 'var(--accent-purple)',
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto',
                  transition: 'all 2.8s ease-in-out',
                  transform: breathPhase === 'In' ? 'scale(1.15)' : breathPhase === 'Hold' ? 'scale(1.15)' : 'scale(0.85)',
                }}
              >
                <strong style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{breathPhase}</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Breathe</span>
              </div>
              <p style={{ marginTop: '0.75rem', fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Let's breathe together slowly.
              </p>
            </div>

            <button className="close-help-btn" onClick={handleClose}>
              I feel better now, close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
