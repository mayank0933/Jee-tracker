# ⚡ JEE Prep Pro (Ultimate Routine, Task & Syllabus Companion)

An advanced, offline-first Progressive Web App (PWA) specifically engineered for **IIT-JEE (Main & Advanced)** aspirants. It empowers students with disciplined daily routine execution, question-solving targets, full syllabus milestone tracking (Class 11 & 12 PCM), 3-hour exam simulation focus timer, and a dedicated test error analyzer (Mistake Book).

---

## 🚀 Key Upgrades & Features

### 1. ⏱️ Dynamic Routine & Timetable Tracker
* **Real-time Active Slot Highlight**: Detects system clock and visually highlights your ongoing study slot (e.g. *7:00 PM - 8:30 PM: Vectors & 3D Problem Solving*).
* **Pre-built Topper Routine Templates**:
  * **12-Hour Focused Dropper Routine**: Balanced PCM problem-solving slots, lecture revisions, mock slots, and day review.
  * **6-8 Hour School-Going Routine**: Optimized for Class 11/12 regular school students.
  * **Weekend Marathon Routine**: Complete 3-hour mock exam simulation and deep error analysis.
  * **Custom Routine Builder**: Add custom time slots, subjects, and activity types.
* **Persistent Daily Completion**: Mark slots as done with one-click daily reset.

### 2. 🎯 Smart Task Manager & Question-Solving Station
* **Categorized Daily Checklist**: Add tasks tagged with Subject (**Physics, Chemistry, Mathematics**) and Priority (**High, Medium, Low**).
* **Live Question Solving Counter**: Direct increment buttons (`+1`, `+5`, `+10`) for Physics, Chemistry, and Mathematics to hit the **100+ questions/day** milestone.

### 3. 📚 Official JEE Main & Advanced Syllabus Tracker
* **75 Comprehensive Chapters** categorized by Class 11 & Class 12 with official weightage ratings (**High, Medium, Low**).
* **7 Milestone Checkboxes per Chapter**:
  1. 📖 Theory & Lectures
  2. 📝 Short Notes
  3. 🎯 Module DPPs
  4. 🔥 5-Year PYQs
  5. 💎 10-Year PYQs
  6. 🔄 Revision 1 (R1)
  7. ⚡ Revision 2 (R2)
  8. 🏆 Mastered
* Subject-wise completion percentages with live animated progress bars.

### 4. ⏳ Focus Study Timer & 3-Hour Real JEE Exam Simulator
* **Presets**: 25m Pomodoro, 50m Deep Focus, 90m Advanced Session, and **180m (3-Hour Real JEE Main Mock Simulation)**.
* **Automatic Study Logging**: Logs study minutes directly into your daily study analytics by subject upon completion.
* **Sound Alerts**: Web Audio API generated soft finish chime.

### 5. 📝 Mock Test Scoreboard & Mistake Book (Error Analyzer)
* **Scoreboard**: Log mock scores with Physics, Chemistry, Mathematics marks out of 100 each. Auto-calculates total (out of 300) and percentage.
* **Mistake Book**: Log specific test errors categorized by:
  * Calculation Error
  * Formula Forgotten / Misapplied
  * Question Misinterpreted
  * Conceptual Gap
  * Time Pressure / Rushed Solving
  * Wild Guess / Negative Marking

### 6. ⚡ High-Yield Formula Vault
* Searchable flashcards of critical formulas and key conditions across PCM.
* Custom formula and shortcut manager.

### 7. 📊 Visual Analytics & Streak System
* **Daily Study Streak 🔥**: Tracks consecutive study days.
* **Interactive Canvas Charts**:
  * 7-Day Study Hours Bar Chart
  * PCM Study Balance Donut Chart (Physics vs Chemistry vs Maths)
  * Mock Test Marks Progression Curve

### 8. 📲 100% Offline PWA & Data Safety
* Service Worker caching allows full offline usage without internet.
* Installable on Android, iOS, Windows, Mac.
* **Export / Import JSON Data Backup**: Zero risk of losing study history when switching devices.

---

## 📁 Project Structure

```
jee_tracker_pro/
├── index.html              # Main Single Page Application UI
├── manifest.json           # PWA Web Manifest Configuration
├── service-worker.js       # Offline Caching & Cache Management
├── css/
│   └── style.css           # Modern Dark-mode First & Responsive Styles
├── js/
│   ├── syllabus-data.js    # Complete JEE Syllabus, Formulas & Routines
│   └── app.js              # Application Logic, LocalStorage & Chart Engines
├── icons/
│   ├── icon-192.png        # PWA App Icon (192x192)
│   └── icon-512.png        # PWA App Icon (512x512)
└── README.md               # Documentation & Setup Guide
```

---

## 🛠️ How to Run & Deploy

1. **Local Run**: Simply double click `index.html` in any modern web browser (Chrome, Edge, Firefox, Brave, Safari).
2. **GitHub Pages / Vercel**: Push the directory to GitHub and enable GitHub Pages, or deploy directly to Vercel/Netlify for instant HTTPS hosting.
3. **Install as App**: When loaded in browser, tap the **📲 Install** button or browser menu "Install to Home Screen" to use like a native app.
