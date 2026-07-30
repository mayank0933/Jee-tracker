/* =========================================================
   JEE Daily Tracker — script.js
   ---------------------------------------------------------
   SECTIONS:
   1. Constants & Data Definitions
   2. Date Helpers
   3. Data Layer — Daily Tracker (localStorage)
   4. Data Layer — Subject / Chapter Tracker (localStorage)
   5. Calculations — Progress & Streaks
   6. Rendering — Dashboard
   7. Rendering — Daily Tracker
   8. Rendering — History (list + calendar)
   9. Rendering — Subjects (Subject + Chapter Tracker)
   10. Rendering — Progress
   11. Backup & Restore
   12. Navigation
   13. Init
   ========================================================= */

/* =========================================================
   1. CONSTANTS & DATA DEFINITIONS
   ========================================================= */

const STORAGE_KEY = "jeeTrackerData";           // daily task data
const SUBJECTS_STORAGE_KEY = "jeeTrackerSubjects"; // subject/chapter data

// Daily tracker now has 3 independent lectures + the other 5 tasks = 8 total.
const LECTURE_KEYS = ["lecture1", "lecture2", "lecture3"];
const OTHER_DAILY_KEYS = ["notes", "dpp", "practice", "pyq", "revision"];
const DAILY_TASK_KEYS = [...LECTURE_KEYS, ...OTHER_DAILY_KEYS];

const DAILY_TASK_LABELS = {
  lecture1: "Lecture 1",
  lecture2: "Lecture 2",
  lecture3: "Lecture 3",
  notes: "Notes",
  dpp: "DPP",
  practice: "Question Practice",
  pyq: "PYQ",
  revision: "Revision",
};

// Chapter-level tasks stay as the original 6 (Lecture / Notes / DPP / Practice / PYQ / Revision).
const CHAPTER_TASK_KEYS = ["lecture", "notes", "dpp", "practice", "pyq", "revision"];
const CHAPTER_TASK_LABELS = {
  lecture: "Lecture",
  notes: "Notes",
  dpp: "DPP",
  practice: "Question Practice",
  pyq: "PYQ",
  revision: "Revision",
};

// Latest NTA JEE Main syllabus (Physics / Chemistry / Mathematics), unit-wise.
const SUBJECT_CHAPTERS = {
  physics: [
    "Units and Measurements",
    "Kinematics",
    "Laws of Motion",
    "Work, Energy and Power",
    "Rotational Motion",
    "Gravitation",
    "Mechanical Properties of Solids",
    "Mechanical Properties of Fluids",
    "Thermal Properties of Matter",
    "Thermodynamics",
    "Kinetic Theory of Gases",
    "Oscillations",
    "Waves",
    "Electrostatics",
    "Current Electricity",
    "Magnetic Effects of Current and Magnetism",
    "Electromagnetic Induction and Alternating Currents",
    "Electromagnetic Waves",
    "Ray Optics and Optical Instruments",
    "Wave Optics",
    "Dual Nature of Radiation and Matter",
    "Atoms and Nuclei",
    "Electronic Devices",
    "Experimental Skills",
  ],
  chemistry: [
    "Some Basic Concepts in Chemistry",
    "Atomic Structure",
    "Chemical Bonding and Molecular Structure",
    "Chemical Thermodynamics",
    "Solutions",
    "Equilibrium",
    "Redox Reactions and Electrochemistry",
    "Chemical Kinetics",
    "Classification of Elements and Periodicity",
    "P-Block Elements",
    "D and F Block Elements",
    "Coordination Compounds",
    "Purification and Characterisation of Organic Compounds",
    "Some Basic Principles of Organic Chemistry",
    "Hydrocarbons",
    "Organic Compounds Containing Halogens",
    "Organic Compounds Containing Oxygen",
    "Organic Compounds Containing Nitrogen",
    "Biomolecules",
    "Principles Related to Practical Chemistry",
  ],
  mathematics: [
    "Sets, Relations and Functions",
    "Complex Numbers and Quadratic Equations",
    "Matrices and Determinants",
    "Permutations and Combinations",
    "Binomial Theorem",
    "Sequences and Series",
    "Limit, Continuity and Differentiability",
    "Integral Calculus",
    "Differential Equations",
    "Coordinate Geometry",
    "Three Dimensional Geometry",
    "Vector Algebra",
    "Statistics and Probability",
    "Trigonometry",
  ],
};

