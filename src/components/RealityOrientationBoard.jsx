import React, { useState, useEffect } from 'react';

export default function RealityOrientationBoard({ patientName, weather, caregiver }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getTimeOfDay = (date) => {
    const hours = date.getHours();
    if (hours < 12) return { text: 'morning', icon: '☀️' };
    if (hours < 17) return { text: 'afternoon', icon: '🌤️' };
    return { text: 'evening', icon: '🌙' };
  };

  const timePeriod = getTimeOfDay(time);

  return (
    <div className="patient-panel reality-board">
      <div className="reality-subcard-title" style={{ marginBottom: '0.5rem', color: 'var(--accent-purple)', fontWeight: '800' }}>
        Reality Orientation Board
      </div>
      
      <div className="reality-time" aria-label={`Current time is ${formatTime(time)}`}>
        {formatTime(time)}
      </div>

      <div className="reality-greeting">
        {timePeriod.icon} Good {timePeriod.text}, {patientName}!
      </div>

      <div className="reality-message">
        Today is <strong>{formatDate(time)}</strong>. 
        It is a lovely <strong>{timePeriod.text}</strong>. You are safe, comfortable, and cared for at home.
      </div>

      <div className="reality-cards">
        <div className="reality-subcard">
          <span className="reality-subcard-title">Weather Today</span>
          <span style={{ fontSize: '2rem' }}>{weather.icon}</span>
          <span className="reality-subcard-value">{weather.temp}°C - {weather.desc}</span>
        </div>

        <div className="reality-subcard">
          <span className="reality-subcard-title">Caring For You</span>
          {caregiver.avatarUrl ? (
            <img 
              src={caregiver.avatarUrl} 
              alt={caregiver.name} 
              className="reality-avatar" 
            />
          ) : (
            <div className="reality-avatar" style={{ display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', background: 'var(--accent-teal-soft)', color: 'var(--accent-teal)', fontSize: '1.25rem', fontWeight: 'bold' }}>
              {caregiver.name.charAt(0)}
            </div>
          )}
          <span className="reality-subcard-value">{caregiver.name}</span>
        </div>
      </div>
    </div>
  );
}
