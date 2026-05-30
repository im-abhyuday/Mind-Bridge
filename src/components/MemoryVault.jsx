import React, { useState, useEffect, useRef } from 'react';

export default function MemoryVault({ memories }) {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const slideTimer = useRef(null);

  // Auto play slideshow logic
  useEffect(() => {
    if (isPlaying) {
      slideTimer.current = setInterval(() => {
        handleNext();
      }, 5000);
    } else {
      if (slideTimer.current) clearInterval(slideTimer.current);
    }
    return () => {
      if (slideTimer.current) clearInterval(slideTimer.current);
    };
  }, [isPlaying, index, memories.length]);

  // Cancel any playing speech on unmount or slide change
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [index]);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % memories.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + memories.length) % memories.length);
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Text-To-Speech audio support
  const handleReadAloud = () => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const currentMem = memories[index];
    const speechText = `This is a memory from ${currentMem.year}. ${currentMem.title}. ${currentMem.description}`;
    
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (memories.length === 0) {
    return (
      <div className="patient-panel" style={{ minHeight: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-tertiary)' }}>No memories added to the vault yet.</p>
      </div>
    );
  }

  const currentMem = memories[index];

  return (
    <div className="patient-panel">
      <h2 className="patient-panel-title">
        <span>💝</span> Memory Scrapbook
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', fontSize: '1.1rem' }}>
        Cherish special moments. Use the buttons below to look through your photos.
      </p>

      <div className="memory-vault-player">
        <img 
          src={currentMem.photoUrl} 
          alt={currentMem.title} 
          className="memory-slide-img"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop&q=60"; // generic beautiful landscape fallback
          }}
        />

        <div className="memory-slide-meta">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="memory-slide-relation">{currentMem.relation}</span>
            <span style={{ fontWeight: 800, color: 'var(--accent-purple)', fontSize: '1.1rem' }}>Year {currentMem.year}</span>
          </div>
          <h3 className="memory-slide-title">{currentMem.title}</h3>
          <p className="memory-slide-desc">{currentMem.description}</p>
        </div>

        <div className="memory-slide-controls">
          <button className="vault-btn" onClick={handlePrev} aria-label="Previous memory">
            ◀ Back
          </button>
          
          <button 
            className={`vault-btn ${isSpeaking ? 'play-auto-btn' : ''}`} 
            onClick={handleReadAloud} 
            aria-label="Read description aloud"
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            {isSpeaking ? '🔊 Speaking...' : '🗣️ Read Aloud'}
          </button>

          <button 
            className={`vault-btn ${isPlaying ? 'play-auto-btn' : ''}`} 
            onClick={handleTogglePlay}
            aria-label={isPlaying ? "Stop auto slideshow" : "Start auto slideshow"}
          >
            {isPlaying ? '⏸ Stop' : '▶ Auto Slide'}
          </button>
          
          <button className="vault-btn" onClick={handleNext} aria-label="Next memory">
            Next ▶
          </button>
        </div>
      </div>
    </div>
  );
}
