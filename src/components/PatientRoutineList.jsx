import React from 'react';

export default function PatientRoutineList({ routines, onToggleRoutine }) {
  
  // Custom synthesizer chime using browser's Web Audio API (zero external asset dependencies!)
  const playChime = (isCompleted) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      if (isCompleted) {
        // Success Chime - high and cheerful (C5 -> E5 -> G5)
        const notes = [523.25, 659.25, 783.99];
        notes.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.12);
          
          gain.gain.setValueAtTime(0.15, ctx.currentTime + index * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.12 + 0.3);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start(ctx.currentTime + index * 0.12);
          osc.stop(ctx.currentTime + index * 0.12 + 0.35);
        });
      } else {
        // Soft click chime
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(330, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch (e) {
      console.warn("AudioContext block by browser auto-play policy or not supported", e);
    }
  };

  const handleCardClick = (routine) => {
    const nextStatus = !routine.completed;
    onToggleRoutine(routine.id);
    playChime(nextStatus);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'medication': return '💊';
      case 'meal': return '🍎';
      case 'hygiene': return '🪥';
      case 'exercise': return '🚶';
      default: return '📅';
    }
  };

  return (
    <div className="patient-panel">
      <h2 className="patient-panel-title">
        <span>📋</span> Today's Plan
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
        Tap each activity when you have completed it.
      </p>

      <div className="patient-med-list">
        {routines.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>
            <span style={{ fontSize: '3rem' }}>🎉</span>
            <p style={{ marginTop: '0.5rem', fontWeight: 600 }}>All tasks completed for today!</p>
          </div>
        ) : (
          routines.map((routine) => (
            <div 
              key={routine.id}
              className={`patient-med-card ${routine.completed ? 'completed' : ''}`}
              onClick={() => handleCardClick(routine)}
              role="button"
              aria-pressed={routine.completed}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(routine);
                }
              }}
            >
              <div className="med-card-left">
                <div className="med-icon-box">
                  {routine.completed ? '✅' : getIcon(routine.type)}
                </div>
                <div className="med-info">
                  <span className="med-name">{routine.name}</span>
                  <span className="med-time">⏰ {routine.time}</span>
                </div>
              </div>

              <div className="checkbox-visual">
                ✓
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