const SUBJECT_LABELS = {
  physics: "Physics",
  chemistry: "Chemistry",
  mathematics: "Mathematics",
};

// Motivational quotes shown (rotated daily) on the Dashboard.
const MOTIVATIONAL_QUOTES = [
  "Success is the sum of small efforts repeated day in and day out.",
  "The pain of discipline weighs ounces; the pain of regret weighs tons.",
  "You don't have to be great to start, but you have to start to be great.",
  "Every problem you solve today is one less on exam day.",
  "Consistency beats intensity. Show up again tomorrow.",
  "Hard work in silence, let JEE be the noise.",
  "One more chapter. One more DPP. One step closer.",
  "Discipline is choosing between what you want now and what you want most.",
  "The expert in anything was once a beginner who refused to quit.",
  "Small daily improvements lead to staggering long-term results.",
  "Focus on progress, not perfection.",
  "Your only limit is the one you set on yourself.",
];

// UI-only state (not persisted): which subject tab / which chapters are expanded,
// and which month the History calendar is currently showing.
let currentSubject = "physics";
const expandedChapters = new Set();
let calendarViewDate = new Date(); // first-of-month reference for the calendar
let selectedHistoryDateKey = null; // date currently shown in the History detail panel

/* =========================================================
   2. DATE HELPERS
   ========================================================= */

function getTodayKey() {
  const now = new Date();
  return formatKeyFromDate(now);
}

