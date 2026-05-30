# Mind Bridge 🌸

> **Mind Bridge** is an empathetic, secure, and highly accessible digital companion designed specifically for Alzheimer's patients and their caregivers. By bridging the gap between simplified patient experiences and powerful caregiver management tools, this application aims to reduce patient anxiety, promote cognitive health, prevent wandering, and streamline daily care routines.

---

## 🎨 Accessible Interface & Dual-Portal Experience
Mind Bridge utilizes a smart **Role-Based Access Control (RBAC)** layout toggling between two dedicated views:
*   **👶 Patient Portal**: A highly focused, distraction-free environment. Featuring a giant digital clock, orienting date & weather details, a one-touch emergency alarm trigger, cozy memory scrapbooks, and calming therapeutic games.
*   **👩‍⚕️ Caregiver Portal**: A comprehensive clinical log and configuration suite. Includes a daily routine scheduler, canvas-based live geofence radar, behavioral diaries, and responsive weekly mood tracking charts.

To accommodate different needs, the system supports three tailored visual systems:
1.  **☀️ Light Mode**: Soft lavenders, warm creams, and calms to prevent sensory strain.
2.  **🌙 Dark Mode**: Soothing night tones to reduce evening restlessness.
3.  **♿ High Contrast Mode**: High-visibility yellow-on-black color palettes with scaled, bold typography and thick boundaries designed for elderly and visually impaired has accessibility.

---

## ✨ Features

### 🕒 1. Reality Orientation Board
Dynamic spatial-temporal anchoring detailing current time, calendar dates, seasonal messages, weather conditions, and a reassuring card of the active care provider (e.g. *"Today your caregiver is Emily"*).

### 🚨 2. One-Touch Assistance & Panic Overlay
A prominent, pulsing emergency button. Activating it alerts the caregiver instantly while presenting a full-screen breathing assistant (3-second inhale/hold/exhale circle) to stabilize patient stress levels.

### 💊 3. Routine & Medication Tracker
A high-contrast card checklist for medicine and hygiene schedules. Completion plays satisfying multi-tonal chimes synthesized natively via the **Web Audio API** (no heavy external sound files required).

### 🖼️ 4. Interactive Memory Scrapbook
A soothing photo slide scrapbook of historical family memories with **HTML5 Text-To-Speech** narration to read descriptions aloud for visually or cognitively impaired patients.

### 🧭 5. Geofencing & Wander Radar Simulator
A real-time **HTML5 Canvas** street radar to simulate patient movement. Caregivers can resize safety boundaries, simulate patient drift, and receive sound and banner alarms when a breach occurs.

### 📈 6. Behavioral Diaries & SVG Trends
Quick log forms for mood, sleep duration, and hydration. The portal processes logs into beautiful, light-weight trend curves drawn natively in React using SVGs.

### 🧠 7. Brain Gym Cognitive Games
Two pressure-free cognitive exercises:
*   **Nature Matching**: A relaxing nature-themed memory card flip game with positive reinforcements.
*   **Word Connect**: Everyday object association matches to stimulate logical recall.

---

## 🛠️ Installation & Setup

Make sure you have [Node.js](https://nodejs.org) installed on your system.

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/im-abhyuday/Mind-Bridge.git
    cd Mind-Bridge
    ```
2.  **Install Node Dependencies**:
    ```bash
    npm install
    ```
3.  **Launch Dev Server**:
    ```bash
    npm run dev
    ```
4.  **Verify Production Bundler**:
    ```bash
    npm run build
    ```
