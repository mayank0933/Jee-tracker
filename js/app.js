/**
 * JEE PRO - ADVANCED ANDROID-APP ENGINE
 * High-performance state management, ambient audio synthesizer, confetti particles,
 * 3D flip formula cards, live routine timeline, Canvas analytics & PWA offline sync.
 */

class JeeAndroidApp {
  constructor() {
    this.STORAGE_KEY = 'JEE_PRO_ANDROID_APP_DATA_V3';
    this.activeScreen = 'home';
    this.sylSubject = 'physics';
    this.formulaFilter = 'ALL';
    
    // Timer state
    this.timerInterval = null;
    this.timerSeconds = 25 * 60;
    this.timerTotalSeconds = 25 * 60;
    this.timerRunning = false;
    this.timerModeLabel = '25m Pomodoro';

    // Ambient audio state
    this.audioCtx = null;
    this.audioOsc = null;
    this.audioGain = null;
    this.ambientPlaying = false;

    this.state = this.loadState();
    this.init();
  }

  getDefaultState() {
    const today = new Date().toISOString().split('T')[0];
    return {
      theme: 'dark',
      dreamCollege: 'IIT Bombay CSE',
      targetMarks: 260,
      targetExamDate: '2027-01-24',
      streak: { count: 1, lastActiveDate: today },
      dailyStats: {
        // "YYYY-MM-DD": { hours: 0, questions: { physics: 0, chemistry: 0, mathematics: 0 }, sessions: [] }
      },
      routine: {
        preset: 'dropper_12hr',
        customSlots: [],
        checked: {} // {"YYYY-MM-DD": ["s1", "s2"]}
      },
      tasks: [
        { id: 't1', text: 'Solve 30 PYQs of Rotational Dynamics (COM & Rolling)', subject: 'Physics', priority: 'High', completed: false, date: today },
        { id: 't2', text: 'Inorganic NCERT Line-by-Line: Coordination Compounds', subject: 'Chemistry', priority: 'High', completed: false, date: today },
        { id: 't3', text: 'Maths Advanced Sheet: Definite Integration King\'s Rule', subject: 'Mathematics', priority: 'Medium', completed: false, date: today }
      ],
      syllabusProgress: {},
      mockTests: [
        { id: 'm1', name: 'JEE Main 2024 Jan 27 Shift 1 (PYP)', date: today, phy: 76, chem: 82, math: 68, total: 226, pct: 75 }
      ],
      mistakes: [
        { id: 'mk1', subject: 'Physics', reason: 'Calculation Error', chapRef: 'Rotational Motion Q14', rule: 'Parallel axis theorem distance MUST be measured from Center of Mass!' },
        { id: 'mk2', subject: 'Chemistry', reason: 'Formula Forgot', chapRef: 'Electrochemistry Q08', rule: 'Remember minus sign: E_cell = E° - (0.0591/n) log Q at 298K.' }
      ],
      customFormulas: []
    };
  }

