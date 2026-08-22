/**
 * JEE PREP PRO - CORE ENGINE
 * Full state management, persistent LocalStorage, Pomodoro & 3-Hour Exam Timer,
 * Live Timetable Slot Engine, Mistake Book, Canvas Visual Analytics & PWA offline sync.
 */

class JeeApp {
  constructor() {
    this.STORAGE_KEY = 'JEE_PREP_PRO_V2_DATA';
    this.timerInterval = null;
    this.timerSecondsRemaining = 25 * 60;
    this.timerTotalSeconds = 25 * 60;
    this.timerIsRunning = false;
    this.timerCurrentMode = '25m Pomodoro';
    this.activeSyllabusSubject = 'physics';
    this.taskFilterSubject = 'ALL';
    this.formulaFilterSubject = 'ALL';

    this.state = this.loadState();
    this.init();
  }

  // Initial State Factory
  getDefaultState() {
    const todayStr = new Date().toISOString().split('T')[0];
    return {
      theme: 'dark',
      targetExamDate: '2027-01-24', // Default JEE Main Session 1
      streak: {
        count: 1,
        lastActiveDate: todayStr
      },
      routine: {
        preset: 'dropper_12hr',
        customSlots: [],
        checkedSlots: {} // format: {"YYYY-MM-DD": ["s1", "s2"]}
      },
      dailyStats: {
        // "YYYY-MM-DD": { hours: 0, questions: { physics: 0, chemistry: 0, mathematics: 0 }, sessions: [] }
      },
      tasks: [
        { id: 't1', text: 'Solve 30 PYQs of Rotational Motion (Angular Momentum & Rolling)', subject: 'Physics', priority: 'High', completed: false, date: todayStr },
        { id: 't2', text: 'Inorganic NCERT Revision: Coordination Compounds & Isomerism', subject: 'Chemistry', priority: 'High', completed: false, date: todayStr },
        { id: 't3', text: 'Maths DPP: Definite Integration King\'s Property & Leibniz Rule', subject: 'Mathematics', priority: 'Medium', completed: false, date: todayStr }
      ],
      syllabusProgress: {
        // "chapter_id": { theory: false, notes: false, practice: false, pyq5: false, pyq10: false, rev1: false, rev2: false }
      },
      mockTests: [
        { id: 'm1', name: 'JEE Main 2024 Jan 27 Shift 1 (PYP)', date: todayStr, phy: 72, chem: 80, math: 64, total: 216, pct: 72 }
      ],
      mistakes: [
        { id: 'mk1', subject: 'Physics', type: 'Calculation Error', chapter: 'Rotational Motion - Q14', takeaway: 'Parallel axis theorem distance d MUST be from Center of Mass, not an arbitrary point!' },
        { id: 'mk2', subject: 'Chemistry', type: 'Formula Forgot', chapter: 'Electrochemistry - Q8', takeaway: 'Remember minus sign in Nernst equation: E = E° - (0.0591/n) log Q.' }
      ],
      customFormulas: []
    };
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with default state structure
        const def = this.getDefaultState();
        return { ...def, ...parsed };
      }
    } catch (e) {
      console.warn('Could not load stored data, using defaults:', e);
    }
    return this.getDefaultState();
  }

  saveState() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  init() {
    this.checkAndUpdateStreak();
    this.applyTheme(this.state.theme);
    this.setupEventListeners();
    this.updateCountdown();
    this.renderDashboard();
    this.renderRoutine();
    this.renderTasks();
    this.renderSyllabus();
    this.renderMockTests();
    this.renderMistakes();
    this.renderFormulas();
    this.renderAnalytics();

    // Start background live routine clock updater
    setInterval(() => {
      this.updateCountdown();
      this.highlightLiveRoutineSlot();
    }, 10000);

    // Register service worker if supported
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./service-worker.js').catch(err => {
        console.log('SW registration note:', err);
      });
    }

    // PWA Install handler
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      const installBtn = document.getElementById('pwaInstallBtn');
      if (installBtn) installBtn.style.display = 'inline-flex';
    });
  }

  checkAndUpdateStreak() {
    const todayStr = new Date().toISOString().split('T')[0];
    const last = this.state.streak.lastActiveDate;
    if (last !== todayStr) {
      const lastDate = new Date(last);
      const todayDate = new Date(todayStr);
      const diffDays = Math.round((todayDate - lastDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        this.state.streak.count += 1;
      } else if (diffDays > 1) {
        this.state.streak.count = 1;
      }
      this.state.streak.lastActiveDate = todayStr;
      this.saveState();
    }

    const streakEl = document.getElementById('streakCount');
    if (streakEl) streakEl.textContent = this.state.streak.count;
  }

  setupEventListeners() {
    // Nav Items click (Sidebar & Mobile)
    document.querySelectorAll('[data-view]').forEach(el => {
      el.addEventListener('click', () => {
        const view = el.getAttribute('data-view');
        this.switchView(view);
      });
    });

    // Theme toggle
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const nextTheme = this.state.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme(nextTheme);
      });
    }

    // Mobile menu toggle
    const menuBtn = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('appSidebar');
    if (menuBtn && sidebar) {
      menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }

    // Install App button
    const installBtn = document.getElementById('pwaInstallBtn');
    if (installBtn) {
      installBtn.addEventListener('click', async () => {
        if (this.deferredPrompt) {
          this.deferredPrompt.prompt();
          const { outcome } = await this.deferredPrompt.userChoice;
          if (outcome === 'accepted') {
            installBtn.style.display = 'none';
          }
          this.deferredPrompt = null;
        }
      });
    }
  }

  applyTheme(theme) {
    this.state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    this.saveState();
  }

  switchView(viewName) {
    // Update active nav items
    document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(el => {
      if (el.getAttribute('data-view') === viewName) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    // Update active section
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const targetSec = document.getElementById(`view-${viewName}`);
    if (targetSec) {
      targetSec.classList.add('active');
    }

    // Close mobile sidebar if open
    const sidebar = document.getElementById('appSidebar');
    if (sidebar) sidebar.classList.remove('open');

    // Trigger re-renders for analytics when switching
    if (viewName === 'analytics') {
      this.renderAnalytics();
    } else if (viewName === 'dashboard') {
      this.renderDashboard();
    } else if (viewName === 'routine') {
      this.highlightLiveRoutineSlot();
    }
  }

  // Countdown timer
  updateCountdown() {
    const targetStr = this.state.targetExamDate || '2027-01-24';
    const targetDate = new Date(targetStr + 'T09:00:00');
    const now = new Date();
    const diffMs = targetDate - now;

    const badge = document.getElementById('countdownText');
    if (!badge) return;

    if (diffMs <= 0) {
      badge.textContent = 'JEE Main Day is Today! Give Your Best!';
      return;
    }

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    badge.textContent = `JEE Target: ${days}d ${hours}h Left`;
  }

  getTodayData() {
    const todayStr = new Date().toISOString().split('T')[0];
    if (!this.state.dailyStats[todayStr]) {
      this.state.dailyStats[todayStr] = {
        hours: 0,
        questions: { physics: 0, chemistry: 0, mathematics: 0 },
        sessions: []
      };
    }
    return this.state.dailyStats[todayStr];
  }

  // 1. DASHBOARD RENDERING
  renderDashboard() {
    const todayData = this.getTodayData();
    const todayHours = todayData.hours.toFixed(1);
    const hoursGoal = 10;
    const hoursPct = Math.min(100, Math.round((todayData.hours / hoursGoal) * 100));

    const totalQs = todayData.questions.physics + todayData.questions.chemistry + todayData.questions.mathematics;
    const qGoal = 100;
    const qPct = Math.min(100, Math.round((totalQs / qGoal) * 100));

    const todayStr = new Date().toISOString().split('T')[0];
    const todayTasks = this.state.tasks.filter(t => !t.date || t.date === todayStr);
    const completedTasks = todayTasks.filter(t => t.completed).length;
    const taskPct = todayTasks.length > 0 ? Math.round((completedTasks / todayTasks.length) * 100) : 0;

    // Syllabus calculation
    const totalChapters = JEE_SYLLABUS_DATA.physics.length + JEE_SYLLABUS_DATA.chemistry.length + JEE_SYLLABUS_DATA.mathematics.length;
    let completedChapters = 0;
    let phyDone = 0, chemDone = 0, mathDone = 0;

    const calcDone = (chapList, subKey) => {
      let count = 0;
      chapList.forEach(ch => {
        const p = this.state.syllabusProgress[ch.id];
        if (p && (p.pyq5 || p.rev1 || p.mastered)) {
          count++;
        }
      });
      return count;
    };

    phyDone = calcDone(JEE_SYLLABUS_DATA.physics, 'physics');
    chemDone = calcDone(JEE_SYLLABUS_DATA.chemistry, 'chemistry');
    mathDone = calcDone(JEE_SYLLABUS_DATA.mathematics, 'mathematics');
    completedChapters = phyDone + chemDone + mathDone;
    const syllabusPct = Math.round((completedChapters / totalChapters) * 100);

    // Update DOM
    const dHours = document.getElementById('dashTodayHours');
    if (dHours) dHours.textContent = `${todayHours}h`;
    const dHoursBar = document.getElementById('dashHoursBar');
    if (dHoursBar) dHoursBar.style.width = `${hoursPct}%`;

    const dQs = document.getElementById('dashQuestionsSolved');
    if (dQs) dQs.textContent = `${totalQs} Qs`;
    const dQsBar = document.getElementById('dashQuestionsBar');
    if (dQsBar) dQsBar.style.width = `${qPct}%`;

    const dTasks = document.getElementById('dashTasksCompleted');
    if (dTasks) dTasks.textContent = `${completedTasks}/${todayTasks.length}`;
    const dTasksBar = document.getElementById('dashTasksBar');
    if (dTasksBar) dTasksBar.style.width = `${taskPct}%`;

    const dSyl = document.getElementById('dashSyllabusCovered');
    if (dSyl) dSyl.textContent = `${syllabusPct}%`;
    const dSylBar = document.getElementById('dashSyllabusBar');
    if (dSylBar) dSylBar.style.width = `${syllabusPct}%`;

    // Question count pills
    const dPhyQ = document.getElementById('dashPhyQCount');
    if (dPhyQ) dPhyQ.textContent = `${todayData.questions.physics} / 30 Qs`;
    const dChemQ = document.getElementById('dashChemQCount');
    if (dChemQ) dChemQ.textContent = `${todayData.questions.chemistry} / 35 Qs`;
    const dMathQ = document.getElementById('dashMathQCount');
    if (dMathQ) dMathQ.textContent = `${todayData.questions.mathematics} / 35 Qs`;

    // Subject Syllabus Bars
    const pPhy = Math.round((phyDone / JEE_SYLLABUS_DATA.physics.length) * 100);
    const pChem = Math.round((chemDone / JEE_SYLLABUS_DATA.chemistry.length) * 100);
    const pMath = Math.round((mathDone / JEE_SYLLABUS_DATA.mathematics.length) * 100);

    const elP = document.getElementById('dashPhyPercent');
    if (elP) elP.textContent = `${pPhy}%`;
    const elPB = document.getElementById('dashPhyBar');
    if (elPB) elPB.style.width = `${pPhy}%`;

    const elC = document.getElementById('dashChemPercent');
    if (elC) elC.textContent = `${pChem}%`;
    const elCB = document.getElementById('dashChemBar');
    if (elCB) elCB.style.width = `${pChem}%`;

    const elM = document.getElementById('dashMathPercent');
    if (elM) elM.textContent = `${pMath}%`;
    const elMB = document.getElementById('dashMathBar');
    if (elMB) elMB.style.width = `${pMath}%`;

    this.highlightLiveRoutineSlot();
  }

  // 2. DAILY ROUTINE ENGINE
  getActiveRoutineSlots() {
    if (this.state.routine.preset === 'custom') {
      return this.state.routine.customSlots || [];
    }
    const presetObj = JEE_SYLLABUS_DATA.default_routines[this.state.routine.preset];
    return presetObj ? presetObj.slots : [];
  }

  renderRoutine() {
    const container = document.getElementById('routineSlotsList');
    if (!container) return;

    const select = document.getElementById('routinePresetSelect');
    if (select) select.value = this.state.routine.preset;

    const slots = this.getActiveRoutineSlots();
    const todayStr = new Date().toISOString().split('T')[0];
    const checkedList = this.state.routine.checkedSlots[todayStr] || [];

    if (slots.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:2rem; color:var(--text-muted);">
          <p>No custom slots added yet. Click <strong>+ Add Slot</strong> to design your ideal routine!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = slots.map(slot => {
      const isChecked = checkedList.includes(slot.id);
      const subBadgeClass = slot.subject === 'Physics' ? 'badge-phy' : (slot.subject === 'Chemistry' ? 'badge-chem' : (slot.subject === 'Mathematics' ? 'badge-math' : 'badge-gen'));
      return `
        <div class="routine-slot-item ${isChecked ? 'completed' : ''}" id="slot-item-${slot.id}" data-time="${slot.time}">
          <input type="checkbox" class="task-checkbox" ${isChecked ? 'checked' : ''} onchange="app.toggleRoutineCheck('${slot.id}', this.checked)">
          <div class="slot-time">${slot.time}</div>
          <div class="slot-main">
            <div class="slot-title">${slot.title}</div>
            <div class="slot-tag">
              <span class="badge ${subBadgeClass}">${slot.subject}</span>
              <span class="badge badge-med">${slot.type}</span>
            </div>
          </div>
          ${this.state.routine.preset === 'custom' ? `
            <button class="btn btn-danger btn-sm" onclick="app.deleteCustomSlot('${slot.id}')">🗑️</button>
          ` : ''}
        </div>
      `;
    }).join('');

    this.highlightLiveRoutineSlot();
  }

  highlightLiveRoutineSlot() {
    const slots = this.getActiveRoutineSlots();
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    let activeSlot = null;

    slots.forEach(slot => {
      const el = document.getElementById(`slot-item-${slot.id}`);
      if (el) el.classList.remove('active-slot');

      const parts = slot.time.split('-').map(s => s.trim());
      if (parts.length === 2) {
        const [h1, m1] = parts[0].split(':').map(Number);
        const [h2, m2] = parts[1].split(':').map(Number);
        const startMins = h1 * 60 + m1;
        const endMins = h2 * 60 + m2;

        if (currentMins >= startMins && currentMins < endMins) {
          activeSlot = slot;
          if (el) el.classList.add('active-slot');
        }
      }
    });

    // Update Dashboard preview
    const dashContainer = document.getElementById('dashLiveSlotContainer');
    const badge = document.getElementById('liveSlotStatusBadge');
    if (dashContainer) {
      if (activeSlot) {
        dashContainer.innerHTML = `
          <div style="font-size:1.1rem; font-weight:700; color:var(--color-phy); margin-bottom:0.25rem;">
            ${activeSlot.time}: ${activeSlot.title}
          </div>
          <div style="font-size:0.82rem; color:var(--text-secondary);">
            Subject: <strong>${activeSlot.subject}</strong> | Target: <strong>${activeSlot.type}</strong>
          </div>
        `;
        if (badge) {
          badge.textContent = 'Active Right Now';
          badge.className = 'badge badge-high';
        }
      } else {
        dashContainer.innerHTML = `
          <div style="font-size:0.95rem; color:var(--text-secondary);">
            🌟 You are currently between scheduled slots. Review formulas or take a 10m power walk!
          </div>
        `;
        if (badge) {
          badge.textContent = 'Break / Free Time';
          badge.className = 'badge badge-low';
        }
      }
    }
  }

  toggleRoutineCheck(slotId, checked) {
    const todayStr = new Date().toISOString().split('T')[0];
    if (!this.state.routine.checkedSlots[todayStr]) {
      this.state.routine.checkedSlots[todayStr] = [];
    }
    let list = this.state.routine.checkedSlots[todayStr];
    if (checked) {
      if (!list.includes(slotId)) list.push(slotId);
    } else {
      this.state.routine.checkedSlots[todayStr] = list.filter(id => id !== slotId);
    }
    this.saveState();
    this.renderRoutine();
    this.renderDashboard();
  }

  resetDailyRoutineChecks() {
    const todayStr = new Date().toISOString().split('T')[0];
    this.state.routine.checkedSlots[todayStr] = [];
    this.saveState();
    this.renderRoutine();
    this.renderDashboard();
  }

  changeRoutinePreset(presetName) {
    this.state.routine.preset = presetName;
    this.saveState();
    this.renderRoutine();
    this.renderDashboard();
  }

  handleAddRoutineSlot(e) {
    e.preventDefault();
    const start = document.getElementById('slotStartTime').value;
    const end = document.getElementById('slotEndTime').value;
    const title = document.getElementById('slotTitle').value;
    const subject = document.getElementById('slotSubject').value;
    const type = document.getElementById('slotType').value;

    const newSlot = {
      id: 'custom_' + Date.now(),
      time: `${start} - ${end}`,
      title: title,
      subject: subject,
      type: type
    };

    if (!this.state.routine.customSlots) this.state.routine.customSlots = [];
    this.state.routine.customSlots.push(newSlot);
    this.state.routine.preset = 'custom';
    this.saveState();

    this.closeModal('modalAddSlot');
    e.target.reset();
    this.renderRoutine();
    this.renderDashboard();
  }

  deleteCustomSlot(slotId) {
    this.state.routine.customSlots = this.state.routine.customSlots.filter(s => s.id !== slotId);
    this.saveState();
    this.renderRoutine();
  }

  // 3. TASKS & QUESTION COUNTER
  renderTasks() {
    const container = document.getElementById('tasksChecklistContainer');
    if (!container) return;

    let filtered = this.state.tasks;
    if (this.taskFilterSubject !== 'ALL') {
      filtered = filtered.filter(t => t.subject === this.taskFilterSubject);
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:1.5rem; color:var(--text-muted); font-size:0.88rem;">
          🎯 No tasks found for this filter. Add your daily high-priority study tasks!
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(t => {
      const subBadge = t.subject === 'Physics' ? 'badge-phy' : (t.subject === 'Chemistry' ? 'badge-chem' : (t.subject === 'Mathematics' ? 'badge-math' : 'badge-gen'));
      const prioBadge = t.priority === 'High' ? 'badge-high' : (t.priority === 'Medium' ? 'badge-med' : 'badge-low');
      return `
        <div class="task-item ${t.completed ? 'completed' : ''}">
          <input type="checkbox" class="task-checkbox" ${t.completed ? 'checked' : ''} onchange="app.toggleTaskCompleted('${t.id}', this.checked)">
          <div class="task-text">
            <div>${t.text}</div>
            <div style="display:flex; gap:0.35rem; margin-top:0.25rem;">
              <span class="badge ${subBadge}">${t.subject}</span>
              <span class="badge ${prioBadge}">${t.priority}</span>
            </div>
          </div>
          <button class="btn btn-danger btn-sm" onclick="app.deleteTask('${t.id}')">🗑️</button>
        </div>
      `;
    }).join('');

    // Update Question Page displays
    const today = this.getTodayData();
    const elP = document.getElementById('pagePhyQ');
    if (elP) elP.textContent = today.questions.physics;
    const elC = document.getElementById('pageChemQ');
    if (elC) elC.textContent = today.questions.chemistry;
    const elM = document.getElementById('pageMathQ');
    if (elM) elM.textContent = today.questions.mathematics;
  }

  handleAddTask(e) {
    e.preventDefault();
    const text = document.getElementById('taskInputText').value;
    const subject = document.getElementById('taskInputSubject').value;
    const priority = document.getElementById('taskInputPriority').value;
    const todayStr = new Date().toISOString().split('T')[0];

    const newTask = {
      id: 'task_' + Date.now(),
      text: text,
      subject: subject,
      priority: priority,
      completed: false,
      date: todayStr
    };

    this.state.tasks.unshift(newTask);
    this.saveState();
    this.closeModal('modalAddTask');
    e.target.reset();
    this.renderTasks();
    this.renderDashboard();
  }

  toggleTaskCompleted(taskId, completed) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = completed;
      this.saveState();
      this.renderTasks();
      this.renderDashboard();
    }
  }

  deleteTask(taskId) {
    this.state.tasks = this.state.tasks.filter(t => t.id !== taskId);
    this.saveState();
    this.renderTasks();
    this.renderDashboard();
  }

  filterTasks(sub) {
    this.taskFilterSubject = sub;
    this.renderTasks();
  }

  adjustQuestions(subject, amount) {
    const today = this.getTodayData();
    today.questions[subject] = Math.max(0, today.questions[subject] + amount);
    this.saveState();
    this.renderTasks();
    this.renderDashboard();
    this.renderAnalytics();
  }

  resetDailyQuestions() {
    const today = this.getTodayData();
    today.questions.physics = 0;
    today.questions.chemistry = 0;
    today.questions.mathematics = 0;
    this.saveState();
    this.renderTasks();
    this.renderDashboard();
    this.renderAnalytics();
  }

  // 4. SYLLABUS TRACKER
  switchSyllabusSubject(sub) {
    this.activeSyllabusSubject = sub;
    const btnP = document.getElementById('btnTabPhy');
    const btnC = document.getElementById('btnTabChem');
    const btnM = document.getElementById('btnTabMath');

    if (btnP) btnP.className = 'subject-tab-btn' + (sub === 'physics' ? ' active-phy' : '');
    if (btnC) btnC.className = 'subject-tab-btn' + (sub === 'chemistry' ? ' active-chem' : '');
    if (btnM) btnM.className = 'subject-tab-btn' + (sub === 'mathematics' ? ' active-math' : '');

    this.renderSyllabus();
  }

  renderSyllabus() {
    const container = document.getElementById('syllabusChaptersList');
    if (!container) return;

    const chapters = JEE_SYLLABUS_DATA[this.activeSyllabusSubject] || [];
    const searchVal = (document.getElementById('syllabusSearchInput')?.value || '').toLowerCase();
    const classVal = document.getElementById('syllabusClassFilter')?.value || 'ALL';

    const filtered = chapters.filter(ch => {
      const matchSearch = ch.name.toLowerCase().includes(searchVal) || (ch.topics && ch.topics.some(t => t.toLowerCase().includes(searchVal)));
      const matchClass = classVal === 'ALL' || ch.class.toString() === classVal;
      return matchSearch && matchClass;
    });

    // Update Tab count badges
    const getSubDoneCount = (subKey) => {
      const list = JEE_SYLLABUS_DATA[subKey] || [];
      return list.filter(ch => {
        const p = this.state.syllabusProgress[ch.id];
        return p && (p.pyq5 || p.rev1 || p.mastered);
      }).length;
    };

    const sP = document.getElementById('sylPhyDone');
    if (sP) sP.textContent = getSubDoneCount('physics');
    const sC = document.getElementById('sylChemDone');
    if (sC) sC.textContent = getSubDoneCount('chemistry');
    const sM = document.getElementById('sylMathDone');
    if (sM) sM.textContent = getSubDoneCount('mathematics');

    container.innerHTML = filtered.map(ch => {
      const prog = this.state.syllabusProgress[ch.id] || {
        theory: false, notes: false, practice: false, pyq5: false, pyq10: false, rev1: false, rev2: false, mastered: false
      };
      const weightBadge = ch.weightage === 'High' ? 'badge-high' : (ch.weightage === 'Medium' ? 'badge-med' : 'badge-low');
      return `
        <div class="chapter-card">
          <div class="chapter-header">
            <div>
              <span class="badge ${weightBadge}">${ch.weightage} Weightage</span>
              <span class="badge badge-gen">Class ${ch.class}</span>
              ${ch.branch ? `<span class="badge badge-chem">${ch.branch}</span>` : ''}
              <h4 class="chapter-title" style="margin-top:0.35rem;">${ch.name}</h4>
            </div>
            <label class="milestone-label" style="font-weight:700; color:var(--color-success);">
              <input type="checkbox" ${prog.mastered ? 'checked' : ''} onchange="app.toggleChapterMilestone('${ch.id}', 'mastered', this.checked)">
              🏆 Mastered
            </label>
          </div>

          <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:0.5rem;">
            <strong>Core Topics:</strong> ${ch.topics ? ch.topics.join(' • ') : ''}
          </div>

          <div class="milestone-checks">
            <label class="milestone-label">
              <input type="checkbox" ${prog.theory ? 'checked' : ''} onchange="app.toggleChapterMilestone('${ch.id}', 'theory', this.checked)">
              📖 Theory/Lecture
            </label>
            <label class="milestone-label">
              <input type="checkbox" ${prog.notes ? 'checked' : ''} onchange="app.toggleChapterMilestone('${ch.id}', 'notes', this.checked)">
              📝 Short Notes
            </label>
            <label class="milestone-label">
              <input type="checkbox" ${prog.practice ? 'checked' : ''} onchange="app.toggleChapterMilestone('${ch.id}', 'practice', this.checked)">
              🎯 Module DPPs
            </label>
            <label class="milestone-label">
              <input type="checkbox" ${prog.pyq5 ? 'checked' : ''} onchange="app.toggleChapterMilestone('${ch.id}', 'pyq5', this.checked)">
              🔥 5-Yr PYQs
            </label>
            <label class="milestone-label">
              <input type="checkbox" ${prog.pyq10 ? 'checked' : ''} onchange="app.toggleChapterMilestone('${ch.id}', 'pyq10', this.checked)">
              💎 10-Yr PYQs
            </label>
            <label class="milestone-label">
              <input type="checkbox" ${prog.rev1 ? 'checked' : ''} onchange="app.toggleChapterMilestone('${ch.id}', 'rev1', this.checked)">
              🔄 Rev 1
            </label>
            <label class="milestone-label">
              <input type="checkbox" ${prog.rev2 ? 'checked' : ''} onchange="app.toggleChapterMilestone('${ch.id}', 'rev2', this.checked)">
              ⚡ Rev 2
            </label>
          </div>
        </div>
      `;
    }).join('');
  }

  toggleChapterMilestone(chapId, milestoneKey, value) {
    if (!this.state.syllabusProgress[chapId]) {
      this.state.syllabusProgress[chapId] = {
        theory: false, notes: false, practice: false, pyq5: false, pyq10: false, rev1: false, rev2: false, mastered: false
      };
    }
    this.state.syllabusProgress[chapId][milestoneKey] = value;
    this.saveState();
    this.renderSyllabus();
    this.renderDashboard();
  }

  filterSyllabus() {
    this.renderSyllabus();
  }

  // 5. FOCUS & 3-HOUR EXAM TIMER
  setTimerMode(minutes, label) {
    this.pauseTimer();
    this.timerTotalSeconds = minutes * 60;
    this.timerSecondsRemaining = minutes * 60;
    this.timerCurrentMode = label;
    this.updateTimerDisplay();
  }

  updateTimerDisplay() {
    const mins = Math.floor(this.timerSecondsRemaining / 60);
    const secs = this.timerSecondsRemaining % 60;
    const str = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    const disp = document.getElementById('timerDigitsDisplay');
    if (disp) disp.textContent = str;

    const lbl = document.getElementById('timerModeLabel');
    if (lbl) lbl.textContent = this.timerCurrentMode;

    const btn = document.getElementById('timerToggleBtn');
    if (btn) {
      btn.textContent = this.timerIsRunning ? '⏸️ Pause Focus' : '▶️ Start Focus';
      btn.className = this.timerIsRunning ? 'btn btn-accent' : 'btn btn-primary';
    }
  }

  toggleTimer() {
    if (this.timerIsRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    this.timerIsRunning = true;
    this.updateTimerDisplay();

    this.timerInterval = setInterval(() => {
      if (this.timerSecondsRemaining > 0) {
        this.timerSecondsRemaining--;
        this.updateTimerDisplay();
      } else {
        this.timerFinished();
      }
    }, 1000);
  }

  pauseTimer() {
    this.timerIsRunning = false;
    clearInterval(this.timerInterval);
    this.updateTimerDisplay();
  }

  resetTimer() {
    this.pauseTimer();
    this.timerSecondsRemaining = this.timerTotalSeconds;
    this.updateTimerDisplay();
  }

  timerFinished() {
    this.pauseTimer();
    this.playNotificationSound();

    // Log study time
    const mins = Math.round(this.timerTotalSeconds / 60);
    const sub = document.getElementById('timerSubjectTag')?.value || 'General';
    const today = this.getTodayData();
    today.hours += mins / 60;

    const sessionObj = {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationMins: mins,
      subject: sub,
      mode: this.timerCurrentMode
    };

    today.sessions.unshift(sessionObj);
    this.saveState();

    alert(`🎉 Great job! Completed ${mins} mins of ${sub} Focus Session! Logged into study hours.`);
    this.renderDashboard();
    this.renderTimerSessions();
    this.renderAnalytics();
  }

  renderTimerSessions() {
    const container = document.getElementById('todaySessionsLogList');
    if (!container) return;
    const today = this.getTodayData();

    if (today.sessions.length === 0) {
      container.innerHTML = `<p style="font-size:0.8rem; color:var(--text-muted);">No completed sessions today yet. Start the focus timer!</p>`;
      return;
    }

    container.innerHTML = today.sessions.map(s => `
      <div style="background:var(--bg-input); padding:0.5rem 0.75rem; border-radius:var(--radius-sm); font-size:0.82rem; display:flex; justify-content:space-between;">
        <span><strong>${s.time}</strong> • ${s.subject} (${s.mode})</span>
        <span style="color:var(--color-accent); font-weight:700;">+${s.durationMins}m</span>
      </div>
    `).join('');
  }

  playNotificationSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.log('Audio notification note:', e);
    }
  }

  // 6. MOCK TESTS & MISTAKE BOOK
  renderMockTests() {
    const tbody = document.getElementById('mockTestsTableBody');
    if (!tbody) return;

    if (this.state.mockTests.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:var(--text-muted);">No mock tests logged yet. Click + Log Mock Test to track your progress!</td></tr>`;
      return;
    }

    tbody.innerHTML = this.state.mockTests.map(m => `
      <tr>
        <td><strong>${m.name}</strong></td>
        <td>${m.date}</td>
        <td style="color:var(--color-phy);">${m.phy}</td>
        <td style="color:var(--color-chem);">${m.chem}</td>
        <td style="color:var(--color-math);">${m.math}</td>
        <td style="font-weight:800; color:var(--color-accent);">${m.total}/300</td>
        <td><strong>${m.pct}%</strong></td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="app.deleteMockTest('${m.id}')">🗑️</button>
        </td>
      </tr>
    `).join('');
  }

  handleAddMockTest(e) {
    e.preventDefault();
    const name = document.getElementById('mockInputName').value;
    const date = document.getElementById('mockInputDate').value;
    const phy = Number(document.getElementById('mockInputPhy').value);
    const chem = Number(document.getElementById('mockInputChem').value);
    const math = Number(document.getElementById('mockInputMath').value);

    const total = phy + chem + math;
    const pct = Math.round((total / 300) * 100);

    const newMock = {
      id: 'mock_' + Date.now(),
      name, date, phy, chem, math, total, pct
    };

    this.state.mockTests.push(newMock);
    this.saveState();
    this.closeModal('modalAddMock');
    e.target.reset();
    this.renderMockTests();
    this.renderAnalytics();
  }

  deleteMockTest(mockId) {
    this.state.mockTests = this.state.mockTests.filter(m => m.id !== mockId);
    this.saveState();
    this.renderMockTests();
    this.renderAnalytics();
  }

  renderMistakes() {
    const container = document.getElementById('mistakeBookListContainer');
    if (!container) return;

    if (this.state.mistakes.length === 0) {
      container.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:1rem;">No mistake book entries. Log your errors to avoid repeat negative marks!</p>`;
      return;
    }

    container.innerHTML = this.state.mistakes.map(mk => {
      const subBadge = mk.subject === 'Physics' ? 'badge-phy' : (mk.subject === 'Chemistry' ? 'badge-chem' : 'badge-math');
      return `
        <div style="background:var(--bg-input); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:0.85rem; margin-bottom:0.65rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
            <div>
              <span class="badge ${subBadge}">${mk.subject}</span>
              <span class="badge badge-high">${mk.type}</span>
            </div>
            <button class="btn btn-danger btn-sm" onclick="app.deleteMistake('${mk.id}')">🗑️</button>
          </div>
          <div style="font-size:0.9rem; font-weight:700; margin-bottom:0.25rem;">${mk.chapter}</div>
          <div style="font-size:0.82rem; color:var(--color-accent); background:rgba(245,158,11,0.08); padding:0.4rem 0.6rem; border-radius:var(--radius-sm); border-left:3px solid var(--color-accent);">
            <strong>Takeaway:</strong> ${mk.takeaway}
          </div>
        </div>
      `;
    }).join('');
  }

  handleAddMistake(e) {
    e.preventDefault();
    const subject = document.getElementById('mistakeSubject').value;
    const type = document.getElementById('mistakeType').value;
    const chapter = document.getElementById('mistakeChapter').value;
    const takeaway = document.getElementById('mistakeTakeaway').value;

    const newMistake = {
      id: 'mistake_' + Date.now(),
      subject, type, chapter, takeaway
    };

    this.state.mistakes.unshift(newMistake);
    this.saveState();
    this.closeModal('modalAddMistake');
    e.target.reset();
    this.renderMistakes();
  }

  deleteMistake(id) {
    this.state.mistakes = this.state.mistakes.filter(m => m.id !== id);
    this.saveState();
    this.renderMistakes();
  }

  // 7. FORMULA VAULT
  renderFormulas() {
    const container = document.getElementById('formulaCardsGrid');
    if (!container) return;

    const allFormulas = [...JEE_SYLLABUS_DATA.formulas, ...(this.state.customFormulas || [])];
    const search = (document.getElementById('formulaSearchInput')?.value || '').toLowerCase();

    const filtered = allFormulas.filter(f => {
      const matchSubject = this.formulaFilterSubject === 'ALL' || f.subject.toLowerCase() === this.formulaFilterSubject.toLowerCase();
      const matchSearch = f.title.toLowerCase().includes(search) || f.chapter.toLowerCase().includes(search) || f.formula.toLowerCase().includes(search);
      return matchSubject && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:2rem; color:var(--text-muted);">No formulas found matching your search.</div>`;
      return;
    }

    container.innerHTML = filtered.map(f => {
      const subBadge = f.subject.toLowerCase() === 'physics' ? 'badge-phy' : (f.subject.toLowerCase() === 'chemistry' ? 'badge-chem' : 'badge-math');
      return `
        <div style="background:var(--bg-input); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
            <span class="badge ${subBadge}">${f.subject.toUpperCase()}</span>
            <span style="font-size:0.75rem; color:var(--text-muted);">${f.chapter}</span>
          </div>
          <h4 style="font-size:0.95rem; font-weight:700; margin-bottom:0.4rem;">${f.title}</h4>
          <div style="background:var(--bg-secondary); border:1px solid var(--border-color); padding:0.6rem; border-radius:var(--radius-sm); font-family:monospace; font-size:0.9rem; color:var(--color-phy); word-break:break-all; margin-bottom:0.4rem;">
            ${f.formula}
          </div>
          ${f.note ? `<div style="font-size:0.78rem; color:var(--text-secondary);">💡 ${f.note}</div>` : ''}
          ${f.isCustom ? `<button class="btn btn-danger btn-sm" style="margin-top:0.5rem;" onclick="app.deleteCustomFormula('${f.id}')">Delete</button>` : ''}
        </div>
      `;
    }).join('');
  }

  handleAddFormula(e) {
    e.preventDefault();
    const subject = document.getElementById('formulaSubject').value;
    const chapter = document.getElementById('formulaChapter').value;
    const title = document.getElementById('formulaTitle').value;
    const formula = document.getElementById('formulaExpr').value;
    const note = document.getElementById('formulaNote').value;

    const newF = {
      id: 'f_' + Date.now(),
      subject, chapter, title, formula, note, isCustom: true
    };

    if (!this.state.customFormulas) this.state.customFormulas = [];
    this.state.customFormulas.push(newF);
    this.saveState();
    this.closeModal('modalAddFormula');
    e.target.reset();
    this.renderFormulas();
  }

  deleteCustomFormula(id) {
    this.state.customFormulas = this.state.customFormulas.filter(f => f.id !== id);
    this.saveState();
    this.renderFormulas();
  }

  filterFormulaSubject(sub) {
    this.formulaFilterSubject = sub;
    this.renderFormulas();
  }

  filterFormulas() {
    this.renderFormulas();
  }

  // 8. DEEP CANVAS VISUAL ANALYTICS
  renderAnalytics() {
    this.draw7DayTrend();
    this.drawSubjectBalance();
    this.drawMockProgression();
  }

  draw7DayTrend() {
    const canvas = document.getElementById('canvasDailyTrend');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Get last 7 days labels & values
    const days = [];
    let totalH = 0;
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString([], { weekday: 'short' });
      const stat = this.state.dailyStats[str];
      const h = stat ? stat.hours : 0;
      days.push({ label: dayLabel, hours: h });
      totalH += h;
    }

    const avgH = (totalH / 7).toFixed(1);
    const avgEl = document.getElementById('analyticsAvgHours');
    if (avgEl) avgEl.textContent = `Avg: ${avgH} hrs/day`;

    const maxH = Math.max(12, ...days.map(d => d.hours));
    const padX = 40;
    const padY = 30;
    const chartW = width - padX * 2;
    const chartH = height - padY * 2;

    const barW = chartW / days.length - 15;

    // Draw baseline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padX, height - padY);
    ctx.lineTo(width - padX, height - padY);
    ctx.stroke();

    days.forEach((d, idx) => {
      const x = padX + idx * (chartW / days.length) + 8;
      const barHeight = (d.hours / maxH) * chartH;
      const y = height - padY - barHeight;

      // Gradient Bar
      const grad = ctx.createLinearGradient(0, y, 0, height - padY);
      grad.addColorStop(0, '#0284c7');
      grad.addColorStop(1, '#38bdf8');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barHeight, [4, 4, 0, 0]);
      ctx.fill();

      // Label text
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(d.label, x + barW / 2, height - 10);

      // Value text
      if (d.hours > 0) {
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText(`${d.hours.toFixed(1)}h`, x + barW / 2, y - 6);
      }
    });
  }

  drawSubjectBalance() {
    const canvas = document.getElementById('canvasSubjectBalance');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Sum all sessions by subject
    let phyMins = 30, chemMins = 35, mathMins = 35; // base defaults if fresh
    Object.values(this.state.dailyStats).forEach(ds => {
      if (ds.questions) {
        phyMins += ds.questions.physics * 3;
        chemMins += ds.questions.chemistry * 3;
        mathMins += ds.questions.mathematics * 3;
      }
    });

    const total = phyMins + chemMins + mathMins;
    const angles = [
      { sub: 'Physics', pct: phyMins / total, color: '#38bdf8' },
      { sub: 'Chemistry', pct: chemMins / total, color: '#34d399' },
      { sub: 'Mathematics', pct: mathMins / total, color: '#a78bfa' }
    ];

    const cx = width / 2 - 50;
    const cy = height / 2;
    const r = 70;
    const innerR = 40;

    let startAngle = -Math.PI / 2;

    angles.forEach(item => {
      const sliceAngle = item.pct * 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, startAngle + sliceAngle);
      ctx.arc(cx, cy, innerR, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();
      startAngle += sliceAngle;
    });

    // Legend on the right
    const legX = width / 2 + 40;
    angles.forEach((item, i) => {
      const legY = cy - 30 + i * 28;
      ctx.fillStyle = item.color;
      ctx.fillRect(legX, legY, 12, 12);

      ctx.fillStyle = '#f8fafc';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${item.sub}: ${Math.round(item.pct * 100)}%`, legX + 18, legY + 10);
    });
  }

  drawMockProgression() {
    const canvas = document.getElementById('canvasMockProgression');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const mocks = this.state.mockTests;
    if (mocks.length === 0) {
      ctx.fillStyle = '#64748b';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Log your first mock test to see performance progression curve!', width / 2, height / 2);
      return;
    }

    const padX = 60;
    const padY = 40;
    const chartW = width - padX * 2;
    const chartH = height - padY * 2;

    // Grid lines for 100, 200, 300 marks
    [100, 200, 300].forEach(m => {
      const y = height - padY - (m / 300) * chartH;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(padX, y);
      ctx.lineTo(width - padX, y);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${m}m`, padX - 8, y + 3);
    });

    // Draw Line
    const step = mocks.length > 1 ? chartW / (mocks.length - 1) : chartW / 2;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();

    mocks.forEach((m, idx) => {
      const x = mocks.length === 1 ? width / 2 : padX + idx * step;
      const y = height - padY - (m.total / 300) * chartH;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Points & Labels
    mocks.forEach((m, idx) => {
      const x = mocks.length === 1 ? width / 2 : padX + idx * step;
      const y = height - padY - (m.total / 300) * chartH;

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${m.total}`, x, y - 10);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px sans-serif';
      ctx.fillText(m.name.length > 12 ? m.name.substring(0, 10) + '..' : m.name, x, height - 12);
    });
  }

  // 9. SETTINGS & BACKUP
  exportBackupJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `JEE_Prep_Pro_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  }

  importBackupJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (confirm('Are you sure you want to restore this backup? Current data will be replaced.')) {
          this.state = imported;
          this.saveState();
          alert('Data restored successfully!');
          window.location.reload();
        }
      } catch (err) {
        alert('Invalid JSON backup file!');
      }
    };
    reader.readAsText(file);
  }

  saveExamDate(val) {
    if (val) {
      this.state.targetExamDate = val;
      this.saveState();
      this.updateCountdown();
    }
  }

  resetAllData() {
    if (confirm('⚠️ WARNING: This will permanently wipe all your local tasks, test scores, and syllabus checks. Reset to default?')) {
      localStorage.removeItem(this.STORAGE_KEY);
      this.state = this.getDefaultState();
      this.saveState();
      alert('Reset complete!');
      window.location.reload();
    }
  }

  // Modals helper
  openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  }

  closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  }
}

// Instantiate App globally
const app = new JeeApp();
