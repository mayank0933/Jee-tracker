/**
 * JEE TRACKER PRO - CORE JAVASCRIPT ENGINE (V6 Final Fixed)
 * 100% Manual Custom Routine by Default, On-Demand 12-Hour Dropper Template,
 * Non-Overflowing Mobile-First Timetable Cards with Edit/Delete,
 * Intuitive Syllabus Tracker, Question Counter Station (+1/-1),
 * Comprehensive Mock Test Analytics, Mistake Notebook, Simple Stats & LocalStorage Sync.
 */

class JeeTrackerPro {
  constructor() {
    this.STORAGE_KEY = 'JEE_TRACKER_PRO_V6_FIXED';
    this.currentTab = 'home';
    this.activeSyllabusSubject = 'physics';
    
    // Date-wise routine selector state
    this.selectedRoutineDate = this.getTodayDateStr();

    this.state = this.loadState();
    this.init();
  }

  getTodayDateStr() {
    return new Date().toISOString().split('T')[0];
  }

  getTomorrowDateStr() {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }

  formatDisplayDate(dateStr) {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const y = parts[0];
        const m = parseInt(parts[1], 10);
        const d = parseInt(parts[2], 10);
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return `${d} ${months[m-1]} ${y}`;
      }
    } catch(e){}
    return dateStr;
  }

  getDefaultState() {
    const today = this.getTodayDateStr();
    return {
      theme: 'dark',
      dreamCollege: 'IIT Bombay CSE',
      targetScore: 260,
      targetExamDate: '2027-01-24',
      streak: { count: 1, lastActiveDate: today },
      
      // Date-wise Custom Routine: { "YYYY-MM-DD": [ { id, time, title, subject, type } ] }
      // 100% EMPTY by default so user creates custom slots manually!
      dateRoutines: {},
      
      // Date-wise Checked Slots: { "YYYY-MM-DD": [ slotId1, slotId2 ] }
      routineChecks: {},
      
      // Daily Questions: { "YYYY-MM-DD": { physics: 0, chemistry: 0, mathematics: 0 } }
      dailyQuestions: {},

      // Tasks: [ { id, text, subject, priority, completed, date } ]
      tasks: [
        { id: 't1', text: 'Solve 30 PYQs of Rotational Dynamics (COM & Rolling)', subject: 'Physics', priority: 'High', completed: false, date: today },
        { id: 't2', text: 'Inorganic NCERT Line-by-Line: Coordination Compounds', subject: 'Chemistry', priority: 'High', completed: false, date: today },
        { id: 't3', text: 'Maths Advanced Sheet: Definite Integration King\'s Rule', subject: 'Mathematics', priority: 'Medium', completed: false, date: today }
      ],

      // Syllabus Progress: { "chap_id": { theory, notes, practice, pyq5, pyq10, rev1, rev2, mastered } }
      syllabusProgress: {},

      // Mock Tests: [ { id, name, date, type, phy, chem, math, total, pct, correct, wrong, unattempted, remarks } ]
      mockTests: [
        { id: 'm1', name: 'JEE Main 2024 Jan 27 Shift 1 (PYP)', date: today, type: 'Full Syllabus', phy: 76, chem: 82, math: 68, total: 226, pct: 75, correct: 59, wrong: 10, unattempted: 6, remarks: 'Good speed, minor calculation mistakes in Maths' }
      ],

      // Mistake Notebook: [ { id, subject, reason, chapRef, rule } ]
      mistakes: [
        { id: 'mk1', subject: 'Physics', reason: 'Calculation Error', chapRef: 'Rotational Motion Q14', rule: 'Parallel axis theorem distance MUST be measured from Center of Mass!' },
        { id: 'mk2', subject: 'Chemistry', reason: 'Formula Forgot', chapRef: 'Electrochemistry Q08', rule: 'Remember minus sign: E_cell = E° - (0.0591/n) log Q at 298K.' }
      ],

      // Daily Reflection: { "YYYY-MM-DD": { rating: 5, notes: "" } }
      dailyReflections: {}
    };
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...this.getDefaultState(), ...parsed };
      }
    } catch (e) {
      console.warn('LocalStorage load warning:', e);
    }
    return this.getDefaultState();
  }

  saveState() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('LocalStorage save error:', e);
    }
  }

  init() {
    this.checkStreak();
    this.applyTheme(this.state.theme);
    this.setupListeners();
    this.updateCountdown();
    this.renderAll();

    // Routine live slot check every 10 seconds
    setInterval(() => {
      this.updateCountdown();
      this.renderHomeOngoingSlot();
    }, 10000);

    // Register service worker if available
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./service-worker.js').catch(err => console.log(err));
    }
  }

  checkStreak() {
    const today = this.getTodayDateStr();
    const last = this.state.streak.lastActiveDate;
    if (last !== today) {
      const diffDays = Math.round((new Date(today) - new Date(last)) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        this.state.streak.count += 1;
      } else if (diffDays > 1) {
        this.state.streak.count = 1;
      }
      this.state.streak.lastActiveDate = today;
      this.saveState();
    }
    const el = document.getElementById('streakCountVal');
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
    // Bottom Nav Tabs
    document.querySelectorAll('.nav-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });

    // Theme Toggle
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        this.applyTheme(this.state.theme === 'dark' ? 'light' : 'dark');
      });
    }

    // Modal backdrops close on click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('open');
        }
      });
    });
  }

  switchTab(tabName) {
    this.currentTab = tabName;

    document.querySelectorAll('.nav-item-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tabName) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    document.querySelectorAll('.view-panel').forEach(panel => {
      panel.classList.remove('active');
    });

    const target = document.getElementById(`view-${tabName}`);
    if (target) target.classList.add('active');

    // Re-render specific views
    if (tabName === 'home') this.renderHome();
    if (tabName === 'routine') this.renderRoutineView();
    if (tabName === 'syllabus') this.renderSyllabusChapters();
    if (tabName === 'mocks') { this.renderMockScorecard(); this.renderMistakesList(); }
    if (tabName === 'stats') this.renderStatsView();
  }

  updateCountdown() {
    const targetStr = this.state.targetExamDate || '2027-01-24';
    const targetDate = new Date(targetStr + 'T09:00:00');
    const now = new Date();
    const diff = targetDate - now;

    const el = document.getElementById('homeCountdownTxt');
    if (!el) return;

    if (diff <= 0) {
      el.textContent = 'JEE Main Day! Do Your Best!';
    } else {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      el.textContent = `${days} Days ${hours}h Left`;
    }
  }

  getTodayQuestions() {
    const today = this.getTodayDateStr();
    if (!this.state.dailyQuestions[today]) {
      this.state.dailyQuestions[today] = { physics: 0, chemistry: 0, mathematics: 0 };
    }
    return this.state.dailyQuestions[today];
  }

  renderAll() {
    this.renderHome();
    this.renderRoutineView();
    this.renderSyllabusChapters();
    this.renderMockScorecard();
    this.renderMistakesList();
    this.renderStatsView();

    const collegeTxt = document.getElementById('dreamCollegeTxt');
    if (collegeTxt) collegeTxt.textContent = this.state.dreamCollege || 'IIT Bombay CSE';
  }

  // 1. HOME SCREEN RENDERING
  renderHome() {
    const q = this.getTodayQuestions();
    const tot = q.physics + q.chemistry + q.mathematics;

    const badge = document.getElementById('homeTotalQBadge');
    if (badge) badge.textContent = `${tot} / 100 Qs`;

    const elP = document.getElementById('cntPhyVal');
    if (elP) elP.textContent = `${q.physics} Qs solved today`;
    const elC = document.getElementById('cntChemVal');
    if (elC) elC.textContent = `${q.chemistry} Qs solved today`;
    const elM = document.getElementById('cntMathVal');
    if (elM) elM.textContent = `${q.mathematics} Qs solved today`;

    // Render Checklist
    const taskContainer = document.getElementById('homeTasksListContainer');
    if (taskContainer) {
      const list = this.state.tasks.slice(0, 4);
      if (list.length === 0) {
        taskContainer.innerHTML = `<p style="font-size:0.78rem; color:var(--text-muted); text-align:center; padding:0.5rem;">All tasks done! Click + Add Task to add new targets.</p>`;
      } else {
        taskContainer.innerHTML = list.map(t => `
          <div style="display:flex; align-items:center; gap:0.6rem; background:var(--bg-card-elevated); padding:0.55rem 0.75rem; border-radius:var(--radius-sm); border:1px solid var(--border-color); ${t.completed ? 'opacity:0.5; text-decoration:line-through;' : ''}">
            <input type="checkbox" style="width:17px; height:17px; accent-color:var(--col-phy); cursor:pointer;" ${t.completed ? 'checked' : ''} onchange="app.toggleTask('${t.id}', this.checked)">
            <div style="flex:1; font-size:0.84rem; font-weight:600;">${t.text}</div>
            <span class="pill-badge ${t.subject === 'Physics' ? 'pill-phy' : (t.subject === 'Chemistry' ? 'pill-chem' : 'pill-math')}">${t.subject}</span>
          </div>
        `).join('');
      }
    }

    // Render Home PCM Syllabus Bars
    const getDoneSub = (subKey) => {
      return (JEE_SYLLABUS_DATA[subKey] || []).filter(c => {
        const p = this.state.syllabusProgress[c.id];
        return p && (p.pyq5 || p.mastered);
      }).length;
    };
    const dP = getDoneSub('physics'), dC = getDoneSub('chemistry'), dM = getDoneSub('mathematics');
    const pctP = Math.round((dP / JEE_SYLLABUS_DATA.physics.length) * 100);
    const pctC = Math.round((dC / JEE_SYLLABUS_DATA.chemistry.length) * 100);
    const pctM = Math.round((dM / JEE_SYLLABUS_DATA.mathematics.length) * 100);

    document.getElementById('homePhySylPct').textContent = `${pctP}% (${dP}/27)`;
    document.getElementById('homePhySylBar').style.width = `${pctP}%`;
    document.getElementById('homeChemSylPct').textContent = `${pctC}% (${dC}/25)`;
    document.getElementById('homeChemSylBar').style.width = `${pctC}%`;
    document.getElementById('homeMathSylPct').textContent = `${pctM}% (${dM}/23)`;
    document.getElementById('homeMathSylBar').style.width = `${pctM}%`;

    this.renderHomeOngoingSlot();
  }

  adjustQ(subject, delta) {
    const q = this.getTodayQuestions();
    q[subject] = Math.max(0, q[subject] + delta);
    this.saveState();
    this.renderHome();
  }

  resetTodayQuestions() {
    if (confirm('Reset today\'s question counters to 0?')) {
      const q = this.getTodayQuestions();
      q.physics = 0;
      q.chemistry = 0;
      q.mathematics = 0;
      this.saveState();
      this.renderHome();
    }
  }

  toggleTask(id, checked) {
    const t = this.state.tasks.find(item => item.id === id);
    if (t) {
      t.completed = checked;
      this.saveState();
      this.renderHome();
    }
  }

  renderHomeOngoingSlot() {
    const today = this.getTodayDateStr();
    const slots = this.getSlotsForDate(today);
    const container = document.getElementById('homeOngoingSlotBox');
    const badge = document.getElementById('homeLiveBadge');
    if (!container) return;

    if (slots.length === 0) {
      container.innerHTML = `
        <div style="font-size:0.88rem; color:var(--text-sub); display:flex; justify-content:space-between; align-items:center;">
          <span>No timetable slots planned for today yet.</span>
          <button class="btn btn-primary btn-sm" onclick="app.switchTab('routine')">Plan Today</button>
        </div>
      `;
      if (badge) {
        badge.textContent = 'No Slots';
        badge.className = 'pill-badge pill-subtle';
      }
      return;
    }

    const now = new Date();
    const curMins = now.getHours() * 60 + now.getMinutes();

    let active = null;
    slots.forEach(slot => {
      const parts = slot.time.split('-').map(s => s.trim());
      if (parts.length === 2) {
        const [h1, m1] = parts[0].split(':').map(Number);
        const [h2, m2] = parts[1].split(':').map(Number);
        const start = h1 * 60 + m1;
        const end = h2 * 60 + m2;
        if (curMins >= start && curMins < end) active = slot;
      }
    });

    if (active) {
      container.innerHTML = `
        <div style="font-size:1.05rem; font-weight:800; color:var(--col-phy); margin-bottom:0.2rem;">
          ${active.time} • ${active.title}
        </div>
        <div style="font-size:0.8rem; color:var(--text-sub);">
          Subject: <strong>${active.subject}</strong> | Activity: <strong>${active.type}</strong>
        </div>
      `;
      if (badge) {
        badge.textContent = 'Active Right Now';
        badge.className = 'pill-badge pill-amber';
      }
    } else {
      container.innerHTML = `
        <div style="font-size:0.88rem; color:var(--text-sub);">
          🌟 You are currently between scheduled slots (Free / Break).
        </div>
      `;
      if (badge) {
        badge.textContent = 'Break / Free';
        badge.className = 'pill-badge pill-phy';
      }
    }
  }

  // 2. TIMETABLE & ROUTINE (MANUAL CUSTOM DATE-WISE PLANNER)
  getSlotsForDate(dateStr) {
    // 100% custom/manual: return whatever slots user added for this date, or empty array!
    return this.state.dateRoutines[dateStr] || [];
  }

  selectRoutineDate(type) {
    const today = this.getTodayDateStr();
    const tomorrow = this.getTomorrowDateStr();

    document.getElementById('btnDateToday').classList.remove('active');
    document.getElementById('btnDateTomorrow').classList.remove('active');
    document.getElementById('btnDateCustom').classList.remove('active');

    if (type === 'today') {
      this.selectedRoutineDate = today;
      document.getElementById('btnDateToday').classList.add('active');
    } else if (type === 'tomorrow') {
      this.selectedRoutineDate = tomorrow;
      document.getElementById('btnDateTomorrow').classList.add('active');
    }

    this.renderRoutineView();
  }

  triggerDatePicker() {
    const picker = document.getElementById('routineDatePicker');
    if (picker) {
      if (picker.showPicker) picker.showPicker();
      else picker.click();
    }
  }

  selectRoutineCustomDate(customDate) {
    if (!customDate) return;
    this.selectedRoutineDate = customDate;

    document.getElementById('btnDateToday').classList.remove('active');
    document.getElementById('btnDateTomorrow').classList.remove('active');
    document.getElementById('btnDateCustom').classList.add('active');
    document.getElementById('btnDateCustom').textContent = `📅 ${this.formatDisplayDate(customDate)}`;

    this.renderRoutineView();
  }

  calcSlotDuration(timeStr) {
    try {
      const parts = timeStr.split('-').map(s => s.trim());
      if (parts.length === 2) {
        const [h1, m1] = parts[0].split(':').map(Number);
        const [h2, m2] = parts[1].split(':').map(Number);
        const start = h1 * 60 + m1;
        let end = h2 * 60 + m2;
        if (end < start) end += 24 * 60; // overnight
        const durMins = end - start;
        const hrs = Math.floor(durMins / 60);
        const mins = durMins % 60;
        if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
        if (hrs > 0) return `${hrs}h`;
        return `${mins}m`;
      }
    } catch(e){}
    return '';
  }

  calcTotalPlannedHours(slots) {
    let totMins = 0;
    slots.forEach(slot => {
      try {
        const parts = slot.time.split('-').map(s => s.trim());
        if (parts.length === 2) {
          const [h1, m1] = parts[0].split(':').map(Number);
          const [h2, m2] = parts[1].split(':').map(Number);
          const start = h1 * 60 + m1;
          let end = h2 * 60 + m2;
          if (end < start) end += 24 * 60;
          if (slot.type !== 'Break') {
            totMins += (end - start);
          }
        }
      } catch(e){}
    });
    return (totMins / 60).toFixed(1);
  }

  renderRoutineView() {
    const container = document.getElementById('routineDateSlotsContainer');
    const label = document.getElementById('routineSelectedDateLabel');
    const statsText = document.getElementById('routineDayStatsText');
    if (!container) return;

    const today = this.getTodayDateStr();
    const tomorrow = this.getTomorrowDateStr();

    let displayDate = this.formatDisplayDate(this.selectedRoutineDate);
    if (this.selectedRoutineDate === today) displayDate = `Today (${this.formatDisplayDate(today)})`;
    else if (this.selectedRoutineDate === tomorrow) displayDate = `Tomorrow (${this.formatDisplayDate(tomorrow)})`;

    if (label) label.textContent = displayDate;

    // Update modal label as well
    const modalLbl = document.getElementById('modalSlotForDateLabel');
    if (modalLbl) modalLbl.textContent = `Adding slot for: ${displayDate}`;

    const slots = this.getSlotsForDate(this.selectedRoutineDate);
    const checkedList = this.state.routineChecks[this.selectedRoutineDate] || [];

    const plannedHours = this.calcTotalPlannedHours(slots);
    const completedCount = slots.filter(s => checkedList.includes(s.id)).length;

    if (statsText) {
      statsText.textContent = `${slots.length} Slots Planned • ${completedCount}/${slots.length} Completed • ~${plannedHours} hrs Study`;
    }

    if (slots.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:2.5rem 1rem; background:var(--bg-card-elevated); border:1px dashed var(--border-color); border-radius:var(--radius-md); margin-top:0.5rem;">
          <div style="font-size:2.2rem; margin-bottom:0.4rem;">📅</div>
          <h4 style="font-size:1.05rem; font-weight:800; margin-bottom:0.25rem;">No Routine Slots Planned for this Date</h4>
          <p style="font-size:0.82rem; color:var(--text-sub); max-width:400px; margin:0 auto 1.25rem auto;">
            Aap khud se custom study slots add karein, ya direct <strong>12-Hour Focused Dropper Routine</strong> template load karein!
          </p>
          <div style="display:flex; justify-content:center; gap:0.65rem; flex-wrap:wrap;">
            <button class="btn btn-primary" onclick="app.openModal('modalSlot')">+ Add Custom Slot</button>
            <button class="btn btn-accent" onclick="app.load12HourTemplateForSelectedDate()">⚡ Load 12-Hour Dropper Template</button>
          </div>
        </div>
      `;
      return;
    }

    const now = new Date();
    const curMins = now.getHours() * 60 + now.getMinutes();
    const isDateToday = this.selectedRoutineDate === today;

    container.innerHTML = slots.map(slot => {
      const isDone = checkedList.includes(slot.id);
      let isLive = false;
      if (isDateToday) {
        const parts = slot.time.split('-').map(s => s.trim());
        if (parts.length === 2) {
          const [h1, m1] = parts[0].split(':').map(Number);
          const [h2, m2] = parts[1].split(':').map(Number);
          if (curMins >= (h1 * 60 + m1) && curMins < (h2 * 60 + m2)) isLive = true;
        }
      }

      const durText = this.calcSlotDuration(slot.time);
      const subPill = slot.subject === 'Physics' ? 'pill-phy' : (slot.subject === 'Chemistry' ? 'pill-chem' : (slot.subject === 'Mathematics' ? 'pill-math' : 'pill-amber'));
      return `
        <div class="slot-card ${isLive ? 'active-slot' : ''} ${isDone ? 'completed-slot' : ''}">
          <!-- Top Row: Time Badge & Action Buttons -->
          <div class="slot-card-header">
            <div class="slot-time-pill">
              <span>⏰ ${slot.time}</span>
              ${durText ? `<span class="slot-dur-text">(${durText})</span>` : ''}
            </div>
            <div class="slot-btn-group">
              <button class="slot-btn-action slot-btn-edit" onclick="app.openEditSlotModal('${slot.id}')" title="Edit slot">✎ Edit</button>
              <button class="slot-btn-action slot-btn-del" onclick="app.deleteRoutineSlot('${slot.id}')" title="Delete slot">🗑️ Delete</button>
            </div>
          </div>

          <!-- Middle Row: Title & Checkbox -->
          <div class="slot-card-main">
            <input type="checkbox" class="slot-checkbox-input" ${isDone ? 'checked' : ''} onchange="app.toggleRoutineSlotCheck('${slot.id}', this.checked)">
            <div class="slot-title-text">${slot.title}</div>
          </div>

          <!-- Bottom Row: Badges & Tags (Always neatly wrapped inside card) -->
          <div class="slot-card-footer">
            <span class="pill-badge ${subPill}">${slot.subject}</span>
            <span class="pill-badge pill-amber">${slot.type}</span>
            ${isLive ? '<span class="pill-badge pill-live">⚡ Active Now</span>' : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  toggleRoutineSlotCheck(slotId, checked) {
    if (!this.state.routineChecks[this.selectedRoutineDate]) {
      this.state.routineChecks[this.selectedRoutineDate] = [];
    }
    let list = this.state.routineChecks[this.selectedRoutineDate];
    if (checked) {
      if (!list.includes(slotId)) list.push(slotId);
    } else {
      this.state.routineChecks[this.selectedRoutineDate] = list.filter(id => id !== slotId);
    }
    this.saveState();
    this.renderRoutineView();
    this.renderStatsView();
  }

  load12HourTemplateForSelectedDate() {
    const p = JEE_SYLLABUS_DATA.default_routines.dropper_12hr;
    if (p) {
      this.state.dateRoutines[this.selectedRoutineDate] = JSON.parse(JSON.stringify(p.slots));
      this.state.routineChecks[this.selectedRoutineDate] = [];
      this.saveState();
      this.renderRoutineView();
      this.renderHome();
      alert(`⚡ 12-Hour Dropper Template loaded for ${this.formatDisplayDate(this.selectedRoutineDate)}! You can edit or delete any slots.`);
    }
  }

  openEditSlotModal(slotId) {
    const slots = this.getSlotsForDate(this.selectedRoutineDate);
    const slot = slots.find(s => s.id === slotId);
    if (!slot) return;

    document.getElementById('editSlotId').value = slot.id;
    document.getElementById('modalSlotHeaderTitle').textContent = '✎ Edit Routine Slot';
    document.getElementById('btnSaveSlotSubmit').textContent = 'Update Slot';

    const parts = slot.time.split('-').map(s => s.trim());
    if (parts.length === 2) {
      document.getElementById('inputSlotStart').value = parts[0];
      document.getElementById('inputSlotEnd').value = parts[1];
    }
    document.getElementById('inputSlotTitle').value = slot.title;
    document.getElementById('inputSlotSub').value = slot.subject;
    document.getElementById('inputSlotType').value = slot.type;

    this.openModal('modalSlot');
  }

  handleSaveRoutineSlot(e) {
    e.preventDefault();
    const editId = document.getElementById('editSlotId').value;
    const start = document.getElementById('inputSlotStart').value;
    const end = document.getElementById('inputSlotEnd').value;
    const title = document.getElementById('inputSlotTitle').value;
    const subject = document.getElementById('inputSlotSub').value;
    const type = document.getElementById('inputSlotType').value;

    if (!this.state.dateRoutines[this.selectedRoutineDate]) {
      this.state.dateRoutines[this.selectedRoutineDate] = [];
    }

    if (editId) {
      // Update existing
      const slots = this.state.dateRoutines[this.selectedRoutineDate];
      const target = slots.find(s => s.id === editId);
      if (target) {
        target.time = `${start} - ${end}`;
        target.title = title;
        target.subject = subject;
        target.type = type;
      }
    } else {
      // Add new slot
      const newSlot = {
        id: 'slot_' + Date.now(),
        time: `${start} - ${end}`,
        title, subject, type
      };
      this.state.dateRoutines[this.selectedRoutineDate].push(newSlot);
    }

    this.saveState();
    this.closeModal('modalSlot');
    e.target.reset();
    document.getElementById('editSlotId').value = '';
    document.getElementById('modalSlotHeaderTitle').textContent = '⏱️ Add Routine Slot';
    document.getElementById('btnSaveSlotSubmit').textContent = 'Save Slot';
    this.renderRoutineView();
    this.renderHome();
  }

  deleteRoutineSlot(slotId) {
    if (!this.state.dateRoutines[this.selectedRoutineDate]) return;
    this.state.dateRoutines[this.selectedRoutineDate] = this.state.dateRoutines[this.selectedRoutineDate].filter(s => s.id !== slotId);
    this.saveState();
    this.renderRoutineView();
    this.renderHome();
  }

  clearSlotsForSelectedDate() {
    if (confirm(`Are you sure you want to clear all slots for ${this.formatDisplayDate(this.selectedRoutineDate)}?`)) {
      this.state.dateRoutines[this.selectedRoutineDate] = [];
      this.state.routineChecks[this.selectedRoutineDate] = [];
      this.saveState();
      this.renderRoutineView();
      this.renderHome();
    }
  }

  resetChecksForSelectedDate() {
    this.state.routineChecks[this.selectedRoutineDate] = [];
    this.saveState();
    this.renderRoutineView();
  }

  // 3. SYLLABUS TRACKER ENGINE
  setSyllabusSub(sub) {
    this.activeSyllabusSubject = sub;
    ['Phy', 'Chem', 'Math'].forEach(k => {
      const btn = document.getElementById(`sylTab${k}`);
      if (btn) btn.className = 'btn btn-subtle btn-sm';
    });
    const activeBtn = document.getElementById(`sylTab${sub === 'physics' ? 'Phy' : (sub === 'chemistry' ? 'Chem' : 'Math')}`);
    if (activeBtn) activeBtn.className = 'btn btn-primary btn-sm';

    this.renderSyllabusChapters();
  }

  renderSyllabusChapters() {
    const container = document.getElementById('syllabusChaptersList');
    if (!container) return;

    const chapters = JEE_SYLLABUS_DATA[this.activeSyllabusSubject] || [];
    const search = (document.getElementById('sylSearchBox')?.value || '').toLowerCase();
    const classVal = document.getElementById('sylClassSelect')?.value || 'ALL';

    const filtered = chapters.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search) || (c.topics && c.topics.some(t => t.toLowerCase().includes(search)));
      const matchClass = classVal === 'ALL' || c.class.toString() === classVal;
      return matchSearch && matchClass;
    });

    // Update Done Counts on Tabs
    const getDoneSub = (subKey) => {
      return (JEE_SYLLABUS_DATA[subKey] || []).filter(c => {
        const p = this.state.syllabusProgress[c.id];
        return p && (p.pyq5 || p.mastered);
      }).length;
    };

    const dP = getDoneSub('physics'), dC = getDoneSub('chemistry'), dM = getDoneSub('mathematics');
    document.getElementById('sylDoneCntPhy').textContent = dP;
    document.getElementById('sylDoneCntChem').textContent = dC;
    document.getElementById('sylDoneCntMath').textContent = dM;

    const totalChapters = JEE_SYLLABUS_DATA.physics.length + JEE_SYLLABUS_DATA.chemistry.length + JEE_SYLLABUS_DATA.mathematics.length;
    const overallDone = dP + dC + dM;
    const overallPct = Math.round((overallDone / totalChapters) * 100);
    const badge = document.getElementById('sylOverallBadge');
    if (badge) badge.textContent = `${overallPct}% Mastered (${overallDone}/75)`;

    container.innerHTML = filtered.map(ch => {
      const p = this.state.syllabusProgress[ch.id] || {
        theory: false, notes: false, practice: false, pyq5: false, pyq10: false, rev1: false, rev2: false, mastered: false
      };

      // Calculate chapter completion percentage
      const milestones = [p.theory, p.notes, p.practice, p.pyq5, p.pyq10, p.rev1, p.rev2];
      const doneMilestones = milestones.filter(Boolean).length;
      const chapPct = p.mastered ? 100 : Math.round((doneMilestones / 7) * 100);

      const weightPill = ch.weightage === 'High' ? 'pill-red' : (ch.weightage === 'Medium' ? 'pill-amber' : 'pill-chem');
      const barColor = this.activeSyllabusSubject === 'physics' ? 'var(--col-phy)' : (this.activeSyllabusSubject === 'chemistry' ? 'var(--col-chem)' : 'var(--col-math)');

      return `
        <div class="syllabus-chap-card">
          <div class="syllabus-chap-header">
            <div>
              <span class="pill-badge ${weightPill}">${ch.weightage} Weightage</span>
              <span class="pill-badge pill-phy">Class ${ch.class}</span>
              ${ch.branch ? `<span class="pill-badge pill-chem">${ch.branch}</span>` : ''}
              <h4 style="font-size:0.95rem; font-weight:800; margin-top:0.3rem;">${ch.name}</h4>
            </div>
            <label style="display:flex; align-items:center; gap:0.35rem; font-size:0.78rem; font-weight:800; color:var(--col-chem); cursor:pointer;">
              <input type="checkbox" style="width:16px; height:16px; accent-color:var(--col-chem);" ${p.mastered ? 'checked' : ''} onchange="app.toggleSylMilestone('${ch.id}', 'mastered', this.checked)">
              🏆 Mastered
            </label>
          </div>

          <!-- Progress Bar -->
          <div style="display:flex; justify-content:space-between; font-size:0.74rem; color:var(--text-sub); margin-top:0.3rem;">
            <span>Chapter Progress: <strong>${doneMilestones}/7 Stages</strong></span>
            <strong>${chapPct}%</strong>
          </div>
          <div class="chap-progress-bar-container">
            <div class="chap-progress-fill" style="width:${chapPct}%; background:${barColor};"></div>
          </div>

          <!-- Milestones Checkboxes -->
          <div class="milestones-grid">
            <label class="milestone-item"><input type="checkbox" ${p.theory ? 'checked' : ''} onchange="app.toggleSylMilestone('${ch.id}', 'theory', this.checked)"> 📖 Theory</label>
            <label class="milestone-item"><input type="checkbox" ${p.notes ? 'checked' : ''} onchange="app.toggleSylMilestone('${ch.id}', 'notes', this.checked)"> 📝 Short Notes</label>
            <label class="milestone-item"><input type="checkbox" ${p.practice ? 'checked' : ''} onchange="app.toggleSylMilestone('${ch.id}', 'practice', this.checked)"> 🎯 DPP Practice</label>
            <label class="milestone-item"><input type="checkbox" ${p.pyq5 ? 'checked' : ''} onchange="app.toggleSylMilestone('${ch.id}', 'pyq5', this.checked)"> 🔥 5-Yr PYQs</label>
            <label class="milestone-item"><input type="checkbox" ${p.pyq10 ? 'checked' : ''} onchange="app.toggleSylMilestone('${ch.id}', 'pyq10', this.checked)"> 💎 10-Yr PYQs</label>
            <label class="milestone-item"><input type="checkbox" ${p.rev1 ? 'checked' : ''} onchange="app.toggleSylMilestone('${ch.id}', 'rev1', this.checked)"> 🔄 Revision 1</label>
            <label class="milestone-item"><input type="checkbox" ${p.rev2 ? 'checked' : ''} onchange="app.toggleSylMilestone('${ch.id}', 'rev2', this.checked)"> ⚡ Revision 2</label>
          </div>
        </div>
      `;
    }).join('');
  }

  toggleSylMilestone(chapId, milestoneKey, checked) {
    if (!this.state.syllabusProgress[chapId]) {
      this.state.syllabusProgress[chapId] = {
        theory: false, notes: false, practice: false, pyq5: false, pyq10: false, rev1: false, rev2: false, mastered: false
      };
    }
    this.state.syllabusProgress[chapId][milestoneKey] = checked;
    this.saveState();
    this.renderSyllabusChapters();
    this.renderHome();
    this.renderStatsView();
  }

  // 4. MOCK TESTS & MISTAKE BOOK
  renderMockScorecard() {
    const listContainer = document.getElementById('mockTestsList');
    if (!listContainer) return;

    const tests = this.state.mockTests;
    const totTests = tests.length;

    let totScore = 0, maxScore = 0, totAcc = 0;
    tests.forEach(t => {
      totScore += t.total;
      if (t.total > maxScore) maxScore = t.total;
      const att = (t.correct || 0) + (t.wrong || 0);
      if (att > 0) totAcc += ((t.correct || 0) / att) * 100;
    });

    const avgScore = totTests > 0 ? Math.round(totScore / totTests) : 0;
    const avgAcc = totTests > 0 ? Math.round(totAcc / totTests) : 0;

    document.getElementById('statTotTests').textContent = totTests;
    document.getElementById('statAvgScore').textContent = `${avgScore}/300`;
    document.getElementById('statMaxScore').textContent = `${maxScore}/300`;
    document.getElementById('statAccuracy').textContent = `${avgAcc}%`;

    if (tests.length === 0) {
      listContainer.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:1.5rem;">No mock tests logged yet. Click + Log Mock Test to start tracking!</p>`;
      return;
    }

    listContainer.innerHTML = tests.map(t => {
      const att = (t.correct || 0) + (t.wrong || 0);
      const acc = att > 0 ? Math.round(((t.correct || 0) / att) * 100) : t.pct;
      const negMarks = (t.wrong || 0) * 1;

      return `
        <div class="mock-entry-card">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.4rem;">
            <div>
              <div style="font-size:0.95rem; font-weight:800;">${t.name}</div>
              <div style="font-size:0.75rem; color:var(--text-muted);">${t.date} • <span class="pill-badge pill-amber">${t.type}</span></div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:1.3rem; font-weight:800; color:var(--col-amber);">${t.total} <span style="font-size:0.75rem; color:var(--text-muted);">/ 300</span></div>
              <span class="pill-badge pill-chem">${t.pct}% Score</span>
            </div>
          </div>

          <!-- Subject Split -->
          <div style="display:flex; gap:0.5rem; background:var(--bg-input); padding:0.45rem 0.65rem; border-radius:var(--radius-sm); font-size:0.78rem; margin:0.45rem 0;">
            <span style="color:var(--col-phy);">⚛️ Phy: <strong>${t.phy}/100</strong></span>
            <span style="color:var(--col-chem);">🧪 Chem: <strong>${t.chem}/100</strong></span>
            <span style="color:var(--col-math);">📐 Math: <strong>${t.math}/100</strong></span>
          </div>

          <!-- Accuracy & Negative Marks -->
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; color:var(--text-sub); border-top:1px dashed var(--border-color); padding-top:0.45rem; margin-top:0.45rem;">
            <div>
              <span>Correct: <strong style="color:var(--col-chem);">${t.correct || 0}</strong> | </span>
              <span>Wrong: <strong style="color:var(--col-red);">${t.wrong || 0}</strong> (-${negMarks} marks) | </span>
              <span>Accuracy: <strong>${acc}%</strong></span>
            </div>
            <button class="btn btn-danger btn-sm" onclick="app.deleteMock('${t.id}')">🗑️ Delete</button>
          </div>
          ${t.remarks ? `<div style="font-size:0.74rem; color:var(--text-muted); margin-top:0.3rem;">💡 <em>${t.remarks}</em></div>` : ''}
        </div>
      `;
    }).join('');
  }

  handleAddMockTest(e) {
    e.preventDefault();
    const name = document.getElementById('inMockName').value;
    const date = document.getElementById('inMockDate').value;
    const type = document.getElementById('inMockType').value;
    const phy = Number(document.getElementById('inMockPhy').value);
    const chem = Number(document.getElementById('inMockChem').value);
    const math = Number(document.getElementById('inMockMath').value);
    const correct = Number(document.getElementById('inMockCorrect').value || 0);
    const wrong = Number(document.getElementById('inMockWrong').value || 0);
    const unattempted = Number(document.getElementById('inMockUnattempted').value || 0);
    const remarks = document.getElementById('inMockRemarks').value;

    const total = phy + chem + math;
    const pct = Math.round((total / 300) * 100);

    const newTest = {
      id: 'mock_' + Date.now(),
      name, date, type, phy, chem, math, total, pct, correct, wrong, unattempted, remarks
    };

    this.state.mockTests.unshift(newTest);
    this.saveState();
    this.closeModal('modalMock');
    e.target.reset();
    this.renderMockScorecard();
  }

  deleteMock(id) {
    if (confirm('Delete this mock test entry?')) {
      this.state.mockTests = this.state.mockTests.filter(m => m.id !== id);
      this.saveState();
      this.renderMockScorecard();
    }
  }

  renderMistakesList() {
    const container = document.getElementById('mistakeLogsList');
    if (!container) return;

    const list = this.state.mistakes;
    if (list.length === 0) {
      container.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:1rem;">No mistakes logged yet. Click + Add Mistake to track your errors.</p>`;
      return;
    }

    container.innerHTML = list.map(m => {
      const subPill = m.subject === 'Physics' ? 'pill-phy' : (m.subject === 'Chemistry' ? 'pill-chem' : 'pill-math');
      return `
        <div style="background:var(--bg-card-elevated); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:0.85rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
            <div>
              <span class="pill-badge ${subPill}">${m.subject}</span>
              <span class="pill-badge pill-red">${m.reason}</span>
            </div>
            <button class="btn btn-danger btn-sm" onclick="app.deleteMistake('${m.id}')">🗑️</button>
          </div>
          <div style="font-size:0.88rem; font-weight:800; margin-bottom:0.25rem;">${m.chapRef}</div>
          <div style="background:var(--col-amber-bg); border-left:3px solid var(--col-amber); padding:0.45rem 0.65rem; border-radius:var(--radius-sm); font-size:0.78rem; color:var(--col-amber);">
            <strong>Takeaway Rule:</strong> ${m.rule}
          </div>
        </div>
      `;
    }).join('');
  }

  handleAddMistake(e) {
    e.preventDefault();
    const subject = document.getElementById('inMistakeSub').value;
    const reason = document.getElementById('inMistakeReason').value;
    const chapRef = document.getElementById('inMistakeChapRef').value;
    const rule = document.getElementById('inMistakeRule').value;

    const newMistake = {
      id: 'mistake_' + Date.now(),
      subject, reason, chapRef, rule
    };

    this.state.mistakes.unshift(newMistake);
    this.saveState();
    this.closeModal('modalMistake');
    e.target.reset();
    this.renderMistakesList();
  }

  deleteMistake(id) {
    this.state.mistakes = this.state.mistakes.filter(m => m.id !== id);
    this.saveState();
    this.renderMistakesList();
  }

  // 5. STATS VIEW
  renderStatsView() {
    let pTot = 0, cTot = 0, mTot = 0;
    Object.values(this.state.dailyQuestions).forEach(q => {
      pTot += (q.physics || 0);
      cTot += (q.chemistry || 0);
      mTot += (q.mathematics || 0);
    });

    const allTot = pTot + cTot + mTot;
    document.getElementById('statsTotalQAllTime').textContent = `${allTot} Questions`;
    document.getElementById('statPhyQAll').textContent = pTot;
    document.getElementById('statChemQAll').textContent = cTot;
    document.getElementById('statMathQAll').textContent = mTot;

    // Syllabus
    const getDoneSub = (subKey) => {
      return (JEE_SYLLABUS_DATA[subKey] || []).filter(c => {
        const p = this.state.syllabusProgress[c.id];
        return p && (p.pyq5 || p.mastered);
      }).length;
    };
    const dP = getDoneSub('physics'), dC = getDoneSub('chemistry'), dM = getDoneSub('mathematics');
    const totMastered = dP + dC + dM;
    document.getElementById('statsSyllabusMasteredCount').textContent = `${totMastered} / 75 Chapters Mastered (${Math.round((totMastered/75)*100)}%)`;
    document.getElementById('statPhyChDone').textContent = `${dP}/27`;
    document.getElementById('statChemChDone').textContent = `${dC}/25`;
    document.getElementById('statMathChDone').textContent = `${dM}/23`;

    // Routine Slots Done Today
    const today = this.getTodayDateStr();
    const checkedToday = (this.state.routineChecks[today] || []).length;
    document.getElementById('statsRoutineSlotsDoneToday').textContent = `${checkedToday} Slots Completed Today`;

    // Reflection
    const todayRef = this.state.dailyReflections[today] || { rating: 5, notes: '' };
    const notesInput = document.getElementById('reflectionNotesText');
    if (notesInput) notesInput.value = todayRef.notes || '';
  }

  setDayRating(val) {
    const today = this.getTodayDateStr();
    if (!this.state.dailyReflections[today]) this.state.dailyReflections[today] = { rating: 5, notes: '' };
    this.state.dailyReflections[today].rating = val;
    this.saveState();
    alert(`Saved productivity rating: ${val} ⭐ for today!`);
  }

  saveReflectionNotes(notes) {
    const today = this.getTodayDateStr();
    if (!this.state.dailyReflections[today]) this.state.dailyReflections[today] = { rating: 5, notes: '' };
    this.state.dailyReflections[today].notes = notes;
    this.saveState();
  }

  // 6. TASKS & GOALS & BACKUP
  handleAddTask(e) {
    e.preventDefault();
    const text = document.getElementById('inputTaskText').value;
    const subject = document.getElementById('inputTaskSub').value;
    const priority = document.getElementById('inputTaskPrio').value;
    const today = this.getTodayDateStr();

    this.state.tasks.unshift({
      id: 'task_' + Date.now(),
      text, subject, priority, completed: false, date: today
    });
    this.saveState();
    this.closeModal('modalTask');
    e.target.reset();
    this.renderHome();
  }

  saveDreamGoal() {
    const college = document.getElementById('inGoalCollege').value;
    const score = document.getElementById('inGoalScore').value;
    if (college) this.state.dreamCollege = college;
    if (score) this.state.targetScore = Number(score);
    this.saveState();
    this.closeModal('modalGoal');
    const dreamTxt = document.getElementById('dreamCollegeTxt');
    if (dreamTxt) dreamTxt.textContent = this.state.dreamCollege;
  }

  setTargetExamDate(dateStr) {
    this.state.targetExamDate = dateStr;
    this.saveState();
    this.updateCountdown();
  }

  exportDataJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `JEE_Tracker_Pro_Backup_${this.getTodayDateStr()}.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
  }

  importDataJSON(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (confirm('Restore backup and overwrite current data?')) {
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

  resetAllData() {
    if (confirm('⚠️ WARNING: This will reset all your saved routines, question counts, and mock test scores. Proceed?')) {
      localStorage.removeItem(this.STORAGE_KEY);
      this.state = this.getDefaultState();
      this.saveState();
      alert('Reset complete!');
      window.location.reload();
    }
  }

  openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
  }

  closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  }
}

const app = new JeeTrackerPro();