  loadState() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...this.getDefaultState(), ...parsed };
      }
    } catch (e) {
      console.warn('Storage read warning:', e);
    }
    return this.getDefaultState();
  }

  saveState() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Storage write error:', e);
    }
  }

  init() {
    this.checkStreak();
    this.applyTheme(this.state.theme);
    this.setupListeners();
    this.updateCountdown();
    this.renderAll();

    // Background interval for live routine clock
    setInterval(() => {
      this.updateCountdown();
      this.highlightLiveSlot();
    }, 8000);

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./service-worker.js').catch(err => console.log('SW Note:', err));
    }
  }

  triggerHaptic() {
    if ('vibrate' in navigator) {
      try { navigator.vibrate(15); } catch(e){}
    }
  }

  checkStreak() {
    const today = new Date().toISOString().split('T')[0];
    const last = this.state.streak.lastActiveDate;
    if (last !== today) {
      const diff = Math.round((new Date(today) - new Date(last)) / (1000 * 60 * 60 * 24));
      if (diff === 1) {
        this.state.streak.count += 1;
      } else if (diff > 1) {
        this.state.streak.count = 1;
      }
      this.state.streak.lastActiveDate = today;
      this.saveState();
    }
    const el = document.getElementById('streakCount');
    if (el) el.textContent = this.state.streak.count;
  }

  applyTheme(theme) {
    this.state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('themeToggleBtn');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    this.saveState();
  }

  setupListeners() {
    // Navigation Tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const screen = tab.getAttribute('data-screen');
        this.switchScreen(screen);
      });
    });

    // Theme Toggle
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        this.triggerHaptic();
        this.applyTheme(this.state.theme === 'dark' ? 'light' : 'dark');
      });
    }

    // Backdrop click close for bottom sheets
    document.querySelectorAll('.bottom-sheet-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove('open');
        }
      });
    });
  }

  switchScreen(screenName) {
    this.triggerHaptic();
    this.activeScreen = screenName;

    // Update Bottom Nav
    document.querySelectorAll('.nav-tab').forEach(tab => {
      if (tab.getAttribute('data-screen') === screenName) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Update Viewport Section
    document.querySelectorAll('.screen-view').forEach(view => {
      view.classList.remove('active');
    });

    const targetView = document.getElementById(`screen-${screenName}`);
    if (targetView) targetView.classList.add('active');

    // Re-render specifics
    if (screenName === 'home') this.renderHome();
    if (screenName === 'routine') this.renderRoutine();
    if (screenName === 'syllabus') this.renderSyllabusList();
    if (screenName === 'mocks') { this.renderMocks(); this.renderMistakes(); }
    if (screenName === 'formulas') this.renderFormulasGrid();
    if (screenName === 'analytics') this.renderAnalytics();
  }

  getTodayStats() {
    const today = new Date().toISOString().split('T')[0];
    if (!this.state.dailyStats[today]) {
      this.state.dailyStats[today] = {
        hours: 0,
        questions: { physics: 0, chemistry: 0, mathematics: 0 },
        sessions: []
      };
    }
    return this.state.dailyStats[today];
  }

  updateCountdown() {
    const targetStr = this.state.targetExamDate || '2027-01-24';
    const targetDate = new Date(targetStr + 'T09:00:00');
    const now = new Date();
    const diff = targetDate - now;

    const el = document.getElementById('homeCountdownDisplay');
    if (!el) return;

    if (diff <= 0) {
      el.textContent = 'JEE Main Day! You are Ready!';
    } else {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      el.textContent = `${days} Days ${hours}h to JEE`;
    }
  }

  renderAll() {
    this.renderHome();
    this.renderRoutine();
    this.renderSyllabusList();
    this.renderMocks();
    this.renderMistakes();
    this.renderFormulasGrid();
    this.renderAnalytics();

    const dreamEl = document.getElementById('dreamCollegeText');
    if (dreamEl) dreamEl.textContent = this.state.dreamCollege || 'IIT Bombay CSE';
  }

  // 1. HOME SCREEN
  renderHome() {
    const today = this.getTodayStats();
    const todayH = today.hours.toFixed(1);
    const goalH = 10;
    const pct = Math.min(100, Math.round((today.hours / goalH) * 100));

    // Progress Ring offset (circumference = 2 * PI * 36 = ~226)
    const ring = document.getElementById('homeHoursRing');
    const txt = document.getElementById('homeHoursText');
    if (ring && txt) {
      const offset = 226 - (pct / 100) * 226;
      ring.style.strokeDasharray = '226';
      ring.style.strokeDashoffset = offset;
      txt.textContent = `${todayH}h`;
    }

    // Questions count
    const totalQ = today.questions.physics + today.questions.chemistry + today.questions.mathematics;
    const totQEl = document.getElementById('homeTotalQCount');
    if (totQEl) totQEl.textContent = `${totalQ}/100 Qs`;

    const elP = document.getElementById('homePhyQText');
    if (elP) elP.textContent = `${today.questions.physics} / 30 Qs`;
    const elC = document.getElementById('homeChemQText');
    if (elC) elC.textContent = `${today.questions.chemistry} / 35 Qs`;
    const elM = document.getElementById('homeMathQText');
    if (elM) elM.textContent = `${today.questions.mathematics} / 35 Qs`;

    // Tasks preview
    const todayStr = new Date().toISOString().split('T')[0];
    const taskContainer = document.getElementById('homeTaskListContainer');
    if (taskContainer) {
      const list = this.state.tasks.slice(0, 4);
      if (list.length === 0) {
        taskContainer.innerHTML = `<p style="font-size:0.78rem; color:var(--text-muted); text-align:center; padding:0.5rem;">All tasks done! Add more using + Add Task</p>`;
      } else {
        taskContainer.innerHTML = list.map(t => `
          <div style="display:flex; align-items:center; gap:0.65rem; background:var(--bg-surface); padding:0.55rem 0.75rem; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); ${t.completed ? 'opacity:0.5; text-decoration:line-through;' : ''}">
            <input type="checkbox" style="width:18px; height:18px; accent-color:var(--neon-phy); cursor:pointer;" ${t.completed ? 'checked' : ''} onchange="app.toggleTask('${t.id}', this.checked)">
            <div style="flex:1; font-size:0.84rem; font-weight:600;">${t.text}</div>
            <span class="badge-pill ${t.subject === 'Physics' ? 'badge-phy' : (t.subject === 'Chemistry' ? 'badge-chem' : 'badge-math')}">${t.subject}</span>
          </div>
        `).join('');
      }
    }

    this.highlightLiveSlot();
  }

  incQuestions(sub, count) {
    this.triggerHaptic();
    const today = this.getTodayStats();
    today.questions[sub] += count;
    this.saveState();
    this.renderHome();

    // Check if hit 100 questions goal -> trigger celebratory confetti!
    const totalQ = today.questions.physics + today.questions.chemistry + today.questions.mathematics;
    if (totalQ >= 100 && totalQ - count < 100) {
      this.fireConfetti();
      alert('🎉 CONGRATULATIONS! You hit your 100+ Questions Daily Goal! Pure IITian discipline!');
    }
  }

  toggleTask(taskId, completed) {
    this.triggerHaptic();
    const t = this.state.tasks.find(item => item.id === taskId);
    if (t) {
      t.completed = completed;
      this.saveState();
      this.renderHome();
      if (completed) this.fireConfetti();
    }
  }

  // 2. ROUTINE & TIMELINE
  getActiveSlots() {
    if (this.state.routine.preset === 'custom') {
      return this.state.routine.customSlots || [];
    }
    const p = JEE_SYLLABUS_DATA.default_routines[this.state.routine.preset];
    return p ? p.slots : [];
  }

  renderRoutine() {
    const container = document.getElementById('routineTimelineList');
    if (!container) return;

    const select = document.getElementById('routineSelectPreset');
    if (select) select.value = this.state.routine.preset;

    const slots = this.getActiveSlots();
    const todayStr = new Date().toISOString().split('T')[0];
    const checked = this.state.routine.checked[todayStr] || [];

    if (slots.length === 0) {
      container.innerHTML = `<p style="text-align:center; padding:1.5rem; color:var(--text-muted);">No custom slots yet. Click + Custom Slot to add one!</p>`;
      return;
    }

    container.innerHTML = slots.map(slot => {
      const isDone = checked.includes(slot.id);
      const subBadge = slot.subject === 'Physics' ? 'badge-phy' : (slot.subject === 'Chemistry' ? 'badge-chem' : (slot.subject === 'Mathematics' ? 'badge-math' : 'badge-amber'));
      return `
        <div class="timeline-slot-card ${isDone ? 'completed-slot' : ''}" id="slot-card-${slot.id}">
          <input type="checkbox" style="width:18px; height:18px; accent-color:var(--neon-phy); cursor:pointer;" ${isDone ? 'checked' : ''} onchange="app.toggleRoutineSlotDone('${slot.id}', this.checked)">
          <div class="timeline-time-box">${slot.time}</div>
          <div class="timeline-content">
            <div class="timeline-title">${slot.title}</div>
            <div style="display:flex; gap:0.35rem;">
              <span class="badge-pill ${subBadge}">${slot.subject}</span>
              <span class="badge-pill badge-amber">${slot.type}</span>
            </div>
          </div>
          <button class="btn-android btn-subtle btn-sm-pill" onclick="app.startTimerForSlot('${slot.subject}', '${slot.title}')" title="Start Focus Timer">⏳</button>
        </div>
      `;
    }).join('');

    this.highlightLiveSlot();
  }

  highlightLiveSlot() {
    const slots = this.getActiveSlots();
    const now = new Date();
    const curMins = now.getHours() * 60 + now.getMinutes();

    let active = null;
    slots.forEach(slot => {
      const el = document.getElementById(`slot-card-${slot.id}`);
      if (el) el.classList.remove('active-live');

      const parts = slot.time.split('-').map(s => s.trim());
      if (parts.length === 2) {
        const [h1, m1] = parts[0].split(':').map(Number);
        const [h2, m2] = parts[1].split(':').map(Number);
        const start = h1 * 60 + m1;
        const end = h2 * 60 + m2;

        if (curMins >= start && curMins < end) {
          active = slot;
          if (el) el.classList.add('active-live');
        }
      }
    });

    const homeDetails = document.getElementById('homeLiveSlotDetails');
    const homeBadge = document.getElementById('homeLiveBadge');
    if (homeDetails) {
      if (active) {
        homeDetails.innerHTML = `
          <div style="font-size:1.05rem; font-weight:800; color:var(--neon-phy); margin-bottom:0.25rem;">
            ${active.time} • ${active.title}
          </div>
          <div style="font-size:0.8rem; color:var(--text-sub);">
            Subject: <strong>${active.subject}</strong> | Activity: <strong>${active.type}</strong>
          </div>
        `;
        if (homeBadge) {
          homeBadge.textContent = 'Active Right Now';
          homeBadge.className = 'badge-pill badge-high';
        }
      } else {
        homeDetails.innerHTML = `
          <div style="font-size:0.9rem; color:var(--text-sub);">
            🌟 You are between slots. Quick 10-min formula flashcards or rest!
          </div>
        `;
        if (homeBadge) {
          homeBadge.textContent = 'Free Time';
          homeBadge.className = 'badge-pill badge-amber';
        }
      }
    }
  }

  toggleRoutineSlotDone(slotId, isChecked) {
    this.triggerHaptic();
    const today = new Date().toISOString().split('T')[0];
    if (!this.state.routine.checked[today]) this.state.routine.checked[today] = [];
    let list = this.state.routine.checked[today];
    if (isChecked) {
      if (!list.includes(slotId)) list.push(slotId);
      this.fireConfetti();
    } else {
      this.state.routine.checked[today] = list.filter(id => id !== slotId);
    }
    this.saveState();
    this.renderRoutine();
  }

  resetRoutineChecks() {
    this.triggerHaptic();
    const today = new Date().toISOString().split('T')[0];
    this.state.routine.checked[today] = [];
    this.saveState();
    this.renderRoutine();
  }

  setRoutinePreset(name) {
    this.state.routine.preset = name;
    this.saveState();
    this.renderRoutine();
    this.renderHome();
  }

  startTimerFromCurrentSlot() {
    const slots = this.getActiveSlots();
    const now = new Date();
    const curMins = now.getHours() * 60 + now.getMinutes();
    let match = null;
    slots.forEach(slot => {
      const parts = slot.time.split('-').map(s => s.trim());
      if (parts.length === 2) {
        const [h1, m1] = parts[0].split(':').map(Number);
        const [h2, m2] = parts[1].split(':').map(Number);
        if (curMins >= (h1 * 60 + m1) && curMins < (h2 * 60 + m2)) match = slot;
      }
    });

    if (match) {
      this.startTimerForSlot(match.subject, match.title);
    } else {
      this.switchScreen('timer');
    }
  }

  startTimerForSlot(sub, title) {
    this.switchScreen('timer');
    const sel = document.getElementById('timerSubjectChoice');
    if (sel) {
      if (['Physics', 'Chemistry', 'Mathematics'].includes(sub)) sel.value = sub;
      else sel.value = 'General';
    }
    this.setTimerMode(50, `50m: ${title}`);
    this.startTimer();
  }

  // 3. SYLLABUS TRACKER
  setSyllabusSubject(sub) {
    this.triggerHaptic();
    this.sylSubject = sub;
    ['Phy', 'Chem', 'Math'].forEach(k => {
      const btn = document.getElementById(`sylChip${k}`);
      if (btn) btn.className = 'btn-android btn-subtle btn-sm-pill';
    });
    const activeBtn = document.getElementById(`sylChip${sub === 'physics' ? 'Phy' : (sub === 'chemistry' ? 'Chem' : 'Math')}`);
    if (activeBtn) activeBtn.className = 'btn-android btn-primary-glow btn-sm-pill';

    this.renderSyllabusList();
  }

  renderSyllabusList() {
    const container = document.getElementById('syllabusChaptersContainer');
    if (!container) return;

    const chapters = JEE_SYLLABUS_DATA[this.sylSubject] || [];
    const q = (document.getElementById('sylSearch')?.value || '').toLowerCase();
    const cls = document.getElementById('sylClassFilter')?.value || 'ALL';

    const filtered = chapters.filter(ch => {
      const matchQ = ch.name.toLowerCase().includes(q) || (ch.topics && ch.topics.some(t => t.toLowerCase().includes(q)));
      const matchCls = cls === 'ALL' || ch.class.toString() === cls;
      return matchQ && matchCls;
    });

    // Counts update
    const getDone = (subKey) => {
      return (JEE_SYLLABUS_DATA[subKey] || []).filter(c => {
        const p = this.state.syllabusProgress[c.id];
        return p && (p.pyq5 || p.mastered);
      }).length;
    };

    const dP = getDone('physics'), dC = getDone('chemistry'), dM = getDone('mathematics');
    document.getElementById('sylCntPhy').textContent = dP;
    document.getElementById('sylCntChem').textContent = dC;
    document.getElementById('sylCntMath').textContent = dM;

    const totalCh = JEE_SYLLABUS_DATA.physics.length + JEE_SYLLABUS_DATA.chemistry.length + JEE_SYLLABUS_DATA.mathematics.length;
    const overallPct = Math.round(((dP + dC + dM) / totalCh) * 100);
    const overallEl = document.getElementById('syllabusOverallPct');
    if (overallEl) overallEl.textContent = `${overallPct}% Mastered`;

    container.innerHTML = filtered.map(ch => {
      const p = this.state.syllabusProgress[ch.id] || {
        theory: false, notes: false, practice: false, pyq5: false, pyq10: false, rev1: false, rev2: false, mastered: false
      };
      const weightStars = ch.weightage === 'High' ? '★★★ High' : (ch.weightage === 'Medium' ? '★★ Med' : '★ Low');
      return `
        <div style="background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:0.85rem; margin-bottom:0.65rem;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.4rem;">
            <div>
              <span class="badge-pill ${ch.weightage === 'High' ? 'badge-high' : 'badge-amber'}">${weightStars}</span>
              <span class="badge-pill badge-phy">Class ${ch.class}</span>
              ${ch.branch ? `<span class="badge-pill badge-chem">${ch.branch}</span>` : ''}
              <h4 style="font-size:0.92rem; font-weight:700; margin-top:0.3rem;">${ch.name}</h4>
            </div>
            <label style="display:flex; align-items:center; gap:0.3rem; font-size:0.75rem; font-weight:800; color:var(--neon-chem); cursor:pointer;">
              <input type="checkbox" style="width:16px; height:16px; accent-color:var(--neon-chem);" ${p.mastered ? 'checked' : ''} onchange="app.toggleSylMilestone('${ch.id}', 'mastered', this.checked)">
              🏆 Mastered
            </label>
          </div>

          <div style="font-size:0.72rem; color:var(--text-muted); margin-bottom:0.5rem;">
            ${ch.topics ? ch.topics.slice(0, 3).join(' • ') : ''}
          </div>

          <div style="display:flex; flex-wrap:wrap; gap:0.5rem; border-top:1px dashed var(--border-subtle); padding-top:0.5rem; font-size:0.74rem;">
            <label><input type="checkbox" ${p.theory ? 'checked' : ''} onchange="app.toggleSylMilestone('${ch.id}', 'theory', this.checked)"> 📖 Theory</label>
            <label><input type="checkbox" ${p.notes ? 'checked' : ''} onchange="app.toggleSylMilestone('${ch.id}', 'notes', this.checked)"> 📝 Notes</label>
            <label><input type="checkbox" ${p.practice ? 'checked' : ''} onchange="app.toggleSylMilestone('${ch.id}', 'practice', this.checked)"> 🎯 DPPs</label>
            <label><input type="checkbox" ${p.pyq5 ? 'checked' : ''} onchange="app.toggleSylMilestone('${ch.id}', 'pyq5', this.checked)"> 🔥 5y PYQ</label>
            <label><input type="checkbox" ${p.pyq10 ? 'checked' : ''} onchange="app.toggleSylMilestone('${ch.id}', 'pyq10', this.checked)"> 💎 10y PYQ</label>
            <label><input type="checkbox" ${p.rev1 ? 'checked' : ''} onchange="app.toggleSylMilestone('${ch.id}', 'rev1', this.checked)"> 🔄 Rev 1</label>
            <label><input type="checkbox" ${p.rev2 ? 'checked' : ''} onchange="app.toggleSylMilestone('${ch.id}', 'rev2', this.checked)"> ⚡ Rev 2</label>
          </div>
        </div>
      `;
    }).join('');
  }

  toggleSylMilestone(chapId, key, val) {
    this.triggerHaptic();
    if (!this.state.syllabusProgress[chapId]) {
      this.state.syllabusProgress[chapId] = {
        theory: false, notes: false, practice: false, pyq5: false, pyq10: false, rev1: false, rev2: false, mastered: false
      };
    }
    this.state.syllabusProgress[chapId][key] = val;
    this.saveState();
    this.renderSyllabusList();
    if (val && (key === 'mastered' || key === 'pyq5')) this.fireConfetti();
  }

  // 4. FOCUS TIMER & 3-HR EXAM SIM
  setTimerMode(mins, label) {
    this.triggerHaptic();
    this.pauseTimer();
    this.timerTotalSeconds = mins * 60;
    this.timerSeconds = mins * 60;
    this.timerModeLabel = label;
    this.updateTimerDisplay();
  }

  updateTimerDisplay() {
    const m = Math.floor(this.timerSeconds / 60);
    const s = this.timerSeconds % 60;
    const str = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

    const txt = document.getElementById('timerDigitsText');
    if (txt) txt.textContent = str;

    const lbl = document.getElementById('timerStateLabel');
    if (lbl) lbl.textContent = this.timerModeLabel;

    // SVG Ring update (circ = 2 * PI * 95 = 597)
    const ring = document.getElementById('timerSvgProgressRing');
    if (ring && this.timerTotalSeconds > 0) {
      const pct = (this.timerSeconds / this.timerTotalSeconds);
      ring.style.strokeDashoffset = 597 - (pct * 597);
    }

    const btn = document.getElementById('timerMainBtn');
    if (btn) {
      btn.textContent = this.timerRunning ? '⏸️ Pause Focus' : '▶️ Start Focus';
      btn.className = this.timerRunning ? 'btn-android btn-accent-glow' : 'btn-android btn-primary-glow';
    }
  }

  toggleTimer() {
    this.triggerHaptic();
    if (this.timerRunning) this.pauseTimer();
    else this.startTimer();
  }

  startTimer() {
    this.timerRunning = true;
    this.updateTimerDisplay();
    this.timerInterval = setInterval(() => {
      if (this.timerSeconds > 0) {
        this.timerSeconds--;
        this.updateTimerDisplay();
      } else {
        this.timerFinished();
      }
    }, 1000);
  }

  pauseTimer() {
    this.timerRunning = false;
    clearInterval(this.timerInterval);
    this.updateTimerDisplay();
  }

  resetTimer() {
    this.triggerHaptic();
    this.pauseTimer();
    this.timerSeconds = this.timerTotalSeconds;
    this.updateTimerDisplay();
  }

  timerFinished() {
    this.pauseTimer();
    this.playTone();
    this.fireConfetti();

    const mins = Math.round(this.timerTotalSeconds / 60);
    const sub = document.getElementById('timerSubjectChoice')?.value || 'General';
    const today = this.getTodayStats();
    today.hours += mins / 60;

    const sessionObj = {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: mins,
      subject: sub,
      mode: this.timerModeLabel
    };
    today.sessions.unshift(sessionObj);
    this.saveState();

    alert(`🎉 Brilliant! Completed ${mins}m of ${sub} Focus Session. Logged into daily study hours!`);
    this.renderHome();
    this.renderTimerSessions();
    this.renderAnalytics();
  }

  renderTimerSessions() {
    const container = document.getElementById('timerSessionsLog');
    if (!container) return;
    const today = this.getTodayStats();
    if (today.sessions.length === 0) {
      container.innerHTML = `<p style="font-size:0.75rem; color:var(--text-muted);">No sessions logged today yet. Start focus session!</p>`;
      return;
    }
    container.innerHTML = today.sessions.map(s => `
      <div style="display:flex; justify-content:space-between; background:var(--bg-surface); padding:0.45rem 0.65rem; border-radius:var(--radius-sm); font-size:0.78rem;">
        <span><strong>${s.time}</strong> • ${s.subject} (${s.mode})</span>
        <span style="color:var(--neon-amber); font-weight:800;">+${s.duration}m</span>
      </div>
    `).join('');
  }

  // Alpha Wave Synthesizer (Zero external file dependencies)
  toggleAmbientAudio() {
    this.triggerHaptic();
    const btn = document.getElementById('ambientAudioBtn');
    if (this.ambientPlaying) {
      this.stopAmbientAudio();
      if (btn) btn.textContent = '🎧';
    } else {
      this.startAmbientAudio();
      if (btn) btn.textContent = '🔊';
    }
  }

  startAmbientAudio() {
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.audioOsc = this.audioCtx.createOscillator();
      this.audioGain = this.audioCtx.createGain();

      this.audioOsc.type = 'sine';
      this.audioOsc.frequency.setValueAtTime(200, this.audioCtx.currentTime); // Base soothing drone
      this.audioGain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);

      this.audioOsc.connect(this.audioGain);
      this.audioGain.connect(this.audioCtx.destination);
      this.audioOsc.start();
      this.ambientPlaying = true;
    } catch(e){ console.log(e); }
  }

  stopAmbientAudio() {
    try {
      if (this.audioOsc) {
        this.audioOsc.stop();
        this.audioOsc.disconnect();
      }
      this.ambientPlaying = false;
    } catch(e){}
  }

  playTone() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3); // G5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch(e){}
  }

  // 5. MOCKS & MISTAKES
  renderMocks() {
    const container = document.getElementById('mockTestsListContainer');
    if (!container) return;

    if (this.state.mockTests.length === 0) {
      container.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:1rem;">No mock tests logged yet. Track your scores out of 300!</p>`;
      return;
    }

    container.innerHTML = this.state.mockTests.map(m => `
      <div style="background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:0.85rem; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-size:0.9rem; font-weight:800;">${m.name}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${m.date}</div>
          <div style="display:flex; gap:0.4rem; margin-top:0.3rem; font-size:0.78rem;">
            <span style="color:var(--neon-phy);">P: ${m.phy}</span>
            <span style="color:var(--neon-chem);">C: ${m.chem}</span>
            <span style="color:var(--neon-math);">M: ${m.math}</span>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:1.2rem; font-weight:800; color:var(--neon-amber);">${m.total}<span style="font-size:0.75rem; color:var(--text-muted);">/300</span></div>
          <span class="badge-pill badge-chem">${m.pct}%</span>
          <button class="btn-android btn-subtle btn-sm-pill" style="margin-left:0.4rem; color:var(--neon-danger);" onclick="app.deleteMock('${m.id}')">🗑️</button>
        </div>
      </div>
    `).join('');
  }

  renderMistakes() {
    const container = document.getElementById('mistakeCardsList');
    if (!container) return;

    if (this.state.mistakes.length === 0) {
      container.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:1rem;">No mistakes logged. Add errors to avoid repeated negative marks!</p>`;
      return;
    }

    container.innerHTML = this.state.mistakes.map(mk => {
      const subBadge = mk.subject === 'Physics' ? 'badge-phy' : (mk.subject === 'Chemistry' ? 'badge-chem' : 'badge-math');
      return `
        <div style="background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:0.85rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
            <div>
              <span class="badge-pill ${subBadge}">${mk.subject}</span>
              <span class="badge-pill badge-high">${mk.reason}</span>
            </div>
            <button class="btn-android btn-subtle btn-sm-pill" style="color:var(--neon-danger);" onclick="app.deleteMistake('${mk.id}')">🗑️</button>
          </div>
          <div style="font-size:0.88rem; font-weight:700; margin-bottom:0.25rem;">${mk.chapRef}</div>
          <div style="background:rgba(255,179,0,0.1); border-left:3px solid var(--neon-amber); padding:0.4rem 0.65rem; border-radius:var(--radius-xs); font-size:0.78rem; color:var(--neon-amber);">
            <strong>Rule:</strong> ${mk.rule}
          </div>
        </div>
      `;
    }).join('');
  }

  deleteMock(id) {
    this.triggerHaptic();
    this.state.mockTests = this.state.mockTests.filter(m => m.id !== id);
    this.saveState();
    this.renderMocks();
    this.renderAnalytics();
  }

  deleteMistake(id) {
    this.triggerHaptic();
    this.state.mistakes = this.state.mistakes.filter(m => m.id !== id);
    this.saveState();
    this.renderMistakes();
  }

  // 6. 3D FLIP FORMULA CARDS
  filterFormulas(sub) {
    this.triggerHaptic();
    this.formulaFilter = sub;
    this.renderFormulasGrid();
  }

  renderFormulasGrid() {
    const container = document.getElementById('formulaCardsGrid');
    if (!container) return;

    const all = [...JEE_SYLLABUS_DATA.formulas, ...(this.state.customFormulas || [])];
    const filtered = all.filter(f => this.formulaFilter === 'ALL' || f.subject.toLowerCase() === this.formulaFilter.toLowerCase());

    container.innerHTML = filtered.map(f => {
      const subBadge = f.subject.toLowerCase() === 'physics' ? 'badge-phy' : (f.subject.toLowerCase() === 'chemistry' ? 'badge-chem' : 'badge-math');
      return `
        <div class="flip-card-wrapper" onclick="this.classList.toggle('flipped')">
          <div class="flip-card-inner">
            <!-- Front Face -->
            <div class="flip-card-front">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="badge-pill ${subBadge}">${f.subject.toUpperCase()}</span>
                <span style="font-size:0.72rem; color:var(--text-muted);">${f.chapter}</span>
              </div>
              <h4 style="font-size:0.95rem; font-weight:800; color:#fff; margin:0.3rem 0;">${f.title}</h4>
              <div style="font-size:0.88rem; font-family:monospace; color:var(--neon-phy); background:var(--bg-input); padding:0.4rem; border-radius:var(--radius-xs); word-break:break-all;">
                ${f.formula}
              </div>
              <div style="font-size:0.7rem; color:var(--text-sub); text-align:right;">🔄 Tap to reveal notes</div>
            </div>

            <!-- Back Face -->
            <div class="flip-card-back">
              <div style="font-size:0.8rem; font-weight:800; color:var(--neon-amber);">💡 Key Conditions & Shortcuts</div>
              <div style="font-size:0.85rem; color:#f8fafc; margin:0.5rem 0; line-height:1.4;">
                ${f.note || 'High yield JEE Main & Advanced standard condition.'}
              </div>
              <div style="font-size:0.7rem; color:var(--text-muted);">Tap to flip back</div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // 7. CANVAS VISUAL ANALYTICS
  renderAnalytics() {
    this.draw7DayTrend();
    this.drawPCMBalance();
    this.drawMockCurve();
  }

  draw7DayTrend() {
    const canvas = document.getElementById('canvasDailyTrend');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const days = [];
    let totH = 0;
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toISOString().split('T')[0];
      const lbl = d.toLocaleDateString([], { weekday: 'short' });
      const stat = this.state.dailyStats[str];
      const val = stat ? stat.hours : 0;
      days.push({ label: lbl, hours: val });
      totH += val;
    }

    const avgEl = document.getElementById('analyticsAvgHours');
    if (avgEl) avgEl.textContent = `Avg: ${(totH/7).toFixed(1)}h/day`;

    const maxH = Math.max(10, ...days.map(d => d.hours));
    const padX = 35, padY = 25;
    const chartW = w - padX * 2, chartH = h - padY * 2;
    const barW = chartW / days.length - 12;

    days.forEach((d, idx) => {
      const x = padX + idx * (chartW / days.length) + 6;
      const barH = (d.hours / maxH) * chartH;
      const y = h - padY - barH;

      const grad = ctx.createLinearGradient(0, y, 0, h - padY);
      grad.addColorStop(0, '#00f2fe');
      grad.addColorStop(1, '#0077ff');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
      ctx.fill();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(d.label, x + barW/2, h - 8);

      if (d.hours > 0) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText(`${d.hours.toFixed(1)}h`, x + barW/2, y - 5);
      }
    });
  }

  drawPCMBalance() {
    const canvas = document.getElementById('canvasSubjectBalance');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    let p = 30, c = 35, m = 35;
    Object.values(this.state.dailyStats).forEach(ds => {
      if (ds.questions) {
        p += ds.questions.physics;
        c += ds.questions.chemistry;
        m += ds.questions.mathematics;
      }
    });

    const tot = p + c + m;
    const data = [
      { name: 'Physics', val: p / tot, color: '#00f2fe' },
      { name: 'Chemistry', val: c / tot, color: '#00f260' },
      { name: 'Mathematics', val: m / tot, color: '#a855f7' }
    ];

    const cx = w / 2 - 40, cy = h / 2, r = 60, innerR = 35;
    let angle = -Math.PI / 2;

    data.forEach(item => {
      const slice = item.val * 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(cx, cy, r, angle, angle + slice);
      ctx.arc(cx, cy, innerR, angle + slice, angle, true);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();
      angle += slice;
    });

    // Legend
    const legX = w / 2 + 45;
    data.forEach((item, i) => {
      const legY = cy - 25 + i * 25;
      ctx.fillStyle = item.color;
      ctx.fillRect(legX, legY, 10, 10);
      ctx.fillStyle = '#f8fafc';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${item.name}: ${Math.round(item.val * 100)}%`, legX + 15, legY + 9);
    });
  }

  drawMockCurve() {
    const canvas = document.getElementById('canvasMockProgression');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const mocks = this.state.mockTests;
    if (mocks.length === 0) {
      ctx.fillStyle = '#64748b';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Log your first mock test to see progression line!', w/2, h/2);
      return;
    }

    const padX = 40, padY = 30;
    const chartW = w - padX * 2, chartH = h - padY * 2;

    // Grid lines for 100, 200, 300 marks
    [100, 200, 300].forEach(score => {
      const y = h - padY - (score / 300) * chartH;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.moveTo(padX, y);
      ctx.lineTo(w - padX, y);
      ctx.stroke();
      ctx.fillStyle = '#64748b';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${score}m`, padX - 5, y + 3);
    });

    const step = mocks.length > 1 ? chartW / (mocks.length - 1) : chartW / 2;
    ctx.strokeStyle = '#ffb300';
    ctx.lineWidth = 3;
    ctx.beginPath();

    mocks.forEach((m, idx) => {
      const x = mocks.length === 1 ? w/2 : padX + idx * step;
      const y = h - padY - (m.total / 300) * chartH;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    mocks.forEach((m, idx) => {
      const x = mocks.length === 1 ? w/2 : padX + idx * step;
      const y = h - padY - (m.total / 300) * chartH;
      ctx.fillStyle = '#ffb300';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${m.total}`, x, y - 8);
    });
  }

  // 8. CELEBRATORY CONFETTI ENGINE
  fireConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#00f2fe', '#00f260', '#a855f7', '#ffb300', '#ff4b4b'];

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.4,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.8) * 14,
        size: Math.random() * 7 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10
      });
    }

    let frame = 0;
    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.rotation += p.vr;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
        ctx.restore();
      });

      if (frame < 60) requestAnimationFrame(animate);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    requestAnimationFrame(animate);
  }

  // 9. BOTTOM SHEETS & SPEED DIAL HANDLERS
  toggleFab() {
    this.triggerHaptic();
    const dial = document.getElementById('fabSpeedDial');
    if (dial) dial.classList.toggle('open');
  }

  openSheet(id) {
    this.triggerHaptic();
    const dial = document.getElementById('fabSpeedDial');
    if (dial) dial.classList.remove('open');
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
  }

  closeSheet(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  }

  handleAddTask(e) {
    e.preventDefault();
    this.triggerHaptic();
    const text = document.getElementById('taskText').value;
    const subject = document.getElementById('taskSubject').value;
    const priority = document.getElementById('taskPriority').value;
    const today = new Date().toISOString().split('T')[0];

    this.state.tasks.unshift({
      id: 't_' + Date.now(),
      text, subject, priority, completed: false, date: today
    });
    this.saveState();
    this.closeSheet('sheetTask');
    e.target.reset();
    this.renderHome();
  }

  handleAddRoutineSlot(e) {
    e.preventDefault();
    this.triggerHaptic();
    const start = document.getElementById('slotStart').value;
    const end = document.getElementById('slotEnd').value;
    const title = document.getElementById('slotTitleText').value;
    const subject = document.getElementById('slotSub').value;
    const type = document.getElementById('slotTypeVal').value;

    if (!this.state.routine.customSlots) this.state.routine.customSlots = [];
    this.state.routine.customSlots.push({
      id: 'c_' + Date.now(),
      time: `${start} - ${end}`,
      title, subject, type
    });
    this.state.routine.preset = 'custom';
    this.saveState();
    this.closeSheet('sheetSlot');
    e.target.reset();
    this.renderRoutine();
    this.renderHome();
  }

  handleAddMock(e) {
    e.preventDefault();
    this.triggerHaptic();
    const name = document.getElementById('mockName').value;
    const date = document.getElementById('mockDate').value;
    const phy = Number(document.getElementById('mockPhy').value);
    const chem = Number(document.getElementById('mockChem').value);
    const math = Number(document.getElementById('mockMath').value);
    const total = phy + chem + math;
    const pct = Math.round((total / 300) * 100);

    this.state.mockTests.push({ id: 'm_' + Date.now(), name, date, phy, chem, math, total, pct });
    this.saveState();
    this.closeSheet('sheetMock');
    e.target.reset();
    this.renderMocks();
    this.renderAnalytics();
  }

  handleAddMistake(e) {
    e.preventDefault();
    this.triggerHaptic();
    const subject = document.getElementById('mistakeSub').value;
    const reason = document.getElementById('mistakeReason').value;
    const chapRef = document.getElementById('mistakeChapRef').value;
    const rule = document.getElementById('mistakeRule').value;

    this.state.mistakes.unshift({ id: 'mk_' + Date.now(), subject, reason, chapRef, rule });
    this.saveState();
    this.closeSheet('sheetMistake');
    e.target.reset();
    this.renderMistakes();
  }

  handleAddFormula(e) {
    e.preventDefault();
    this.triggerHaptic();
    const subject = document.getElementById('formSub').value;
    const chapter = document.getElementById('formChap').value;
    const title = document.getElementById('formTitle').value;
    const formula = document.getElementById('formExpr').value;
    const note = document.getElementById('formNote').value;

    if (!this.state.customFormulas) this.state.customFormulas = [];
    this.state.customFormulas.push({ id: 'f_' + Date.now(), subject, chapter, title, formula, note, isCustom: true });
    this.saveState();
    this.closeSheet('sheetFormula');
    e.target.reset();
    this.renderFormulasGrid();
  }

  saveDreamGoal() {
    this.triggerHaptic();
    const col = document.getElementById('inputDreamCollege')?.value;
    const marks = document.getElementById('inputTargetMarks')?.value;
    if (col) this.state.dreamCollege = col;
    if (marks) this.state.targetMarks = Number(marks);
    this.saveState();
    this.closeSheet('sheetGoal');
    const dreamEl = document.getElementById('dreamCollegeText');
    if (dreamEl) dreamEl.textContent = this.state.dreamCollege;
  }

  setExamDate(val) {
    this.state.targetExamDate = val;
    this.saveState();
    this.updateCountdown();
  }

  exportBackupJSON() {
    this.triggerHaptic();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `JEE_Pro_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
  }

  importBackupJSON(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (confirm('Restore backup and overwrite current local data?')) {
          this.state = parsed;
          this.saveState();
          alert('Data restored successfully!');
          window.location.reload();
        }
      } catch (err) {
        alert('Invalid JSON file!');
      }
    };
    reader.readAsText(file);
  }

  factoryReset() {
    if (confirm('⚠️ Wipe all study data to defaults?')) {
      localStorage.removeItem(this.STORAGE_KEY);
      this.state = this.getDefaultState();
      this.saveState();
      window.location.reload();
    }
  }
}

const app = new JeeAndroidApp();
