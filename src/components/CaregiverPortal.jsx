import React, { useState, useEffect, useRef } from 'react';

export default function CaregiverPortal({ 
  sharedState, 
  onAddRoutine, 
  onDeleteRoutine, 
  onLogBehavior, 
  onAddMemory,
  onUpdateSettings 
}) {
  const [activeTab, setActiveTab] = useState('scheduler'); // 'scheduler', 'wander', 'behavior', 'memories'
  
  // Form states for Routine Scheduler
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newRoutineTime, setNewRoutineTime] = useState('08:00');
  const [newRoutineType, setNewRoutineType] = useState('medication');

  // Form states for Behavior Logger
  const [mood, setMood] = useState('Calm');
  const [sleepHours, setSleepHours] = useState(8);
  const [fluidIntake, setFluidIntake] = useState(6);
  const [behaviorNotes, setBehaviorNotes] = useState('');

  // Form states for Memory Scrapbook Manager
  const [memTitle, setMemTitle] = useState('');
  const [memYear, setMemYear] = useState('2024');
  const [memRelation, setMemRelation] = useState('Family');
  const [memDesc, setMemDesc] = useState('');
  const [memPhotoUrl, setMemPhotoUrl] = useState('');

  // Settings Configuration states
  const [cName, setCName] = useState(sharedState.caregiver.name);
  const [pName, setPName] = useState(sharedState.patientName);
  const [wTemp, setWTemp] = useState(sharedState.weather.temp);
  const [wDesc, setWDesc] = useState(sharedState.weather.desc);
  const [wIcon, setWIcon] = useState(sharedState.weather.icon);

  // Wander Simulation state
  const [geofenceRadius, setGeofenceRadius] = useState(150); // meters
  const [isSimulating, setIsSimulating] = useState(false);
  const [patientCoords, setPatientCoords] = useState({ x: 200, y: 200 }); // canvas coordinates (center = 200, 200)
  const [distance, setDistance] = useState(0); // simulated meters
  const [alertTriggered, setAlertTriggered] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState([
    { time: 'System Initialized', text: 'GPS Geofencing Active. Patient safely within home boundary.' }
  ]);

  const canvasRef = useRef(null);
  const simInterval = useRef(null);

  // Draw simulated geofencing map on canvas
  useEffect(() => {
    if (activeTab !== 'wander') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background grid (simulated streets/parks)
    ctx.strokeStyle = 'var(--border-color)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }
    
    // Home/Safe hub location (center: 200, 200)
    ctx.beginPath();
    ctx.arc(200, 200, 8, 0, 2 * Math.PI);
    ctx.fillStyle = 'var(--accent-teal)';
    ctx.fill();
    ctx.fillStyle = 'var(--bg-secondary)';
    ctx.font = 'bold 11px var(--font-body)';
    ctx.fillText('🏡 Home', 212, 204);

    // Draw Geofencing Boundary Circle (converting meters to canvas pixels: 1m = 1px)
    ctx.beginPath();
    ctx.arc(200, 200, geofenceRadius, 0, 2 * Math.PI);
    ctx.lineWidth = 3;
    ctx.strokeStyle = alertTriggered ? 'rgba(225, 29, 72, 0.8)' : 'rgba(13, 148, 136, 0.4)';
    ctx.stroke();
    
    // Pulse light inside safety radius
    ctx.fillStyle = alertTriggered ? 'rgba(225, 29, 72, 0.05)' : 'rgba(13, 148, 136, 0.03)';
    ctx.fill();

    // Draw Safe Zone Label
    ctx.fillStyle = alertTriggered ? 'var(--danger)' : 'var(--accent-teal)';
    ctx.font = 'bold 12px var(--font-heading)';
    ctx.fillText(`Safe Boundary (${geofenceRadius}m)`, 200 - geofenceRadius + 8, 200 - geofenceRadius + 18);

    // Draw Patient Dot
    ctx.beginPath();
    ctx.arc(patientCoords.x, patientCoords.y, 8, 0, 2 * Math.PI);
    ctx.fillStyle = alertTriggered ? 'var(--danger)' : 'var(--accent-purple)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();
    
    // Draw pulsing ring around patient
    ctx.beginPath();
    ctx.arc(patientCoords.x, patientCoords.y, 16, 0, 2 * Math.PI);
    ctx.strokeStyle = alertTriggered ? 'rgba(225, 29, 72, 0.5)' : 'rgba(124, 58, 237, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Patient tag
    ctx.fillStyle = 'var(--text-primary)';
    ctx.font = 'bold 11px var(--font-body)';
    ctx.fillText(sharedState.patientName, patientCoords.x + 12, patientCoords.y + 4);

  }, [activeTab, geofenceRadius, patientCoords, alertTriggered, sharedState.patientName]);

  // Wandering motion simulation
  useEffect(() => {
    if (isSimulating) {
      simInterval.current = setInterval(() => {
        setPatientCoords((prev) => {
          // Add small random steps (simulate drifting walk)
          const dx = (Math.random() - 0.5) * 16;
          const dy = (Math.random() - 0.5) * 16;
          
          // boundary containment to map size
          const newX = Math.max(10, Math.min(390, prev.x + dx));
          const newY = Math.max(10, Math.min(390, prev.y + dy));
          
          // Calculate distance from center (Home)
          const dist = Math.round(Math.sqrt(Math.pow(newX - 200, 2) + Math.pow(newY - 200, 2)));
          setDistance(dist);
          
          // Trigger/dismiss alarms based on geofence radius
          if (dist > geofenceRadius) {
            if (!alertTriggered) {
              setAlertTriggered(true);
              // Audio trigger chime (warning bleep)
              playAlertSound();
              
              setSimulationLogs((logs) => [
                { time: new Date().toLocaleTimeString(), text: `🚨 WARNING: Geofence Breach! ${sharedState.patientName} is wandering at ${dist}m from home.` },
                ...logs
              ]);
            }
          } else {
            if (alertTriggered) {
              setAlertTriggered(false);
            }
          }
          
          return { x: newX, y: newY };
        });
      }, 800);
    } else {
      if (simInterval.current) clearInterval(simInterval.current);
    }
    return () => {
      if (simInterval.current) clearInterval(simInterval.current);
    };
  }, [isSimulating, geofenceRadius, alertTriggered, sharedState.patientName]);

  // Synthesis alert warning bleep
  const playAlertSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const notes = [440, 440, 440];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.25);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.25);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.25 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.25);
        osc.stop(ctx.currentTime + idx * 0.25 + 0.22);
      });
    } catch (e) {
      console.warn("Audio block", e);
    }
  };

  const handleResetPosition = () => {
    setPatientCoords({ x: 200, y: 200 });
    setDistance(0);
    setAlertTriggered(false);
    setSimulationLogs((logs) => [
      { time: new Date().toLocaleTimeString(), text: `✅ Patient returned safely to Home center. Boundary secure.` },
      ...logs
    ]);
  };

  // Handle Routine scheduler submit
  const handleRoutineSubmit = (e) => {
    e.preventDefault();
    if (!newRoutineName.trim()) return;
    onAddRoutine({
      id: Date.now().toString(),
      name: newRoutineName,
      time: newRoutineTime,
      type: newRoutineType,
      completed: false
    });
    setNewRoutineName('');
    setNewRoutineTime('08:00');
  };

  // Handle Behavior Mood Log submit
  const handleBehaviorSubmit = (e) => {
    e.preventDefault();
    onLogBehavior({
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      mood,
      sleepHours: Number(sleepHours),
      fluidIntake: Number(fluidIntake),
      notes: behaviorNotes
    });
    setBehaviorNotes('');
    alert("Daily report logged successfully!");
  };

  // Handle Memory uploader submit
  const handleMemorySubmit = (e) => {
    e.preventDefault();
    if (!memTitle.trim()) return;
    
    // Choose beautiful random unsplash photo url if none provided
    const randomKeywords = ['vintage', 'nostalgia', 'retro', 'family', 'travel', 'nature'];
    const keyword = randomKeywords[Math.floor(Math.random() * randomKeywords.length)];
    const fallbackPhoto = `https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=60`;
    
    onAddMemory({
      id: Date.now().toString(),
      title: memTitle,
      year: memYear,
      relation: memRelation,
      description: memDesc,
      photoUrl: memPhotoUrl.trim() || fallbackPhoto
    });
    
    setMemTitle('');
    setMemDesc('');
    setMemPhotoUrl('');
    alert("Memory successfully uploaded to Patient scrapbook vault!");
  };

  // Handle Settings configure submit
  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    onUpdateSettings({
      patientName: pName,
      caregiver: { ...sharedState.caregiver, name: cName },
      weather: { temp: Number(wTemp), desc: wDesc, icon: wIcon }
    });
    alert("System configurations updated successfully!");
  };

  // Render Mood SVG chart dynamically based on sharedState logs
  const renderSVGChart = () => {
    const logs = [...sharedState.behaviorLogs].reverse().slice(-7); // take last 7 logs
    if (logs.length < 2) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          Add at least 2 behavior entries to plot the weekly trend graph.
        </div>
      );
    }
    
    const width = 450;
    const height = 140;
    const padding = 25;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    // Map moods to heights (Agitated=0, Anxious=1, Confused=2, Calm=3, Happy=4)
    const moodScore = (m) => {
      switch (m) {
        case 'Agitated': return 0;
        case 'Anxious': return 1;
        case 'Confused': return 2;
        case 'Calm': return 3;
        case 'Happy': return 4;
        default: return 2;
      }
    };
    
    // Map points
    const points = logs.map((log, index) => {
      const x = padding + (index / (logs.length - 1)) * chartWidth;
      const y = padding + (1 - moodScore(log.mood) / 4) * chartHeight;
      return { x, y, ...log };
    });
    
    // Path string
    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathD += ` L ${points[i].x} ${points[i].y}`;
    }
    
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="mood-trend-chart">
        {/* Draw grid lines */}
        {[0, 1, 2, 3, 4].map((score) => {
          const y = padding + (1 - score / 4) * chartHeight;
          return (
            <line 
              key={score}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="var(--border-color)"
              strokeDasharray="3,3"
            />
          );
        })}
        
        {/* Draw Trend Line */}
        <path 
          d={pathD} 
          fill="none" 
          stroke="var(--accent-purple)" 
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Draw dots & tooltips */}
        {points.map((pt, idx) => (
          <g key={pt.id}>
            <circle 
              cx={pt.x} 
              cy={pt.y} 
              r="5" 
              fill="var(--accent-purple)"
              stroke="var(--bg-secondary)"
              strokeWidth="2"
            />
            {/* Simple Mood Tag Label on Node */}
            <text 
              x={pt.x} 
              y={pt.y - 10} 
              fontSize="9px" 
              fontWeight="bold"
              textAnchor="middle" 
              fill="var(--text-secondary)"
            >
              {pt.mood}
            </text>
            
            {/* Date Tag Label */}
            <text 
              x={pt.x} 
              y={height - 5} 
              fontSize="8px" 
              textAnchor="middle" 
              fill="var(--text-tertiary)"
            >
              {pt.date.split('/')[0]}/{pt.date.split('/')[1]}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div className="caregiver-dashboard">
      <nav className="caregiver-nav">
        <button 
          className={`caregiver-tab ${activeTab === 'scheduler' ? 'active' : ''}`}
          onClick={() => setActiveTab('scheduler')}
        >
          📅 Routine & Meds
        </button>
        <button 
          className={`caregiver-tab ${activeTab === 'wander' ? 'active' : ''}`}
          onClick={() => setActiveTab('wander')}
        >
          📍 Geofencing & GPS
        </button>
        <button 
          className={`caregiver-tab ${activeTab === 'behavior' ? 'active' : ''}`}
          onClick={() => setActiveTab('behavior')}
        >
          📊 Behavioral Mood Log
        </button>
        <button 
          className={`caregiver-tab ${activeTab === 'memories' ? 'active' : ''}`}
          onClick={() => setActiveTab('memories')}
        >
          🖼️ Scrapbook Manager
        </button>
        <button 
          className={`caregiver-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </nav>

      {activeTab === 'scheduler' && (
        <div className="caregiver-grid">
          {/* List panel */}
          <div className="caregiver-card">
            <h3 className="caregiver-card-title">Active Patient Schedules</h3>
            <div className="routine-table-container">
              <table className="routine-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Activity</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Control</th>
                  </tr>
                </thead>
                <tbody>
                  {sharedState.routines.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 'bold' }}>{item.time}</td>
                      <td>{item.name}</td>
                      <td>
                        <span className={`badge ${
                          item.type === 'medication' ? 'badge-danger' : 
                          item.type === 'meal' ? 'badge-amber' : 'badge-success'
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${item.completed ? 'badge-success' : 'badge-amber'}`}>
                          {item.completed ? 'Taken / Done' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="vault-btn" 
                          style={{ color: 'var(--danger)', borderColor: 'var(--danger)', padding: '0.2rem 0.5rem', fontSize: '0.85rem' }}
                          onClick={() => onDeleteRoutine(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Form Panel */}
          <div className="caregiver-card">
            <h3 className="caregiver-card-title">Schedule New Activity</h3>
            <form onSubmit={handleRoutineSubmit}>
              <div className="input-group">
                <label>Task / Medicine Name</label>
                <input 
                  type="text" 
                  className="input-control" 
                  value={newRoutineName} 
                  onChange={(e) => setNewRoutineName(e.target.value)}
                  placeholder="e.g. Donepezil Capsule"
                  required
                />
              </div>

              <div className="input-group">
                <label>Target Time</label>
                <input 
                  type="time" 
                  className="input-control" 
                  value={newRoutineTime} 
                  onChange={(e) => setNewRoutineTime(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Category Type</label>
                <select 
                  className="input-control" 
                  value={newRoutineType} 
                  onChange={(e) => setNewRoutineType(e.target.value)}
                >
                  <option value="medication">💊 Medication</option>
                  <option value="meal">🍎 Meal Intake</option>
                  <option value="hygiene">🪥 Hygiene Task</option>
                  <option value="exercise">🚶 Exercise Routine</option>
                  <option value="other">📅 Other/General</option>
                </select>
              </div>

              <button type="submit" className="submit-btn">Add Routine Card</button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'wander' && (
        <div className="caregiver-grid">
          {/* Canvas Map Wrapper */}
          <div className="caregiver-card">
            <h3 className="caregiver-card-title">
              Interactive Geofencing Radar Map
              {isSimulating && (
                <span style={{ fontSize: '0.85rem', color: 'var(--accent-purple)' }}>
                  🛰️ GPS Live Tracking
                </span>
              )}
            </h3>
            
            <div className="geofencing-container">
              <div className="simulation-canvas-wrapper">
                <div className="live-map-tag">
                  <span className="map-pulse-dot" style={{ background: alertTriggered ? 'var(--danger)' : '#34D399' }}></span>
                  {alertTriggered ? 'GEOFENCE BREACH ALERT' : 'LIVE ANTENNA CONNECTED'}
                </div>
                <canvas 
                  ref={canvasRef} 
                  width={400} 
                  height={380} 
                  style={{ display: 'block', width: '100%', height: '100%', background: 'var(--bg-secondary)' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="caregiver-card" style={{ padding: '1rem', background: 'var(--bg-primary)' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Status</div>
                  <strong style={{ fontSize: '1.25rem', color: alertTriggered ? 'var(--danger)' : 'var(--success)' }}>
                    {alertTriggered ? '⚠️ Wandering Detected!' : '💚 Patient Secure'}
                  </strong>
                  <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    Distance: <strong>{distance}m</strong> from Home center.
                  </div>
                </div>

                <button 
                  className={`submit-btn ${isSimulating ? 'vault-btn' : ''}`}
                  style={{ background: isSimulating ? 'var(--accent-amber)' : 'var(--accent-teal)', color: '#FFFFFF' }}
                  onClick={() => setIsSimulating(!isSimulating)}
                >
                  {isSimulating ? '⏸ Pause GPS Sim' : '▶ Simulate Wandering'}
                </button>

                <button className="submit-btn" style={{ background: 'var(--text-primary)' }} onClick={handleResetPosition}>
                  🔄 Return Patient Home
                </button>
              </div>
            </div>
          </div>

          {/* Alert Logs */}
          <div className="caregiver-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 className="caregiver-card-title">Geofence Radar Logs</h3>
            <div className="behavior-log-list" style={{ flex: 1 }}>
              {simulationLogs.map((log, idx) => (
                <div 
                  key={idx} 
                  className={`behavior-log-item ${log.text.includes('🚨') ? 'agitated' : 'calm'}`}
                  style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-tertiary)' }}>{log.time}</span>
                    <span>{log.text}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Geofence controller slider */}
            <div className="input-group" style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Adjust Safe Radius Limit</span>
                <strong>{geofenceRadius} meters</strong>
              </label>
              <input 
                type="range" 
                min="60" 
                max="220" 
                value={geofenceRadius} 
                onChange={(e) => setGeofenceRadius(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-teal)' }}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'behavior' && (
        <div className="caregiver-grid">
          {/* Trend Chart */}
          <div className="caregiver-card">
            <h3 className="caregiver-card-title">7-Day Behavioral & Mood Progression</h3>
            {renderSVGChart()}

            <div style={{ marginTop: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Recent Daily Logs</h4>
              <div className="behavior-log-list">
                {sharedState.behaviorLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className={`behavior-log-item ${
                      log.mood === 'Happy' || log.mood === 'Calm' ? 'calm' : 
                      log.mood === 'Anxious' ? 'anxious' : 'agitated'
                    }`}
                  >
                    <div>
                      <strong>{log.date} - Mood: {log.mood}</strong>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{log.notes || 'No custom notes logged.'}</p>
                    </div>
                    <div style={{ fontSize: '0.8rem', textAlign: 'right', whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
                      💤 {log.sleepHours} hrs<br />
                      💧 {log.fluidIntake} cups
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Log Entry Form */}
          <div className="caregiver-card">
            <h3 className="caregiver-card-title">Log Today's Report</h3>
            <form onSubmit={handleBehaviorSubmit}>
              <div className="input-group">
                <label>Overall Daily Mood</label>
                <select 
                  className="input-control" 
                  value={mood} 
                  onChange={(e) => setMood(e.target.value)}
                >
                  <option value="Happy">😊 Happy & Cooperative</option>
                  <option value="Calm">😌 Calm & Rested</option>
                  <option value="Confused">😕 Mildly Confused</option>
                  <option value="Anxious">😰 Anxious / Restless</option>
                  <option value="Agitated">😤 Agitated / Outburst</option>
                </select>
              </div>

              <div className="input-group">
                <label>Hours Slept (Last Night)</label>
                <input 
                  type="number" 
                  className="input-control" 
                  min="0" 
                  max="24"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Fluid Intake (Cups of Water)</label>
                <input 
                  type="number" 
                  className="input-control" 
                  min="0" 
                  max="30"
                  value={fluidIntake}
                  onChange={(e) => setFluidIntake(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Detailed Observations / Triggers</label>
                <textarea 
                  className="input-control" 
                  rows="4" 
                  value={behaviorNotes}
                  onChange={(e) => setBehaviorNotes(e.target.value)}
                  placeholder="Note down any events, foods, or changes in behavior patterns..."
                />
              </div>

              <button type="submit" className="submit-btn">File Daily Log</button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'memories' && (
        <div className="caregiver-grid">
          {/* Scrapbook Album list */}
          <div className="caregiver-card">
            <h3 className="caregiver-card-title">Scrapbook Slide Deck</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxHeight: '450px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {sharedState.memories.map((mem) => (
                <div key={mem.id} style={{ background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                  <img 
                    src={mem.photoUrl} 
                    alt={mem.title} 
                    style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop&q=60";
                    }}
                  />
                  <div style={{ padding: '0.75rem' }}>
                    <span className="badge badge-success" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>{mem.relation}</span>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>{mem.title} ({mem.year})</strong>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{mem.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Scrapbook Memory Form */}
          <div className="caregiver-card">
            <h3 className="caregiver-card-title">Add Memory Scrapbook Card</h3>
            <form onSubmit={handleMemorySubmit}>
              <div className="input-group">
                <label>Memory Title</label>
                <input 
                  type="text" 
                  className="input-control" 
                  value={memTitle} 
                  onChange={(e) => setMemTitle(e.target.value)}
                  placeholder="e.g. Wedding Day at Cape May"
                  required
                />
              </div>

              <div className="input-group">
                <label>Year of Memory</label>
                <input 
                  type="number" 
                  className="input-control" 
                  value={memYear} 
                  onChange={(e) => setMemYear(e.target.value)}
                  placeholder="e.g. 1982"
                  required
                />
              </div>

              <div className="input-group">
                <label>Relationship Category</label>
                <input 
                  type="text" 
                  className="input-control" 
                  value={memRelation} 
                  onChange={(e) => setMemRelation(e.target.value)}
                  placeholder="e.g. Daughter Sarah / Family"
                  required
                />
              </div>

              <div className="input-group">
                <label>Photo URL (Leave blank for premium automatic illustration!)</label>
                <input 
                  type="url" 
                  className="input-control" 
                  value={memPhotoUrl} 
                  onChange={(e) => setMemPhotoUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="input-group">
                <label>Comforting Scrapbook Description</label>
                <textarea 
                  className="input-control" 
                  rows="3" 
                  value={memDesc}
                  onChange={(e) => setMemDesc(e.target.value)}
                  placeholder="Explain who is in the photo or what makes this moment joyful..."
                  required
                />
              </div>

              <button type="submit" className="submit-btn">Deploy Memory Card</button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="caregiver-card" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          <h3 className="caregiver-card-title">System Configurations</h3>
          <form onSubmit={handleSettingsSubmit}>
            <div className="input-group">
              <label>Patient Full Name</label>
              <input 
                type="text" 
                className="input-control" 
                value={pName} 
                onChange={(e) => setPName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Active Assigned Caregiver Name</label>
              <input 
                type="text" 
                className="input-control" 
                value={cName} 
                onChange={(e) => setCName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="input-group">
                <label>Weather Temp (°C)</label>
                <input 
                  type="number" 
                  className="input-control" 
                  value={wTemp} 
                  onChange={(e) => setWTemp(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>Weather Icon (Emoji)</label>
                <select 
                  className="input-control" 
                  value={wIcon} 
                  onChange={(e) => setWIcon(e.target.value)}
                >
                  <option value="☀️">☀️ Sunny</option>
                  <option value="🌤️">🌤️ Partly Sunny</option>
                  <option value="☁️">☁️ Overcast</option>
                  <option value="☔">☔ Rainy</option>
                  <option value="❄️">❄️ Snowy</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Weather Text Description</label>
              <input 
                type="text" 
                className="input-control" 
                value={wDesc} 
                onChange={(e) => setWDesc(e.target.value)}
                placeholder="e.g. Calm sunny skies, great for a light backyard stroll"
                required
              />
            </div>

            <button type="submit" className="submit-btn" style={{ background: 'var(--accent-purple)' }}>
              Save System Configs
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