function formatKeyFromDate(dateObj) {
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const dd = String(dateObj.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function parseKeyToDate(dateKey) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDateDisplay(dateKey) {
  const dateObj = parseKeyToDate(dateKey);
  return dateObj.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateDisplayLong(dateKey) {
  const dateObj = parseKeyToDate(dateKey);
  return dateObj.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getPreviousDateKey(dateKey) {
  const dateObj = parseKeyToDate(dateKey);
  dateObj.setDate(dateObj.getDate() - 1);
  return formatKeyFromDate(dateObj);
}

// Day-of-year number, used to deterministically rotate the motivational quote.
function getDayOfYear(dateObj) {
  const start = new Date(dateObj.getFullYear(), 0, 0);
  const diff = dateObj - start;
  return Math.floor(diff / 86400000);
}

/* =========================================================
   3. DATA LAYER — DAILY TRACKER
   ========================================================= */

function loadAllData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse tracker data:", err);
    return {};
  }
}

function saveAllData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Returns a day's task object, defaulting every key to false.
// Also backfills a single legacy "lecture" field (from before the 3-lecture
// upgrade) into lecture1, so existing history keeps making sense.
function getDayData(dateKey) {
  const allData = loadAllData();
  const existing = allData[dateKey];

  const defaults = {};
  DAILY_TASK_KEYS.forEach((key) => (defaults[key] = false));
  if (!existing) return defaults;

  const merged = { ...defaults, ...existing };
  if (existing.lecture !== undefined && existing.lecture1 === undefined) {
    merged.lecture1 = !!existing.lecture;
  }
  return merged;
}

function saveDayData(dateKey, dayTasks) {
  const allData = loadAllData();
  allData[dateKey] = dayTasks;
  saveAllData(allData);
}

/* =========================================================
   4. DATA LAYER — SUBJECT / CHAPTER TRACKER
   ========================================================= */

function loadSubjectsData() {
  const raw = localStorage.getItem(SUBJECTS_STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to parse subjects data:", err);
    return {};
  }
}

function saveSubjectsData(data) {
  localStorage.setItem(SUBJECTS_STORAGE_KEY, JSON.stringify(data));
}

function getChapterData(subject, chapterName) {
  const allSubjectsData = loadSubjectsData();
  const subjectData = allSubjectsData[subject] || {};
  const existing = subjectData[chapterName];

  const defaults = { lastUpdated: null };
  CHAPTER_TASK_KEYS.forEach((key) => (defaults[key] = false));

  return existing ? { ...defaults, ...existing } : defaults;
}

function saveChapterData(subject, chapterName, chapterTasks) {
  const allSubjectsData = loadSubjectsData();
  if (!allSubjectsData[subject]) allSubjectsData[subject] = {};

  chapterTasks.lastUpdated = getTodayKey();
  allSubjectsData[subject][chapterName] = chapterTasks;

  saveSubjectsData(allSubjectsData);
}

function calculateSubjectProgress(subject) {
  const chapters = SUBJECT_CHAPTERS[subject];
  const totalPossible = chapters.length * CHAPTER_TASK_KEYS.length;
  if (totalPossible === 0) return 0;

  let totalCompleted = 0;
  chapters.forEach((chapterName) => {
    totalCompleted += countCompletedChapterTasks(getChapterData(subject, chapterName));
  });

  return Math.round((totalCompleted / totalPossible) * 100);
}

function calculateOverallSubjectProgress() {
  let totalCompleted = 0;
  let totalPossible = 0;

  Object.keys(SUBJECT_CHAPTERS).forEach((subject) => {
    const chapters = SUBJECT_CHAPTERS[subject];
    totalPossible += chapters.length * CHAPTER_TASK_KEYS.length;
    chapters.forEach((chapterName) => {
      totalCompleted += countCompletedChapterTasks(getChapterData(subject, chapterName));
    });
  });

  if (totalPossible === 0) return 0;
  return Math.round((totalCompleted / totalPossible) * 100);
}

// Total lectures completed across every chapter of every subject (chapter-level "lecture" task).
function calculateTotalChapterLecturesCompleted() {
  let count = 0;
  Object.keys(SUBJECT_CHAPTERS).forEach((subject) => {
    SUBJECT_CHAPTERS[subject].forEach((chapterName) => {
      if (getChapterData(subject, chapterName).lecture) count += 1;
    });
  });
  return count;
}

/* =========================================================
   5. CALCULATIONS — PROGRESS & STREAKS
   ========================================================= */

function countCompletedDailyTasks(dayTasks) {
  return DAILY_TASK_KEYS.reduce((count, key) => count + (dayTasks[key] ? 1 : 0), 0);
}

function countCompletedChapterTasks(chapterTasks) {
  return CHAPTER_TASK_KEYS.reduce((count, key) => count + (chapterTasks[key] ? 1 : 0), 0);
}

function countCompletedLectures(dayTasks) {
  return LECTURE_KEYS.reduce((count, key) => count + (dayTasks[key] ? 1 : 0), 0);
}

// A day counts as "studied" if at least one task was completed.
function isDayStudied(dayTasks) {
  return countCompletedDailyTasks(dayTasks) > 0;
}

// A day counts as "fully completed" if every daily task is checked (used for calendar 🟢).
function isDayFullyCompleted(dayTasks) {
  return countCompletedDailyTasks(dayTasks) === DAILY_TASK_KEYS.length;
}

function calculateOverallProgress(allData) {
  const dateKeys = Object.keys(allData);
  if (dateKeys.length === 0) return 0;

  let totalCompleted = 0;
  let totalPossible = 0;

  dateKeys.forEach((dateKey) => {
    totalCompleted += countCompletedDailyTasks(getDayData(dateKey));
    totalPossible += DAILY_TASK_KEYS.length;
  });

  if (totalPossible === 0) return 0;
  return Math.round((totalCompleted / totalPossible) * 100);
}

function calculateTotalDaysStudied(allData) {
  return Object.keys(allData).filter((dateKey) => isDayStudied(getDayData(dateKey))).length;
}

// Current streak = consecutive "studied" days counting backwards from today.
// If today has no entry yet, start from yesterday so an unfinished "today"
// doesn't wrongly break the streak.
function calculateCurrentStreak(allData) {
  let streak = 0;
  let cursorKey = getTodayKey();

  if (!allData[cursorKey] || !isDayStudied(getDayData(cursorKey))) {
    cursorKey = getPreviousDateKey(cursorKey);
  }

  while (allData[cursorKey] && isDayStudied(getDayData(cursorKey))) {
    streak += 1;
    cursorKey = getPreviousDateKey(cursorKey);
  }

  return streak;
}

// Best streak = the longest run of consecutive studied days found anywhere in history.
function calculateBestStreak(allData) {
  const studiedKeys = Object.keys(allData)
    .filter((dateKey) => isDayStudied(getDayData(dateKey)))
    .sort(); // ascending YYYY-MM-DD sorts chronologically

  if (studiedKeys.length === 0) return 0;

  let best = 1;
  let current = 1;

  for (let i = 1; i < studiedKeys.length; i++) {
    const prevExpected = getPreviousDateKey(studiedKeys[i]);
    if (prevExpected === studiedKeys[i - 1]) {
      current += 1;
    } else {
      current = 1;
    }
    if (current > best) best = current;
  }

  return best;
}

// Returns the Monday-start date of the week containing dateObj.
function getWeekStart(dateObj) {
  const d = new Date(dateObj);
  const day = d.getDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day; // shift so Monday is start
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Weekly summary for the week containing today: tasks completed / possible, days studied.
function calculateWeeklySummary(allData) {
  const weekStart = getWeekStart(new Date());
  let completed = 0;
  let possibleDaysPassed = 0;
  let daysStudied = 0;

  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    if (d > new Date()) break; // don't count future days as "possible" yet
    const key = formatKeyFromDate(d);
    const dayTasks = getDayData(key);
    completed += countCompletedDailyTasks(dayTasks);
    possibleDaysPassed += 1;
    if (isDayStudied(dayTasks)) daysStudied += 1;
  }

  const possibleTasks = possibleDaysPassed * DAILY_TASK_KEYS.length;
  const percent = possibleTasks === 0 ? 0 : Math.round((completed / possibleTasks) * 100);

  return { completed, possibleTasks, percent, daysStudied, possibleDaysPassed };
}

// Monthly summary for the month currently shown in the calendar (defaults to this month).
function calculateMonthlySummary(allData, referenceDate = new Date()) {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
  const daysPassed = isCurrentMonth ? today.getDate() : daysInMonth;

  let completed = 0;
  let daysStudied = 0;

  for (let day = 1; day <= daysPassed; day++) {
    const key = formatKeyFromDate(new Date(year, month, day));
    const dayTasks = getDayData(key);
    completed += countCompletedDailyTasks(dayTasks);
    if (isDayStudied(dayTasks)) daysStudied += 1;
  }

  const possibleTasks = daysPassed * DAILY_TASK_KEYS.length;
  const percent = possibleTasks === 0 ? 0 : Math.round((completed / possibleTasks) * 100);

  return { completed, possibleTasks, percent, daysStudied, daysPassed };
}

/* =========================================================
   6. RENDERING — DASHBOARD
   ========================================================= */

function renderDashboard() {
  const todayKey = getTodayKey();
  const allData = loadAllData();
  const todayTasks = getDayData(todayKey);

  document.getElementById("dashboard-date").textContent = formatDateDisplayLong(todayKey);

  const streak = calculateCurrentStreak(allData);
  document.getElementById("dashboard-streak").textContent = `${streak} ${streak === 1 ? "day" : "days"}`;

  const progress = calculateOverallProgress(allData);
  document.getElementById("dashboard-progress").textContent = `${progress}%`;

  // Today's completed tasks list (all 8 daily tasks)
  const listEl = document.getElementById("dashboard-today-tasks");
  listEl.innerHTML = "";
  DAILY_TASK_KEYS.forEach((key) => {
    const done = !!todayTasks[key];
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="status-icon ${done ? "status-done" : "status-pending"}">${done ? "✓" : "○"}</span>
      <span>${DAILY_TASK_LABELS[key]}</span>
    `;
    listEl.appendChild(li);
  });

  // Today's lecture status row (Lecture 1 / 2 / 3 ✅/❌)
  const lectureRowEl = document.getElementById("dashboard-lecture-status");
  lectureRowEl.innerHTML = LECTURE_KEYS.map((key) => {
    const done = !!todayTasks[key];
    return `
      <div class="lecture-pill ${done ? "lecture-pill-done" : ""}">
        <span class="lecture-pill-icon">${done ? "✅" : "❌"}</span>
        <span>${DAILY_TASK_LABELS[key]}</span>
      </div>
    `;
  }).join("");

  // Motivational quote — rotates deterministically by day of year
  const quoteIndex = getDayOfYear(new Date()) % MOTIVATIONAL_QUOTES.length;
  document.getElementById("dashboard-quote").textContent = `"${MOTIVATIONAL_QUOTES[quoteIndex]}"`;
}

/* =========================================================
   7. RENDERING — DAILY TRACKER
   ========================================================= */

function renderDailyTracker() {
  const todayKey = getTodayKey();
  document.getElementById("daily-date").textContent = formatDateDisplayLong(todayKey);

  const todayTasks = getDayData(todayKey);

  DAILY_TASK_KEYS.forEach((key) => {
    const checkbox = document.getElementById(`task-${key}`);
    if (checkbox) checkbox.checked = !!todayTasks[key];
  });

  updateDailyLectureCount();
  document.getElementById("save-confirmation").textContent = "";
}

// Updates the small "X / 3" lecture counter shown on the Daily page as checkboxes change.
function updateDailyLectureCount() {
  const countEl = document.getElementById("daily-lecture-count");
  if (!countEl) return;
  const completed = LECTURE_KEYS.reduce((count, key) => {
    const cb = document.getElementById(`task-${key}`);
    return count + (cb && cb.checked ? 1 : 0);
  }, 0);
  countEl.textContent = `${completed} / ${LECTURE_KEYS.length}`;
}

function handleSaveToday() {
  const todayKey = getTodayKey();
  const dayTasks = {};

  DAILY_TASK_KEYS.forEach((key) => {
    const checkbox = document.getElementById(`task-${key}`);
    dayTasks[key] = checkbox.checked;
  });

  saveDayData(todayKey, dayTasks);

  const confirmationEl = document.getElementById("save-confirmation");
  confirmationEl.textContent = "Saved for today ✓";

  renderDashboard();
  renderProgress();
  renderHistory();
}

/* =========================================================
   8. RENDERING — HISTORY (list + calendar)
   ========================================================= */

function renderHistory() {
  renderHistoryCalendar();
  renderHistoryList();
}

// ---- Calendar ----

function renderHistoryCalendar() {
  const allData = loadAllData();
  const year = calendarViewDate.getFullYear();
  const month = calendarViewDate.getMonth();

  document.getElementById("calendar-month-label").textContent = calendarViewDate.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Convert JS Sunday-start (0-6) to Monday-start (0-6) for grid offset.
  const startOffset = (firstOfMonth.getDay() + 6) % 7;

  const gridEl = document.getElementById("calendar-grid");
  gridEl.innerHTML = "";

  // Weekday header row
  ["M", "T", "W", "T", "F", "S", "S"].forEach((label) => {
    const headEl = document.createElement("div");
    headEl.className = "calendar-weekday";
    headEl.textContent = label;
    gridEl.appendChild(headEl);
  });

  // Empty leading cells
  for (let i = 0; i < startOffset; i++) {
    const emptyEl = document.createElement("div");
    emptyEl.className = "calendar-cell calendar-cell-empty";
    gridEl.appendChild(emptyEl);
  }

  const todayKey = getTodayKey();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = formatKeyFromDate(new Date(year, month, day));
    const dayTasks = allData[dateKey] ? getDayData(dateKey) : null;

    let statusClass = "calendar-day-none"; // 🔴 no study (or no entry)
    if (dayTasks) {
      if (isDayFullyCompleted(dayTasks)) statusClass = "calendar-day-full"; // 🟢
      else if (isDayStudied(dayTasks)) statusClass = "calendar-day-partial"; // 🟡
    }

    const cellEl = document.createElement("button");
    cellEl.className = `calendar-cell calendar-day ${statusClass}${dateKey === todayKey ? " calendar-day-today" : ""}${dateKey === selectedHistoryDateKey ? " calendar-day-selected" : ""}`;
    cellEl.textContent = String(day);
    cellEl.dataset.dateKey = dateKey;
    cellEl.addEventListener("click", () => {
      selectedHistoryDateKey = dateKey;
      renderHistory();
      const detailEl = document.getElementById("history-day-detail");
      if (detailEl) detailEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    gridEl.appendChild(cellEl);
  }

  renderHistoryDayDetail();
}

function renderHistoryDayDetail() {
  const detailEl = document.getElementById("history-day-detail");
  if (!selectedHistoryDateKey) {
    detailEl.innerHTML = '<p class="empty-state">Tap a date to see details for that day.</p>';
    return;
  }

  const dayTasks = getDayData(selectedHistoryDateKey);
  const completedCount = countCompletedDailyTasks(dayTasks);

  const taskItemsHtml = DAILY_TASK_KEYS.map((key) => {
    const done = !!dayTasks[key];
    return `
      <div class="history-task-item">
        <span class="status-icon ${done ? "status-done" : "status-pending"}">${done ? "✓" : "○"}</span>
        <span>${DAILY_TASK_LABELS[key]}</span>
      </div>
    `;
  }).join("");

  detailEl.innerHTML = `
    <div class="history-day-header">
      <span class="history-day-date">${formatDateDisplay(selectedHistoryDateKey)}</span>
      <span class="history-day-ratio">${completedCount}/${DAILY_TASK_KEYS.length}</span>
    </div>
    <div class="history-task-grid">${taskItemsHtml}</div>
  `;
}

function handleCalendarPrevMonth() {
  calendarViewDate = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() - 1, 1);
  renderHistoryCalendar();
}

function handleCalendarNextMonth() {
  calendarViewDate = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + 1, 1);
  renderHistoryCalendar();
}

// ---- List (chronological, newest first) ----

function renderHistoryList() {
  const allData = loadAllData();
  const historyListEl = document.getElementById("history-list");

  const sortedDateKeys = Object.keys(allData).sort((a, b) => (a < b ? 1 : -1));

  if (sortedDateKeys.length === 0) {
    historyListEl.innerHTML = '<p class="empty-state">No history yet. Start tracking today!</p>';
    return;
  }

  historyListEl.innerHTML = "";

  sortedDateKeys.forEach((dateKey) => {
    const dayTasks = getDayData(dateKey);
    const completedCount = countCompletedDailyTasks(dayTasks);

    const dayCard = document.createElement("div");
    dayCard.className = "history-day-card";

    const taskItemsHtml = DAILY_TASK_KEYS.map((key) => {
      const done = !!dayTasks[key];
      return `
        <div class="history-task-item">
          <span class="status-icon ${done ? "status-done" : "status-pending"}">${done ? "✓" : "○"}</span>
          <span>${DAILY_TASK_LABELS[key]}</span>
        </div>
      `;
    }).join("");

    dayCard.innerHTML = `
      <div class="history-day-header">
        <span class="history-day-date">${formatDateDisplay(dateKey)}</span>
        <span class="history-day-ratio">${completedCount}/${DAILY_TASK_KEYS.length}</span>
      </div>
      <div class="history-task-grid">${taskItemsHtml}</div>
    `;

    historyListEl.appendChild(dayCard);
  });
}

/* =========================================================
   9. RENDERING — SUBJECTS (Subject + Chapter Tracker)
   ========================================================= */

function renderSubjectsPage() {
  document.querySelectorAll(".subject-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.subject === currentSubject);
  });

  document.getElementById("subject-name-label").textContent = SUBJECT_LABELS[currentSubject];
  document.getElementById("subject-progress-value").textContent = `${calculateSubjectProgress(currentSubject)}%`;

  const chapterListEl = document.getElementById("chapter-list");
  chapterListEl.innerHTML = "";

  const chapters = SUBJECT_CHAPTERS[currentSubject];

  chapters.forEach((chapterName) => {
    const chapterTasks = getChapterData(currentSubject, chapterName);
    const completedCount = countCompletedChapterTasks(chapterTasks);
    const isExpanded = expandedChapters.has(chapterName);

    const chapterEl = document.createElement("div");
    chapterEl.className = `chapter-item${isExpanded ? " expanded" : ""}`;

    const checkboxesHtml = CHAPTER_TASK_KEYS.map((key) => {
      return `
        <label class="checkbox-item">
          <input
            type="checkbox"
            data-subject="${currentSubject}"
            data-chapter="${chapterName}"
            data-task="${key}"
            ${chapterTasks[key] ? "checked" : ""}
          />
          <span>${CHAPTER_TASK_LABELS[key]}</span>
        </label>
      `;
    }).join("");

    const lastUpdatedText = chapterTasks.lastUpdated
      ? `Last updated: ${formatDateDisplay(chapterTasks.lastUpdated)}`
      : "Last updated: —";

    chapterEl.innerHTML = `
      <button class="chapter-header" data-chapter-toggle="${chapterName}">
        <span class="chapter-header-left">
          <span class="chapter-name">${chapterName}</span>
        </span>
        <span class="chapter-header-right">
          <span class="chapter-ratio">${completedCount}/${CHAPTER_TASK_KEYS.length}</span>
          <span class="chapter-arrow">${isExpanded ? "▴" : "▾"}</span>
        </span>
      </button>
      <div class="chapter-body">
        <div class="checkbox-list">${checkboxesHtml}</div>
        <p class="chapter-last-updated">${lastUpdatedText}</p>
      </div>
    `;

    chapterListEl.appendChild(chapterEl);
  });

  chapterListEl.querySelectorAll("[data-chapter-toggle]").forEach((headerBtn) => {
    headerBtn.addEventListener("click", () => {
      const chapterName = headerBtn.dataset.chapterToggle;
      if (expandedChapters.has(chapterName)) {
        expandedChapters.delete(chapterName);
      } else {
        expandedChapters.add(chapterName);
      }
      renderSubjectsPage();
    });
  });

  chapterListEl.querySelectorAll("input[type=checkbox]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const { subject, chapter, task } = checkbox.dataset;
      const chapterTasks = getChapterData(subject, chapter);
      chapterTasks[task] = checkbox.checked;
      saveChapterData(subject, chapter, chapterTasks);
      renderSubjectsPage();
    });
  });
}

/* =========================================================
   10. RENDERING — PROGRESS
   ========================================================= */

function renderProgress() {
  const allData = loadAllData();

  const overallProgress = calculateOverallProgress(allData);
  const totalDaysStudied = calculateTotalDaysStudied(allData);
  const currentStreak = calculateCurrentStreak(allData);
  const bestStreak = calculateBestStreak(allData);
  const totalLectures = calculateTotalChapterLecturesCompleted();

  document.getElementById("progress-overall").textContent = `${overallProgress}%`;
  document.getElementById("progress-total-days").textContent = `${totalDaysStudied}`;
  document.getElementById("progress-streak").textContent = `${currentStreak} ${currentStreak === 1 ? "day" : "days"}`;
  document.getElementById("progress-best-streak").textContent = `${bestStreak} ${bestStreak === 1 ? "day" : "days"}`;
  document.getElementById("progress-total-lectures").textContent = `${totalLectures}`;

  // Today's lecture progress (X / 3)
  const todayTasks = getDayData(getTodayKey());
  document.getElementById("progress-today-lectures").textContent = `${countCompletedLectures(todayTasks)} / ${LECTURE_KEYS.length}`;

  // Weekly summary
  const weekly = calculateWeeklySummary(allData);
  document.getElementById("progress-weekly-percent").textContent = `${weekly.percent}%`;
  document.getElementById("progress-weekly-detail").textContent =
    `${weekly.completed}/${weekly.possibleTasks} tasks · ${weekly.daysStudied}/${weekly.possibleDaysPassed} days studied`;

  // Monthly summary
  const monthly = calculateMonthlySummary(allData);
  document.getElementById("progress-monthly-percent").textContent = `${monthly.percent}%`;
  document.getElementById("progress-monthly-detail").textContent =
    `${monthly.completed}/${monthly.possibleTasks} tasks · ${monthly.daysStudied}/${monthly.daysPassed} days studied`;

  // Subject-wise chapter completion percentages
  document.getElementById("progress-physics").textContent = `${calculateSubjectProgress("physics")}%`;
  document.getElementById("progress-chemistry").textContent = `${calculateSubjectProgress("chemistry")}%`;
  document.getElementById("progress-mathematics").textContent = `${calculateSubjectProgress("mathematics")}%`;
  document.getElementById("progress-subjects-overall").textContent = `${calculateOverallSubjectProgress()}%`;
}

/* =========================================================
   11. BACKUP & RESTORE
   ========================================================= */

function handleExportBackup() {
  const backup = {
    jeeTrackerData: loadAllData(),
    jeeTrackerSubjects: loadSubjectsData(),
    exportedAt: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "jee_tracker_backup.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  document.getElementById("backup-status").textContent = "Backup exported ✓";
}

function handleImportBackup(event) {
  const file = event.target.files[0];
  const statusEl = document.getElementById("backup-status");
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const restored = JSON.parse(reader.result);

      if (typeof restored !== "object" || (!restored.jeeTrackerData && !restored.jeeTrackerSubjects)) {
        throw new Error("Unrecognized backup file format");
      }

      if (restored.jeeTrackerData) saveAllData(restored.jeeTrackerData);
      if (restored.jeeTrackerSubjects) saveSubjectsData(restored.jeeTrackerSubjects);

      statusEl.textContent = "Backup restored ✓";

      renderDashboard();
      renderDailyTracker();
      renderHistory();
      renderSubjectsPage();
      renderProgress();
    } catch (err) {
      console.error("Failed to import backup:", err);
      statusEl.textContent = "Import failed — invalid backup file";
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

/* =========================================================
   12. NAVIGATION
   ========================================================= */

function navigateTo(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.toggle("active-page", page.id === pageId);
  });

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === pageId);
  });

  if (pageId === "page-dashboard") renderDashboard();
  if (pageId === "page-daily") renderDailyTracker();
  if (pageId === "page-history") renderHistory();
  if (pageId === "page-subjects") renderSubjectsPage();
  if (pageId === "page-progress") renderProgress();
}

/* =========================================================
   13. INIT
   ========================================================= */

function initApp() {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => navigateTo(btn.dataset.page));
  });

  document.getElementById("save-today-btn").addEventListener("click", handleSaveToday);

  // Live-update the "X / 3" lecture counter on the Daily page as checkboxes are toggled
  LECTURE_KEYS.forEach((key) => {
    const cb = document.getElementById(`task-${key}`);
    if (cb) cb.addEventListener("change", updateDailyLectureCount);
  });

  document.querySelectorAll(".subject-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      currentSubject = tab.dataset.subject;
      renderSubjectsPage();
    });
  });

  document.getElementById("calendar-prev-btn").addEventListener("click", handleCalendarPrevMonth);
  document.getElementById("calendar-next-btn").addEventListener("click", handleCalendarNextMonth);

  document.getElementById("export-backup-btn").addEventListener("click", handleExportBackup);
  document.getElementById("import-backup-btn").addEventListener("click", () => {
    document.getElementById("import-backup-input").click();
  });
  document.getElementById("import-backup-input").addEventListener("change", handleImportBackup);

  renderDashboard();
  renderDailyTracker();
  renderHistory();
  renderSubjectsPage();
  renderProgress();
}

document.addEventListener("DOMContentLoaded", initApp);
