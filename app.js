/**
 * StudyFlow - Mobile-First Syllabus & Progress Tracker
 * Full client-side application logic with:
 * - Working Login & Signup (Dual Instant Local & Supabase Cloud support)
 * - Gamified Level, XP, and Daily Study Streaks
 * - Prominent Exam Date Countdown & Urgency Awareness
 * - Reset to Empty Syllabus (Blank Slate)
 * - Scientific Study Hacks & Motivational Tips
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'studyflow_syllabus_data_v2';
  const THEME_KEY = 'studyflow_theme';
  const SUPABASE_CONFIG_KEY = 'studyflow_supabase_config';
  const LOCAL_ACCOUNTS_KEY = 'studyflow_local_accounts_v1';
  const CURRENT_USER_KEY = 'studyflow_current_user_v1';

  // Optional default credentials for public deployments
  const DEFAULT_SUPABASE_CONFIG = {
    url: '', 
    key: ''
  };

  // Study Hacks & Techniques list
  const STUDY_HACKS = [
    { title: 'Feynman Technique', text: 'Test your mastery by explaining concepts in simple terms without jargon. If you stumble, re-read that topic.' },
    { title: 'Active Recall', text: 'Close your notes and write down everything you remember about a subtopic before checking the answer.' },
    { title: 'Spaced Repetition', text: 'Review concepts after 1 day (R1), 3 days (R2), and 1 week (R3) to lock them permanently into long-term memory.' },
    { title: 'Pomodoro 25/5 Rule', text: '25 minutes of 100% uninterrupted single-tasking followed by a 5-minute break prevents mental fatigue.' },
    { title: 'Pareto 80/20 Rule', text: '80% of exam questions usually come from 20% of core topics. Prioritize High-Priority syllabus concepts first.' },
    { title: 'Interleaving Practice', text: 'Switch between two related modules or problem types in one study block instead of block-practicing just one.' },
    { title: 'Blurting Method', text: 'Quickly write down every formula and diagram from memory on a blank sheet, then highlight gaps in red.' },
    { title: 'Sleep Consolidation', text: 'Your brain replays and solidifies new syllabus memories during deep sleep. Never pull all-nighters before exams.' }
  ];

  // Levels Configuration
  const LEVEL_TIERS = [
    { level: 1, title: 'Novice Scholar', minXP: 0, maxXP: 200 },
    { level: 2, title: 'Diligent Learner', minXP: 200, maxXP: 500 },
    { level: 3, title: 'Master of Focus', minXP: 500, maxXP: 1000 },
    { level: 4, title: 'Exam Gladiator', minXP: 1000, maxXP: 2000 },
    { level: 5, title: 'Syllabus Conqueror', minXP: 2000, maxXP: 5000 }
  ];

  // --- INITIAL SAMPLE DATA ---
  const DEFAULT_DATA = {
    activeSubjectId: 'sub_cs201',
    gamification: {
      xp: 60,
      level: 1,
      streak: 1,
      lastStudyDate: getTodayDate()
    },
    subjects: [
      {
        id: 'sub_cs201',
        code: 'CS201',
        name: 'Data Structures & Algorithms',
        category: 'Computer Science',
        examDate: getFutureDate(14),
        description: 'Core syllabus covering complexity analysis, linear structures, trees, graphs, and dynamic programming.',
        modules: [
          {
            id: 'mod_cs201_1',
            name: 'Module 1: Foundations & Complexity',
            weight: '15%',
            order: 1,
            description: 'Asymptotic notation, recurrence relations, and algorithm paradigms',
            topics: [
              {
                id: 'top_1',
                name: 'Asymptotic Notations (Big-O, Omega, Theta)',
                description: 'Formal definitions, limit tests, growth hierarchies.',
                priority: 'high',
                status: 'completed',
                estHours: 2,
                confidence: 5,
                revisions: { r1: true, r2: true, r3: true },
                notes: 'Big-O represents tight upper bound; Omega represents lower bound.',
                resources: 'https://en.wikipedia.org/wiki/Big_O_notation',
                timeSpentMinutes: 120
              },
              {
                id: 'top_2',
                name: 'Recurrence Relations & Master Theorem',
                description: 'Divide-and-conquer recurrences: Master Theorem cases 1, 2, 3.',
                priority: 'high',
                status: 'completed',
                estHours: 3,
                confidence: 4,
                revisions: { r1: true, r2: true, r3: false },
                notes: 'Compare f(n) with n^(log_b a). Check for polynomial gaps.',
                resources: 'CLRS Chapter 4',
                timeSpentMinutes: 150
              },
              {
                id: 'top_3',
                name: 'Amortized Complexity & Analysis',
                description: 'Accounting method, dynamic array resizing proof.',
                priority: 'medium',
                status: 'in-progress',
                estHours: 2.5,
                confidence: 3,
                revisions: { r1: true, r2: false, r3: false },
                notes: 'Dynamic array doubling has amortized O(1) insertion.',
                resources: 'GeeksforGeeks Guide',
                timeSpentMinutes: 60
              }
            ]
          },
          {
            id: 'mod_cs201_2',
            name: 'Module 2: Trees & Balanced Structures',
            weight: '25%',
            order: 2,
            description: 'BST operations, AVL rotations, Heaps & Priority Queues',
            topics: [
              {
                id: 'top_4',
                name: 'Binary Search Tree (BST) Operations',
                description: 'Insertion, deletion, in-order predecessor/successor.',
                priority: 'high',
                status: 'completed',
                estHours: 2,
                confidence: 4,
                revisions: { r1: true, r2: true, r3: false },
                notes: 'Two-child deletion requires replacement with in-order successor.',
                resources: 'Visualgo.net BST',
                timeSpentMinutes: 90
              },
              {
                id: 'top_5',
                name: 'AVL Trees & Self-Balancing Rotations',
                description: 'Balance factor (-1, 0, 1), LL, RR, LR, and RL rotations.',
                priority: 'high',
                status: 'in-progress',
                estHours: 3.5,
                confidence: 3,
                revisions: { r1: true, r2: false, r3: false },
                notes: 'Height is strictly O(log n). LL & RR are single rotations.',
                resources: 'CLRS Chapter 13',
                timeSpentMinutes: 80
              },
              {
                id: 'top_6',
                name: 'Binary Heaps & Priority Queues',
                description: 'Max/Min heap properties, Build-Heap in O(n) time.',
                priority: 'medium',
                status: 'not-started',
                estHours: 2.5,
                confidence: 2,
                revisions: { r1: false, r2: false, r3: false },
                notes: 'Build-Heap is O(n) due to sum of heights series.',
                resources: 'CLRS Chapter 6',
                timeSpentMinutes: 0
              }
            ]
          },
          {
            id: 'mod_cs201_3',
            name: 'Module 3: Graph Traversal & Shortest Paths',
            weight: '30%',
            order: 3,
            description: 'BFS, DFS, topological sorting, Dijkstra, MST',
            topics: [
              {
                id: 'top_7',
                name: 'Graph Representation & BFS / DFS',
                description: 'Adjacency list trade-offs, cycle detection.',
                priority: 'high',
                status: 'completed',
                estHours: 3,
                confidence: 5,
                revisions: { r1: true, r2: true, r3: true },
                notes: 'DFS uses recursion; BFS uses queue.',
                resources: 'LeetCode Graph Card',
                timeSpentMinutes: 180
              },
              {
                id: 'top_8',
                name: 'Dijkstra’s Algorithm with Min-Heap',
                description: 'Single-source shortest path for non-negative weights.',
                priority: 'high',
                status: 'needs-revision',
                estHours: 3,
                confidence: 3,
                revisions: { r1: true, r2: false, r3: false },
                notes: 'Fails on negative weight edges! Use Bellman-Ford.',
                resources: 'CLRS Chapter 24',
                timeSpentMinutes: 75
              }
            ]
          },
          {
            id: 'mod_cs201_4',
            name: 'Module 4: Dynamic Programming',
            weight: '30%',
            order: 4,
            description: 'Optimal substructure, overlapping subproblems',
            topics: [
              {
                id: 'top_9',
                name: '0/1 Knapsack Problem',
                description: 'Recurrence relation, 2D table to 1D array optimization.',
                priority: 'high',
                status: 'in-progress',
                estHours: 3,
                confidence: 4,
                revisions: { r1: true, r2: true, r3: false },
                notes: 'Iterate backwards when space optimizing to 1D.',
                resources: 'NeetCode DP Playlist',
                timeSpentMinutes: 110
              },
              {
                id: 'top_10',
                name: 'Longest Common Subsequence (LCS)',
                description: 'String alignment, state transitions.',
                priority: 'medium',
                status: 'not-started',
                estHours: 3.5,
                confidence: 2,
                revisions: { r1: false, r2: false, r3: false },
                notes: 'If match: 1 + dp[i-1][j-1], else max(dp[i-1][j], dp[i][j-1]).',
                resources: 'CLRS Chapter 15',
                timeSpentMinutes: 0
              }
            ]
          }
        ]
      },
      {
        id: 'sub_web305',
        code: 'CS305',
        name: 'Full-Stack Web Engineering',
        category: 'Software Engineering',
        examDate: getFutureDate(30),
        description: 'Modern full-stack web development: CSS layouts, modern JS, REST APIs, and databases.',
        modules: [
          {
            id: 'mod_web_1',
            name: 'Module 1: Frontend Architecture',
            weight: '30%',
            order: 1,
            description: 'Semantic HTML, CSS Flexbox/Grid, Responsive Design',
            topics: [
              {
                id: 'top_web_1',
                name: 'CSS Flexbox & CSS Grid Alignment',
                description: 'Flex-direction, justify-content, grid-template-areas.',
                priority: 'high',
                status: 'completed',
                estHours: 2,
                confidence: 5,
                revisions: { r1: true, r2: true, r3: true },
                notes: 'Flexbox is 1D; Grid is 2D.',
                resources: 'MDN Web Docs',
                timeSpentMinutes: 120
              }
            ]
          }
        ]
      }
    ]
  };

  function getTodayDate() {
    return new Date().toISOString().split('T')[0];
  }

  function getFutureDate(daysAhead) {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  }

  // --- STATE ---
  let appState = loadLocalState();
  let currentFilter = {
    status: 'all',
    search: ''
  };
  let collapsedModules = new Set();
  let currentActiveTab = 'syllabus';
  let currentTipIndex = 0;

  // --- STUDENT AUTHENTICATION STATE (DUAL LOCAL & CLOUD) ---
  let supabaseClient = null;
  let currentUser = loadCurrentUser(); // Can be Local Account OR Supabase Session

  function loadCurrentUser() {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }

  function saveCurrentUser(user) {
    currentUser = user;
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
    updateAuthUI();
  }

  function getLocalAccounts() {
    try {
      const saved = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  function saveLocalAccounts(accounts) {
    localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
  }

  function initSupabase() {
    try {
      let config = null;
      const savedConfig = localStorage.getItem(SUPABASE_CONFIG_KEY);
      if (savedConfig) {
        config = JSON.parse(savedConfig);
      } else if (DEFAULT_SUPABASE_CONFIG.url && DEFAULT_SUPABASE_CONFIG.key) {
        config = DEFAULT_SUPABASE_CONFIG;
      }

      if (config && config.url && config.key && window.supabase) {
        supabaseClient = window.supabase.createClient(config.url, config.key);
        checkSupabaseAuth();
        return;
      }
    } catch (e) {
      console.warn('Supabase initialization note:', e);
    }
    updateAuthUI();
  }

  async function checkSupabaseAuth() {
    if (!supabaseClient) return;
    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (session && session.user) {
        currentUser = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
          isCloud: true
        };
        saveCurrentUser(currentUser);
        loadStudentCloudData();
      }

      supabaseClient.auth.onAuthStateChange((_event, session) => {
        if (session && session.user) {
          currentUser = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
            isCloud: true
          };
          saveCurrentUser(currentUser);
          loadStudentCloudData();
        }
      });
    } catch (e) {}
  }

  function updateAuthUI() {
    const dot = document.getElementById('header-status-dot');
    const syncBanner = document.getElementById('cloud-sync-banner');
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const profileAvatarChar = document.getElementById('profile-avatar-char');
    const profileStatusBadge = document.getElementById('profile-status-badge');
    const authActions = document.getElementById('profile-auth-actions');
    const loggedInControls = document.getElementById('profile-logged-in-controls');
    const authNoticeText = document.getElementById('auth-mode-text');

    if (currentUser) {
      const displayName = currentUser.name || currentUser.email.split('@')[0];
      if (dot) dot.className = 'w-2 h-2 rounded-full bg-emerald-500 absolute top-1 right-1 ring-2 ring-white dark:ring-slate-900';
      if (profileName) profileName.textContent = displayName;
      if (profileEmail) profileEmail.textContent = currentUser.email;
      if (profileAvatarChar) profileAvatarChar.textContent = displayName.charAt(0).toUpperCase();

      if (currentUser.isCloud) {
        if (syncBanner) syncBanner.classList.remove('hidden');
        if (profileStatusBadge) {
          profileStatusBadge.textContent = 'Cloud Active';
          profileStatusBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400';
        }
      } else {
        if (syncBanner) syncBanner.classList.add('hidden');
        if (profileStatusBadge) {
          profileStatusBadge.textContent = 'Student Account';
          profileStatusBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400';
        }
      }

      if (authActions) authActions.classList.add('hidden');
      if (loggedInControls) loggedInControls.classList.remove('hidden');
    } else {
      if (dot) dot.className = 'w-2 h-2 rounded-full bg-amber-400 absolute top-1 right-1 ring-2 ring-white dark:ring-slate-900';
      if (syncBanner) syncBanner.classList.add('hidden');
      if (profileName) profileName.textContent = 'Guest Student';
      if (profileEmail) profileEmail.textContent = 'Offline Storage Mode';
      if (profileAvatarChar) profileAvatarChar.textContent = 'G';
      if (profileStatusBadge) {
        profileStatusBadge.textContent = 'Guest';
        profileStatusBadge.className = 'px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400';
      }
      if (authActions) authActions.classList.remove('hidden');
      if (loggedInControls) loggedInControls.classList.add('hidden');
    }

    if (authNoticeText) {
      if (supabaseClient) {
        authNoticeText.textContent = 'Supabase Cloud Sync is active.';
      } else {
        authNoticeText.textContent = 'Instant Student Account (Works offline & locally).';
      }
    }
  }

  // --- GAMIFICATION ENGINE (XP, LEVELS & STREAKS) ---
  function initGamification() {
    if (!appState.gamification) {
      appState.gamification = {
        xp: 0,
        level: 1,
        streak: 1,
        lastStudyDate: getTodayDate()
      };
    }

    // Check study streak
    const today = getTodayDate();
    const lastDate = appState.gamification.lastStudyDate;
    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastDate === yesterdayStr) {
        appState.gamification.streak = (appState.gamification.streak || 1) + 1;
      }
      appState.gamification.lastStudyDate = today;
      saveLocalState();
    }

    renderGamificationUI();
  }

  function addXP(amount, actionLabel) {
    if (!appState.gamification) initGamification();
    const oldLevel = appState.gamification.level;
    appState.gamification.xp = (appState.gamification.xp || 0) + amount;

    // Determine current level
    let currentTier = LEVEL_TIERS[0];
    for (const tier of LEVEL_TIERS) {
      if (appState.gamification.xp >= tier.minXP) {
        currentTier = tier;
      }
    }
    appState.gamification.level = currentTier.level;

    saveLocalState();
    renderGamificationUI();

    // Level up check!
    if (currentTier.level > oldLevel) {
      playChime('success');
      triggerCelebration();
      showToast(`🎉 LEVEL UP! You reached Level ${currentTier.level}: ${currentTier.title}!`);
    } else {
      showToast(`+${amount} XP (${actionLabel})`);
    }
  }

  function renderGamificationUI() {
    if (!appState.gamification) return;
    const { xp, level, streak } = appState.gamification;

    const currentTier = LEVEL_TIERS.find(t => t.level === level) || LEVEL_TIERS[LEVEL_TIERS.length - 1];
    const nextTier = LEVEL_TIERS.find(t => t.level === level + 1);

    const levelBadge = document.getElementById('gamify-level-badge');
    const levelTitle = document.getElementById('gamify-level-title');
    const xpText = document.getElementById('gamify-xp-text');
    const xpBar = document.getElementById('gamify-xp-bar');
    const streakCount = document.getElementById('gamify-streak-count');

    if (levelBadge) levelBadge.textContent = `Lv.${level}`;
    if (levelTitle) levelTitle.textContent = currentTier.title;

    if (nextTier) {
      const tierSpan = nextTier.minXP - currentTier.minXP;
      const progressXP = xp - currentTier.minXP;
      const pct = Math.min(100, Math.max(5, Math.round((progressXP / tierSpan) * 100)));
      if (xpText) xpText.textContent = `${xp} / ${nextTier.minXP} XP`;
      if (xpBar) xpBar.style.width = `${pct}%`;
    } else {
      if (xpText) xpText.textContent = `${xp} XP (MAX)`;
      if (xpBar) xpBar.style.width = '100%';
    }

    if (streakCount) streakCount.textContent = streak || 1;
  }

  // --- MOTIVATIONAL STUDY TIPS CAROUSEL ---
  function showNextStudyTip() {
    currentTipIndex = (currentTipIndex + 1) % STUDY_HACKS.length;
    const tip = STUDY_HACKS[currentTipIndex];
    const tipText = document.getElementById('study-tip-text');
    if (tipText) {
      tipText.innerHTML = `<strong>${tip.title}:</strong> ${tip.text}`;
    }
  }

  const studyTipPill = document.getElementById('study-tip-pill');
  if (studyTipPill) {
    studyTipPill.addEventListener('click', () => {
      showNextStudyTip();
      playChime('chime-soft');
    });
  }

  // --- CLOUD SYNC OPERATIONS ---
  async function loadStudentCloudData() {
    if (!supabaseClient || !currentUser || !currentUser.isCloud) return;
    try {
      showToast('Syncing with cloud database...', 'cloud');
      
      const { data: dbSubjects, error: subError } = await supabaseClient
        .from('subjects')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: true });

      if (subError) throw subError;

      if (dbSubjects && dbSubjects.length > 0) {
        const fullSubjects = [];

        for (const sub of dbSubjects) {
          const { data: dbMods } = await supabaseClient
            .from('modules')
            .select('*')
            .eq('subject_id', sub.id)
            .order('order_index', { ascending: true });

          const modules = [];
          for (const mod of dbMods || []) {
            const { data: dbTopics } = await supabaseClient
              .from('topics')
              .select('*')
              .eq('module_id', mod.id);

            const topics = [];
            for (const t of dbTopics || []) {
              const { data: dbProg } = await supabaseClient
                .from('student_progress')
                .select('*')
                .eq('topic_id', t.id)
                .maybeSingle();

              topics.push({
                id: t.id,
                name: t.name,
                description: t.description || '',
                priority: t.priority || 'medium',
                estHours: parseFloat(t.est_hours) || 2,
                status: dbProg ? dbProg.status : 'not-started',
                confidence: dbProg ? dbProg.confidence : 0,
                revisions: {
                  r1: dbProg ? dbProg.rev_1 : false,
                  r2: dbProg ? dbProg.rev_2 : false,
                  r3: dbProg ? dbProg.rev_3 : false
                },
                timeSpentMinutes: dbProg ? dbProg.time_spent_minutes : 0,
                notes: dbProg ? (dbProg.notes || '') : '',
                resources: dbProg ? (dbProg.resources || '') : ''
              });
            }

            modules.push({
              id: mod.id,
              name: mod.name,
              weight: mod.weight || '',
              order: mod.order_index || 1,
              description: mod.description || '',
              topics: topics
            });
          }

          fullSubjects.push({
            id: sub.id,
            code: sub.code || '',
            name: sub.name,
            category: sub.category || '',
            examDate: sub.exam_date || '',
            description: sub.description || '',
            modules: modules
          });
        }

        appState.subjects = fullSubjects;
        if (!appState.subjects.some(s => s.id === appState.activeSubjectId)) {
          appState.activeSubjectId = appState.subjects[0]?.id || null;
        }
        saveLocalState();
        renderSubjectSelector();
        renderHeroBanner();
        renderStats();
        renderModulesAndTopics();
        populateTimerTopics();
        showToast('Cloud progress synced! ☁️');
      } else {
        uploadCurrentStateToCloud();
      }
    } catch (err) {
      console.warn('Cloud sync note:', err);
    }
  }

  async function uploadCurrentStateToCloud() {
    if (!supabaseClient || !currentUser || !currentUser.isCloud) return;
    try {
      for (const sub of appState.subjects) {
        const { data: subData, error: subErr } = await supabaseClient
          .from('subjects')
          .insert({
            user_id: currentUser.id,
            code: sub.code,
            name: sub.name,
            category: sub.category,
            exam_date: sub.examDate || null,
            description: sub.description
          })
          .select()
          .single();

        if (subErr) throw subErr;
        const newSubId = subData.id;

        for (const mod of sub.modules || []) {
          const { data: modData, error: modErr } = await supabaseClient
            .from('modules')
            .insert({
              subject_id: newSubId,
              user_id: currentUser.id,
              name: mod.name,
              weight: mod.weight,
              order_index: mod.order || 1,
              description: mod.description
            })
            .select()
            .single();

          if (modErr) throw modErr;
          const newModId = modData.id;

          for (const topic of mod.topics || []) {
            const { data: topicData, error: topicErr } = await supabaseClient
              .from('topics')
              .insert({
                module_id: newModId,
                user_id: currentUser.id,
                name: topic.name,
                priority: topic.priority || 'medium',
                est_hours: topic.estHours || 2,
                description: topic.description
              })
              .select()
              .single();

            if (topicErr) throw topicErr;

            await supabaseClient
              .from('student_progress')
              .insert({
                user_id: currentUser.id,
                topic_id: topicData.id,
                status: topic.status || 'not-started',
                confidence: topic.confidence || 0,
                rev_1: topic.revisions?.r1 || false,
                rev_2: topic.revisions?.r2 || false,
                rev_3: topic.revisions?.r3 || false,
                time_spent_minutes: topic.timeSpentMinutes || 0,
                notes: topic.notes || '',
                resources: topic.resources || ''
              });
          }
        }
      }
      showToast('Syllabus saved to cloud database! ☁️');
    } catch (e) {
      console.warn('Upload state note:', e);
    }
  }

  // --- AUDIO SYNTHESIZER ---
  function playChime(type = 'success') {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (type === 'success') {
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.1);
          osc.stop(ctx.currentTime + idx * 0.1 + 0.35);
        });
      } else if (type === 'chime-soft') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 587.33; // D5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      } else if (type === 'timer-done') {
        const freqs = [880, 880, 880];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.25);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.25 + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.25);
          osc.stop(ctx.currentTime + idx * 0.25 + 0.22);
        });
      }
    } catch (e) {}
  }

  function triggerCelebration() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 90,
        spread: 65,
        origin: { y: 0.6 }
      });
    }
  }

  // --- PERSISTENCE ---
  function loadLocalState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.subjects && Array.isArray(parsed.subjects)) {
          return parsed;
        }
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }

  function saveLocalState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }

  function saveState() {
    saveLocalState();
  }

  function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.remove('opacity-0', '-translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');
    
    setTimeout(() => {
      toast.classList.add('opacity-0', '-translate-y-4');
      toast.classList.remove('opacity-100', 'translate-y-0');
    }, 2200);
  }

  // --- GETTERS & METRICS ---
  function getActiveSubject() {
    if (!appState.subjects || appState.subjects.length === 0) return null;
    let subject = appState.subjects.find(s => s.id === appState.activeSubjectId);
    if (!subject) {
      appState.activeSubjectId = appState.subjects[0].id;
      subject = appState.subjects[0];
    }
    return subject;
  }

  function getSubjectStats(subject) {
    if (!subject || !subject.modules) {
      return {
        totalModules: 0,
        completedModules: 0,
        inProgressModules: 0,
        totalTopics: 0,
        completedTopics: 0,
        completionPct: 0,
        r1Count: 0,
        r2Count: 0,
        r3Count: 0,
        totalRevisions: 0,
        totalTimeSpentMinutes: 0,
        avgConfidence: '0'
      };
    }

    let totalTopics = 0;
    let completedTopics = 0;
    let r1Count = 0;
    let r2Count = 0;
    let r3Count = 0;
    let totalTimeSpentMinutes = 0;
    let sumConfidence = 0;
    let ratedTopicsCount = 0;
    let completedModules = 0;
    let inProgressModules = 0;

    subject.modules.forEach(mod => {
      const modTopics = mod.topics || [];
      const modTotal = modTopics.length;
      let modCompleted = 0;

      modTopics.forEach(t => {
        totalTopics++;
        if (t.status === 'completed') {
          completedTopics++;
          modCompleted++;
        }
        if (t.revisions) {
          if (t.revisions.r1) r1Count++;
          if (t.revisions.r2) r2Count++;
          if (t.revisions.r3) r3Count++;
        }
        if (t.timeSpentMinutes) {
          totalTimeSpentMinutes += t.timeSpentMinutes;
        }
        if (t.confidence && t.confidence > 0) {
          sumConfidence += t.confidence;
          ratedTopicsCount++;
        }
      });

      if (modTotal > 0 && modCompleted === modTotal) {
        completedModules++;
      } else if (modCompleted > 0 || modTopics.some(t => t.status === 'in-progress')) {
        inProgressModules++;
      }
    });

    const completionPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    const avgConfidence = ratedTopicsCount > 0 ? (sumConfidence / ratedTopicsCount).toFixed(1) : '0';

    return {
      totalModules: subject.modules.length,
      completedModules,
      inProgressModules,
      totalTopics,
      completedTopics,
      completionPct,
      r1Count,
      r2Count,
      r3Count,
      totalRevisions: r1Count + r2Count + r3Count,
      totalTimeSpentMinutes,
      avgConfidence
    };
  }

  // --- MOBILE BOTTOM TAB SWITCHER ---
  function switchMobileTab(targetTab) {
    currentActiveTab = targetTab;
    const screens = {
      syllabus: document.getElementById('screen-syllabus'),
      timer: document.getElementById('screen-timer'),
      analytics: document.getElementById('screen-analytics'),
      profile: document.getElementById('screen-profile')
    };

    Object.keys(screens).forEach(tab => {
      if (screens[tab]) {
        if (tab === targetTab) {
          screens[tab].classList.remove('hidden');
        } else {
          screens[tab].classList.add('hidden');
        }
      }
    });

    document.querySelectorAll('.mobile-tab-btn').forEach(btn => {
      const tab = btn.dataset.targetTab;
      if (tab === targetTab) {
        btn.className = 'mobile-tab-btn flex flex-col items-center justify-center flex-1 py-1 text-indigo-600 dark:text-indigo-400 touch-press';
      } else {
        btn.className = 'mobile-tab-btn flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 touch-press';
      }
    });

    if (targetTab === 'timer') {
      populateTimerTopics();
      updatePomodoroDisplay();
    } else if (targetTab === 'analytics') {
      renderStats();
    }

    if (window.lucide) window.lucide.createIcons();
  }

  document.querySelectorAll('.mobile-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchMobileTab(btn.dataset.targetTab));
  });

  const headerAvatarBtn = document.getElementById('header-avatar-btn');
  if (headerAvatarBtn) {
    headerAvatarBtn.addEventListener('click', () => switchMobileTab('profile'));
  }

  // --- RENDER FUNCTIONS ---
  function renderSubjectSelector() {
    const selector = document.getElementById('subject-selector');
    if (!selector) return;

    selector.innerHTML = '';
    if (!appState.subjects || appState.subjects.length === 0) {
      selector.innerHTML = '<option value="">+ No Course (Tap to add)</option>';
      return;
    }

    appState.subjects.forEach(sub => {
      const opt = document.createElement('option');
      opt.value = sub.id;
      opt.textContent = `${sub.code ? sub.code + ': ' : ''}${sub.name}`;
      if (sub.id === appState.activeSubjectId) {
        opt.selected = true;
      }
      selector.appendChild(opt);
    });
  }

  function renderHeroBanner() {
    const subject = getActiveSubject();
    const heroCard = document.getElementById('subject-banner');
    const urgencyBanner = document.getElementById('exam-urgency-banner');
    const urgencyText = document.getElementById('exam-urgency-text');
    const countdownPill = document.getElementById('btn-hero-exam-pill');
    const countdownText = document.getElementById('exam-countdown-text');
    const analyticsExamDate = document.getElementById('analytics-exam-date');

    if (!subject) {
      if (heroCard) {
        document.getElementById('subject-title').textContent = 'No Subject Selected';
        document.getElementById('subject-desc').textContent = 'Create your first course to track syllabus progress.';
        document.getElementById('subject-code-badge').textContent = 'START';
      }
      if (countdownText) countdownText.textContent = 'Set Exam Date';
      if (urgencyBanner) urgencyBanner.classList.add('hidden');
      if (analyticsExamDate) analyticsExamDate.textContent = 'No Subject';
      return;
    }

    document.getElementById('subject-title').textContent = subject.name;
    document.getElementById('subject-desc').textContent = subject.description || 'Module syllabus & review.';
    document.getElementById('subject-code-badge').textContent = subject.code || 'COURSE';

    // Exam Awareness & Days Remaining
    if (subject.examDate) {
      const examDate = new Date(subject.examDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      examDate.setHours(0, 0, 0, 0);
      const diffTime = examDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (analyticsExamDate) {
        analyticsExamDate.textContent = `${subject.examDate} (${diffDays > 0 ? diffDays + ' days left' : 'Today/Passed'})`;
      }

      if (diffDays > 0) {
        countdownText.textContent = `${diffDays} day${diffDays === 1 ? '' : 's'} left`;
        countdownPill.className = 'flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-400 text-slate-950 shadow-sm touch-press';

        if (diffDays <= 3) {
          urgencyText.textContent = `⚠️ EXAM IN ${diffDays} DAYS! Final Revision Mode: Focus on high priority topics!`;
          urgencyBanner.classList.remove('hidden');
        } else if (diffDays <= 7) {
          urgencyText.textContent = `⚡ 1 Week Remaining: Complete Revision Passes (R2 & R3).`;
          urgencyBanner.classList.remove('hidden');
        } else {
          urgencyBanner.classList.add('hidden');
        }
      } else if (diffDays === 0) {
        countdownText.textContent = `🔥 Exam is TODAY!`;
        countdownPill.className = 'flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-extrabold bg-rose-500 text-white shadow-md touch-press animate-pulse';
        urgencyText.textContent = `🎯 Final Exam Day! Stay calm, trust your preparation. You've got this!`;
        urgencyBanner.classList.remove('hidden');
      } else {
        countdownText.textContent = `Exam Passed`;
        countdownPill.className = 'flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-white/20 text-white shadow-sm touch-press';
        urgencyBanner.classList.add('hidden');
      }
    } else {
      countdownText.textContent = 'Set Exam Date';
      countdownPill.className = 'flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-500/80 text-white border border-white/20 touch-press';
      if (urgencyBanner) urgencyBanner.classList.add('hidden');
      if (analyticsExamDate) analyticsExamDate.textContent = 'Not Scheduled';
    }
  }

  function renderStats() {
    const subject = getActiveSubject();
    const stats = getSubjectStats(subject);

    // Syllabus tab mini stats
    document.getElementById('stat-completion-pct').textContent = `${stats.completionPct}%`;
    document.getElementById('stat-topics-fraction').textContent = `(${stats.completedTopics}/${stats.totalTopics} topics)`;
    document.getElementById('stat-progress-bar').style.width = `${stats.completionPct}%`;

    // Analytics tab metrics
    document.getElementById('stat-modules-completed').textContent = stats.completedModules;
    document.getElementById('stat-modules-total').textContent = `/ ${stats.totalModules} units`;
    document.getElementById('stat-in-progress-text').textContent = `${stats.inProgressModules} modules active`;

    document.getElementById('stat-revision-count').textContent = `${stats.totalRevisions} total`;
    document.getElementById('badge-rev-1').textContent = stats.r1Count;
    document.getElementById('badge-rev-2').textContent = stats.r2Count;
    document.getElementById('badge-rev-3').textContent = stats.r3Count;

    const hours = (stats.totalTimeSpentMinutes / 60).toFixed(1);
    document.getElementById('stat-study-time').textContent = `${hours}h`;
    document.getElementById('stat-avg-confidence').textContent = `${stats.avgConfidence} / 5`;
  }

  function renderModulesAndTopics() {
    const container = document.getElementById('modules-container');
    const emptyState = document.getElementById('empty-state');
    if (!container) return;

    const subject = getActiveSubject();
    if (!subject || !subject.modules || subject.modules.length === 0) {
      container.innerHTML = `
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 text-center border border-dashed border-slate-300 dark:border-slate-800">
          <i data-lucide="layers" class="w-8 h-8 text-indigo-500 mx-auto mb-2"></i>
          <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200">${!subject ? 'No courses added yet' : 'Empty Syllabus'}</h4>
          <p class="text-xs text-slate-400 mt-1 max-w-xs mx-auto">${!subject ? 'Tap "+" above to add your first course.' : 'Tap "+" above to add modules or import your syllabus outline.'}</p>
        </div>
      `;
      if (emptyState) emptyState.classList.add('hidden');
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    container.innerHTML = '';
    let totalVisibleTopics = 0;

    subject.modules.forEach(mod => {
      const modTopics = mod.topics || [];
      const totalModTopics = modTopics.length;
      const completedModTopics = modTopics.filter(t => t.status === 'completed').length;
      const modPct = totalModTopics > 0 ? Math.round((completedModTopics / totalModTopics) * 100) : 0;

      // Filtering
      const filteredTopics = modTopics.filter(topic => {
        if (currentFilter.status !== 'all' && currentFilter.status !== topic.status) return false;
        if (currentFilter.search) {
          const q = currentFilter.search.toLowerCase();
          const matchName = topic.name.toLowerCase().includes(q);
          const matchDesc = topic.description && topic.description.toLowerCase().includes(q);
          if (!matchName && !matchDesc) return false;
        }
        return true;
      });

      totalVisibleTopics += filteredTopics.length;
      const isFiltering = currentFilter.status !== 'all' || currentFilter.search !== '';
      if (isFiltering && filteredTopics.length === 0) return;

      const isCollapsed = collapsedModules.has(mod.id);

      const moduleCard = document.createElement('div');
      moduleCard.className = 'bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xs border border-slate-200 dark:border-slate-800 transition-all';
      moduleCard.dataset.moduleId = mod.id;

      moduleCard.innerHTML = `
        <div class="p-3.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40">
          <div class="flex items-center space-x-2 flex-1 min-w-0 toggle-module-btn cursor-pointer" data-module-id="${mod.id}">
            <i data-lucide="${isCollapsed ? 'chevron-right' : 'chevron-down'}" class="w-4 h-4 text-slate-400 shrink-0"></i>
            <div class="min-w-0">
              <h3 class="font-extrabold text-xs text-slate-800 dark:text-slate-100 truncate">${escapeHtml(mod.name)}</h3>
              <p class="text-[10px] text-slate-400">${completedModTopics}/${totalModTopics} done • ${modPct}%</p>
            </div>
          </div>

          <div class="flex items-center space-x-1 shrink-0">
            <button title="Mark module done" class="btn-complete-module p-1.5 text-slate-400 hover:text-emerald-500 touch-press" data-module-id="${mod.id}">
              <i data-lucide="check-check" class="w-4 h-4"></i>
            </button>
            <button title="Add topic" class="btn-add-topic-to-mod p-1.5 text-slate-400 hover:text-indigo-600 touch-press" data-module-id="${mod.id}">
              <i data-lucide="plus" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <div class="module-content ${isCollapsed ? 'hidden' : 'block'} p-3 space-y-2">
          ${filteredTopics.length > 0 ? `
            <div class="space-y-2">
              ${filteredTopics.map(topic => renderTopicCardHtml(topic, mod.id)).join('')}
            </div>
          ` : `
            <div class="py-4 text-center text-[11px] text-slate-400">
              ${totalModTopics === 0 ? 'No topics in this module. Tap "+" to add one.' : 'No topics match current filter.'}
            </div>
          `}
        </div>
      `;

      container.appendChild(moduleCard);
    });

    if (emptyState) {
      if (totalVisibleTopics === 0 && subject.modules.length > 0) {
        emptyState.classList.remove('hidden');
      } else {
        emptyState.classList.add('hidden');
      }
    }

    if (window.lucide) window.lucide.createIcons();
    bindModuleAndTopicEvents();
  }

  function renderTopicCardHtml(topic, moduleId) {
    const statusConfig = {
      'completed': {
        badgeClass: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300',
        label: 'Done',
        icon: 'check-circle'
      },
      'in-progress': {
        badgeClass: 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300',
        label: 'In Prog',
        icon: 'clock'
      },
      'needs-revision': {
        badgeClass: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300',
        label: 'Revise',
        icon: 'alert-circle'
      },
      'not-started': {
        badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-500',
        label: 'Pending',
        icon: 'circle'
      }
    };

    const currentStatus = statusConfig[topic.status] || statusConfig['not-started'];

    let starsHtml = '';
    const rating = topic.confidence || 0;
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= rating;
      starsHtml += `
        <span class="star-btn ${isFilled ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'}" 
              data-topic-id="${topic.id}" data-rating="${i}">★</span>
      `;
    }

    const r1 = topic.revisions && topic.revisions.r1;
    const r2 = topic.revisions && topic.revisions.r2;
    const r3 = topic.revisions && topic.revisions.r3;

    return `
      <div class="topic-card bg-slate-50 dark:bg-slate-950/60 rounded-xl p-3 border border-slate-200/70 dark:border-slate-800 space-y-2" data-topic-id="${topic.id}" data-module-id="${moduleId}">
        
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-start space-x-2 min-w-0 flex-1">
            <button class="btn-cycle-status shrink-0 mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-extrabold flex items-center space-x-1 ${currentStatus.badgeClass} touch-press" data-topic-id="${topic.id}">
              <i data-lucide="${currentStatus.icon}" class="w-3 h-3"></i>
              <span>${currentStatus.label}</span>
            </button>
            <div class="min-w-0">
              <h4 class="font-extrabold text-xs text-slate-800 dark:text-slate-100 leading-snug ${topic.status === 'completed' ? 'line-through text-slate-400 dark:text-slate-500' : ''}">${escapeHtml(topic.name)}</h4>
              ${topic.description ? `<p class="text-[10px] text-slate-400 mt-0.5 line-clamp-1">${escapeHtml(topic.description)}</p>` : ''}
            </div>
          </div>

          <button class="btn-open-notes text-slate-400 hover:text-indigo-600 p-1 shrink-0 touch-press" data-topic-id="${topic.id}" title="Study Notes">
            <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
          </button>
        </div>

        <div class="flex items-center justify-between pt-1.5 border-t border-slate-200/50 dark:border-slate-800/60">
          <div class="flex items-center space-x-0.5">
            <button class="btn-toggle-revision px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${r1 ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}" data-topic-id="${topic.id}" data-rev="r1">R1</button>
            <button class="btn-toggle-revision px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${r2 ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}" data-topic-id="${topic.id}" data-rev="r2">R2</button>
            <button class="btn-toggle-revision px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${r3 ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}" data-topic-id="${topic.id}" data-rev="r3">R3</button>
          </div>

          <div class="flex items-center text-xs select-none">
            ${starsHtml}
          </div>

          <button class="btn-topic-pomodoro flex items-center space-x-1 text-[10px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md touch-press" data-topic-id="${topic.id}" data-topic-name="${escapeHtml(topic.name)}">
            <i data-lucide="timer" class="w-3 h-3"></i>
            <span>Focus</span>
          </button>
        </div>

      </div>
    `;
  }

  // --- TOPIC STATUS & REVISION HANDLERS ---
  function findTopicAndModule(topicId) {
    const subject = getActiveSubject();
    if (!subject || !subject.modules) return null;
    for (const mod of subject.modules) {
      const topic = mod.topics.find(t => t.id === topicId);
      if (topic) return { topic, module: mod, subject };
    }
    return null;
  }

  function cycleTopicStatus(topicId) {
    const res = findTopicAndModule(topicId);
    if (!res) return;

    const seq = ['not-started', 'in-progress', 'completed', 'needs-revision'];
    const idx = seq.indexOf(res.topic.status || 'not-started');
    const next = seq[(idx + 1) % seq.length];
    res.topic.status = next;

    if (next === 'completed') {
      if (!res.topic.revisions) res.topic.revisions = {};
      if (!res.topic.revisions.r1) res.topic.revisions.r1 = true;
      playChime('success');
      addXP(50, 'Completed Topic');
    } else {
      showToast(`Status: ${next.replace('-', ' ')}`);
    }

    saveState();
    renderStats();
    renderHeroBanner();
    renderModulesAndTopics();
  }

  function toggleTopicRevision(topicId, revKey) {
    const res = findTopicAndModule(topicId);
    if (!res) return;
    if (!res.topic.revisions) res.topic.revisions = {};
    res.topic.revisions[revKey] = !res.topic.revisions[revKey];

    if (res.topic.revisions[revKey]) {
      addXP(25, `Revision ${revKey.toUpperCase()}`);
    } else {
      showToast(`Revision ${revKey.toUpperCase()} updated`);
    }

    saveState();
    renderStats();
    renderModulesAndTopics();
  }

  function setTopicConfidence(topicId, rating) {
    const res = findTopicAndModule(topicId);
    if (!res) return;
    res.topic.confidence = res.topic.confidence === rating ? 0 : rating;

    if (res.topic.confidence > 0) {
      addXP(10, `${res.topic.confidence}★ Mastery`);
    }

    saveState();
    renderStats();
    renderModulesAndTopics();
  }

  function bindModuleAndTopicEvents() {
    document.querySelectorAll('.toggle-module-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const modId = btn.dataset.moduleId;
        if (collapsedModules.has(modId)) {
          collapsedModules.delete(modId);
        } else {
          collapsedModules.add(modId);
        }
        renderModulesAndTopics();
      });
    });

    document.querySelectorAll('.btn-complete-module').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const modId = btn.dataset.moduleId;
        const subject = getActiveSubject();
        const mod = subject.modules.find(m => m.id === modId);
        if (mod && mod.topics) {
          const allDone = mod.topics.every(t => t.status === 'completed');
          const newStatus = allDone ? 'not-started' : 'completed';
          mod.topics.forEach(t => {
            t.status = newStatus;
            if (newStatus === 'completed') {
              if (!t.revisions) t.revisions = {};
              t.revisions.r1 = true;
            }
          });
          saveState();
          renderStats();
          renderModulesAndTopics();
          if (newStatus === 'completed') {
            playChime('success');
            triggerCelebration();
            addXP(150, 'Module Mastered!');
          }
        }
      });
    });

    document.querySelectorAll('.btn-add-topic-to-mod').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openAddTopicModal(btn.dataset.moduleId);
      });
    });

    document.querySelectorAll('.btn-cycle-status').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        cycleTopicStatus(btn.dataset.topicId);
      });
    });

    document.querySelectorAll('.btn-toggle-revision').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTopicRevision(btn.dataset.topicId, btn.dataset.rev);
      });
    });

    document.querySelectorAll('.star-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        setTopicConfidence(btn.dataset.topicId, parseInt(btn.dataset.rating, 10));
      });
    });

    document.querySelectorAll('.btn-open-notes').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openNotesModal(btn.dataset.topicId);
      });
    });

    document.querySelectorAll('.btn-topic-pomodoro').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        startPomodoroForTopic(btn.dataset.topicId, btn.dataset.topicName);
      });
    });
  }

  // --- POMODORO FOCUS TIMER (MOBILE SCREEN) ---
  let pomodoroInterval = null;
  let pomodoroSecondsLeft = 25 * 60;
  let pomodoroTotalDuration = 25 * 60;
  let isPomodoroRunning = false;
  let pomodoroActiveTopicId = null;

  function updatePomodoroDisplay() {
    const minutes = Math.floor(pomodoroSecondsLeft / 60);
    const seconds = pomodoroSecondsLeft % 60;
    const str = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const display = document.getElementById('pomodoro-timer');
    if (display) display.textContent = str;

    const ring = document.getElementById('timer-progress-ring');
    if (ring) {
      const circumference = 276.46; // 2 * pi * 44
      const progressFraction = pomodoroSecondsLeft / pomodoroTotalDuration;
      const offset = circumference * (1 - progressFraction);
      ring.style.strokeDashoffset = offset;
    }

    const navDot = document.getElementById('nav-timer-indicator');
    if (navDot) {
      if (isPomodoroRunning) navDot.classList.remove('hidden');
      else navDot.classList.add('hidden');
    }
  }

  function startPomodoro() {
    if (isPomodoroRunning) return;
    isPomodoroRunning = true;

    document.getElementById('pomo-play-text').textContent = 'Pause';
    const icon = document.getElementById('pomo-play-icon');
    if (icon) icon.setAttribute('data-lucide', 'pause');
    if (window.lucide) window.lucide.createIcons();

    pomodoroInterval = setInterval(() => {
      if (pomodoroSecondsLeft > 0) {
        pomodoroSecondsLeft--;
        updatePomodoroDisplay();
      } else {
        clearInterval(pomodoroInterval);
        isPomodoroRunning = false;
        playChime('timer-done');
        triggerCelebration();

        // Award +100 XP for completing a Pomodoro focus!
        addXP(100, '25m Focus Session');

        if (pomodoroActiveTopicId) {
          const res = findTopicAndModule(pomodoroActiveTopicId);
          if (res) {
            const mins = Math.round(pomodoroTotalDuration / 60);
            res.topic.timeSpentMinutes = (res.topic.timeSpentMinutes || 0) + mins;
            if (res.topic.status === 'not-started') res.topic.status = 'in-progress';
            saveState();
            renderStats();
            renderModulesAndTopics();
            showToast(`Logged +${mins}m to "${res.topic.name}"`);
          }
        }
        resetPomodoro(false);
      }
    }, 1000);
  }

  function pausePomodoro() {
    if (!isPomodoroRunning) return;
    clearInterval(pomodoroInterval);
    isPomodoroRunning = false;
    document.getElementById('pomo-play-text').textContent = 'Resume';
    const icon = document.getElementById('pomo-play-icon');
    if (icon) icon.setAttribute('data-lucide', 'play');
    if (window.lucide) window.lucide.createIcons();
    updatePomodoroDisplay();
  }

  function resetPomodoro(resetTime = true) {
    clearInterval(pomodoroInterval);
    isPomodoroRunning = false;
    if (resetTime) {
      pomodoroSecondsLeft = pomodoroTotalDuration;
    }
    document.getElementById('pomo-play-text').textContent = 'Start Focus';
    const icon = document.getElementById('pomo-play-icon');
    if (icon) icon.setAttribute('data-lucide', 'play');
    if (window.lucide) window.lucide.createIcons();
    updatePomodoroDisplay();
  }

  function startPomodoroForTopic(topicId, topicName) {
    pomodoroActiveTopicId = topicId;
    document.getElementById('pomodoro-active-topic').textContent = `Topic: ${topicName}`;
    switchMobileTab('timer');
    const select = document.getElementById('timer-topic-select');
    if (select) select.value = topicId;
    resetPomodoro(true);
    startPomodoro();
  }

  function populateTimerTopics() {
    const select = document.getElementById('timer-topic-select');
    if (!select) return;
    const subject = getActiveSubject();
    select.innerHTML = '<option value="">-- General Revision (No Topic) --</option>';
    if (subject && subject.modules) {
      subject.modules.forEach(m => {
        m.topics.forEach(t => {
          const opt = document.createElement('option');
          opt.value = t.id;
          opt.textContent = `${m.name.split(':')[0]}: ${t.name}`;
          if (t.id === pomodoroActiveTopicId) opt.selected = true;
          select.appendChild(opt);
        });
      });
    }
  }

  const selectTimerTopic = document.getElementById('timer-topic-select');
  if (selectTimerTopic) {
    selectTimerTopic.addEventListener('change', (e) => {
      pomodoroActiveTopicId = e.target.value || null;
      if (pomodoroActiveTopicId) {
        const res = findTopicAndModule(pomodoroActiveTopicId);
        if (res) document.getElementById('pomodoro-active-topic').textContent = `Topic: ${res.topic.name}`;
      } else {
        document.getElementById('pomodoro-active-topic').textContent = 'Session: General Syllabus Revision';
      }
    });
  }

  document.getElementById('btn-pomo-toggle').addEventListener('click', () => {
    if (isPomodoroRunning) pausePomodoro();
    else startPomodoro();
  });

  document.getElementById('btn-pomo-reset').addEventListener('click', () => {
    resetPomodoro(true);
  });

  document.getElementById('pomo-mode-focus').addEventListener('click', function () {
    setPomodoroMode(25 * 60, this);
  });
  document.getElementById('pomo-mode-short').addEventListener('click', function () {
    setPomodoroMode(5 * 60, this);
  });
  document.getElementById('pomo-mode-long').addEventListener('click', function () {
    setPomodoroMode(15 * 60, this);
  });

  function setPomodoroMode(seconds, activeBtn) {
    pomodoroTotalDuration = seconds;
    pomodoroSecondsLeft = seconds;
    resetPomodoro(true);

    const buttons = [
      document.getElementById('pomo-mode-focus'),
      document.getElementById('pomo-mode-short'),
      document.getElementById('pomo-mode-long')
    ];
    buttons.forEach(btn => {
      btn.className = 'flex-1 py-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200';
    });
    activeBtn.className = 'flex-1 py-1.5 rounded-xl bg-indigo-600 text-white shadow-xs font-bold';
  }

  // --- MOBILE BOTTOM SHEETS ---
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      if (window.lucide) window.lucide.createIcons();
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('hidden');
  }

  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[id^="modal-"]').forEach(m => m.classList.add('hidden'));
    });
  });

  document.querySelectorAll('[id^="modal-"]').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  });

  // Quick Actions Button
  const btnOpenQuick = document.getElementById('btn-open-quick-actions');
  if (btnOpenQuick) {
    btnOpenQuick.addEventListener('click', () => openModal('modal-quick-actions'));
  }

  document.getElementById('btn-sheet-add-topic').addEventListener('click', () => {
    closeModal('modal-quick-actions');
    openAddTopicModal();
  });
  document.getElementById('btn-sheet-add-module').addEventListener('click', () => {
    closeModal('modal-quick-actions');
    openAddModuleModal();
  });
  document.getElementById('btn-sheet-import').addEventListener('click', () => {
    closeModal('modal-quick-actions');
    openModal('modal-quick-import');
  });
  document.getElementById('btn-sheet-add-subject').addEventListener('click', () => {
    closeModal('modal-quick-actions');
    openAddSubjectModal();
  });

  // --- 1. TOPIC MODAL ---
  function populateTopicModuleSelect(selectedModuleId) {
    const subject = getActiveSubject();
    const select = document.getElementById('input-topic-module-select');
    select.innerHTML = '';
    if (!subject || !subject.modules) return;
    subject.modules.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = m.name;
      if (m.id === selectedModuleId) opt.selected = true;
      select.appendChild(opt);
    });
  }

  function openAddTopicModal(targetModuleId) {
    const subject = getActiveSubject();
    if (!subject || !subject.modules || subject.modules.length === 0) {
      alert('Please add a module first.');
      return;
    }

    const modId = targetModuleId || subject.modules[0].id;
    populateTopicModuleSelect(modId);

    document.getElementById('modal-topic-title').textContent = 'Add Topic';
    document.getElementById('input-topic-id').value = '';
    document.getElementById('input-topic-module-id').value = modId;
    document.getElementById('input-topic-name').value = '';
    document.getElementById('input-topic-priority').value = 'medium';
    document.getElementById('input-topic-status').value = 'not-started';
    document.getElementById('input-topic-est-hours').value = '2';
    document.getElementById('input-topic-desc').value = '';

    openModal('modal-topic');
  }

  document.getElementById('form-topic').addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = getActiveSubject();
    if (!subject) return;

    const targetModuleId = document.getElementById('input-topic-module-select').value;
    const name = document.getElementById('input-topic-name').value.trim();
    const priority = document.getElementById('input-topic-priority').value;
    const status = document.getElementById('input-topic-status').value;
    const estHours = parseFloat(document.getElementById('input-topic-est-hours').value) || 1;
    const desc = document.getElementById('input-topic-desc').value.trim();

    if (!name) return;

    const targetMod = subject.modules.find(m => m.id === targetModuleId);
    if (targetMod) {
      targetMod.topics.push({
        id: 'top_' + Date.now(),
        name,
        description: desc,
        priority,
        status,
        estHours,
        confidence: 0,
        revisions: { r1: status === 'completed', r2: false, r3: false },
        notes: '',
        resources: '',
        timeSpentMinutes: 0
      });
      addXP(50, 'Created Topic');
      showToast('Topic added to syllabus');
    }

    saveState();
    closeModal('modal-topic');
    renderStats();
    renderModulesAndTopics();
    populateTimerTopics();
  });

  // --- 2. MODULE MODAL ---
  function openAddModuleModal() {
    const subject = getActiveSubject();
    if (!subject) {
      alert('Please create a course first.');
      return;
    }

    document.getElementById('modal-module-title').textContent = 'Add Module';
    document.getElementById('input-module-id').value = '';
    document.getElementById('input-module-name').value = `Module ${(subject.modules?.length || 0) + 1}: `;
    document.getElementById('input-module-weight').value = '25%';
    document.getElementById('input-module-order').value = (subject.modules?.length || 0) + 1;
    document.getElementById('input-module-desc').value = '';
    openModal('modal-module');
  }

  document.getElementById('form-module').addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = getActiveSubject();
    if (!subject) return;

    const name = document.getElementById('input-module-name').value.trim();
    const weight = document.getElementById('input-module-weight').value.trim();
    const order = parseInt(document.getElementById('input-module-order').value, 10) || 1;
    const desc = document.getElementById('input-module-desc').value.trim();

    if (!name) return;
    if (!subject.modules) subject.modules = [];

    subject.modules.push({
      id: 'mod_' + Date.now(),
      name,
      weight,
      order,
      description: desc,
      topics: []
    });

    subject.modules.sort((a, b) => (a.order || 0) - (b.order || 0));

    saveState();
    closeModal('modal-module');
    renderStats();
    renderModulesAndTopics();
    showToast('Module created');
  });

  // --- 3. COURSE / SUBJECT MODAL (With Date of Exam) ---
  function openAddSubjectModal(existingSubject = null) {
    if (existingSubject) {
      document.getElementById('modal-subject-title').textContent = 'Edit Course & Exam Date';
      document.getElementById('input-subject-id').value = existingSubject.id;
      document.getElementById('input-subject-name').value = existingSubject.name || '';
      document.getElementById('input-subject-code').value = existingSubject.code || '';
      document.getElementById('input-subject-exam-date').value = existingSubject.examDate || '';
      document.getElementById('input-subject-desc').value = existingSubject.description || '';
      document.getElementById('btn-delete-subject').classList.remove('hidden');
    } else {
      document.getElementById('modal-subject-title').textContent = 'Add Course & Exam Date';
      document.getElementById('input-subject-id').value = '';
      document.getElementById('input-subject-name').value = '';
      document.getElementById('input-subject-code').value = '';
      document.getElementById('input-subject-exam-date').value = getFutureDate(30);
      document.getElementById('input-subject-desc').value = '';
      document.getElementById('btn-delete-subject').classList.add('hidden');
    }
    openModal('modal-subject');
  }

  // Trigger from Hero Exam Pill or Analytics Edit Exam
  const btnHeroExamPill = document.getElementById('btn-hero-exam-pill');
  if (btnHeroExamPill) {
    btnHeroExamPill.addEventListener('click', () => {
      const subject = getActiveSubject();
      if (subject) openAddSubjectModal(subject);
      else openAddSubjectModal();
    });
  }

  const btnAnalyticsEditExam = document.getElementById('btn-analytics-edit-exam');
  if (btnAnalyticsEditExam) {
    btnAnalyticsEditExam.addEventListener('click', () => {
      const subject = getActiveSubject();
      if (subject) openAddSubjectModal(subject);
      else openAddSubjectModal();
    });
  }

  document.getElementById('form-subject').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('input-subject-id').value;
    const name = document.getElementById('input-subject-name').value.trim();
    const code = document.getElementById('input-subject-code').value.trim();
    const examDate = document.getElementById('input-subject-exam-date').value;
    const desc = document.getElementById('input-subject-desc').value.trim();

    if (!name) return;

    if (id) {
      const existing = appState.subjects.find(s => s.id === id);
      if (existing) {
        existing.name = name;
        existing.code = code;
        existing.examDate = examDate;
        existing.description = desc;
        showToast('Exam date & course updated! 🎯');
      }
    } else {
      const newSub = {
        id: 'sub_' + Date.now(),
        code: code || 'COURSE',
        name: name,
        category: 'General',
        examDate: examDate,
        description: desc,
        modules: []
      };
      if (!appState.subjects) appState.subjects = [];
      appState.subjects.push(newSub);
      appState.activeSubjectId = newSub.id;
      showToast('New course created with exam countdown!');
    }

    saveState();
    closeModal('modal-subject');
    renderSubjectSelector();
    renderHeroBanner();
    renderStats();
    renderModulesAndTopics();
  });

  // Delete subject
  document.getElementById('btn-delete-subject').addEventListener('click', () => {
    const id = document.getElementById('input-subject-id').value;
    if (!id) return;
    if (confirm('Delete this course and its syllabus?')) {
      appState.subjects = appState.subjects.filter(s => s.id !== id);
      appState.activeSubjectId = appState.subjects[0]?.id || null;
      saveState();
      closeModal('modal-subject');
      renderSubjectSelector();
      renderHeroBanner();
      renderStats();
      renderModulesAndTopics();
      showToast('Course deleted');
    }
  });

  // --- 4. NOTES MODAL ---
  function openNotesModal(topicId) {
    const res = findTopicAndModule(topicId);
    if (!res) return;

    document.getElementById('notes-topic-id').value = res.topic.id;
    document.getElementById('notes-module-badge').textContent = res.module.name.split(':')[0];
    document.getElementById('notes-topic-title').textContent = res.topic.name;
    document.getElementById('notes-content').value = res.topic.notes || '';
    document.getElementById('notes-resources').value = res.topic.resources || '';

    const btnFocus = document.getElementById('btn-start-focus-from-notes');
    btnFocus.onclick = () => {
      closeModal('modal-notes');
      startPomodoroForTopic(res.topic.id, res.topic.name);
    };

    openModal('modal-notes');
  }

  document.getElementById('btn-save-notes').addEventListener('click', () => {
    const topicId = document.getElementById('notes-topic-id').value;
    const res = findTopicAndModule(topicId);
    if (res) {
      res.topic.notes = document.getElementById('notes-content').value;
      res.topic.resources = document.getElementById('notes-resources').value;
      saveState();
      renderModulesAndTopics();
      closeModal('modal-notes');
      addXP(15, 'Saved Notes');
    }
  });

  // --- 5. SMART TEXT IMPORTER ---
  document.getElementById('btn-load-sample-syllabus').addEventListener('click', () => {
    const sample = `Module 1: Principles of Operating Systems
- Process Lifecycle and State Transitions
- CPU Scheduling Algorithms: FCFS, Round Robin, SRTF
- Deadlocks: Banker's Algorithm and Resource Graphs

Module 2: Memory Management & Paging
- Contiguous Allocation & Fragmentation
- Page Replacement: FIFO, Optimal & LRU
- Virtual Memory Architecture`;
    document.getElementById('quick-import-textarea').value = sample;
  });

  document.getElementById('btn-execute-import').addEventListener('click', () => {
    const text = document.getElementById('quick-import-textarea').value.trim();
    if (!text) return;

    const appendMode = document.getElementById('import-append-mode').checked;
    let subject = getActiveSubject();

    if (!subject) {
      subject = {
        id: 'sub_' + Date.now(),
        code: 'COURSE',
        name: 'My Course Syllabus',
        category: 'General',
        examDate: getFutureDate(30),
        description: 'Imported syllabus outline.',
        modules: []
      };
      appState.subjects = [subject];
      appState.activeSubjectId = subject.id;
    }

    const lines = text.split('\n');
    const parsedModules = [];
    let currentMod = null;
    let orderCounter = 1;

    for (let rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      const isModuleHeader = /^(module|unit|chapter|section|part)\b/i.test(line) ||
                             /^(\d+\.|\b[A-Z\s]{4,}:)/.test(line) && !line.startsWith('-');

      if (isModuleHeader) {
        currentMod = {
          id: 'mod_' + Date.now() + '_' + orderCounter,
          name: line,
          weight: '25%',
          order: orderCounter++,
          description: '',
          topics: []
        };
        parsedModules.push(currentMod);
      } else {
        let cleanTopicName = line.replace(/^[\*\-\•\–\—\d\.\)\s]+/, '').trim();
        if (!cleanTopicName) continue;

        if (!currentMod) {
          currentMod = {
            id: 'mod_' + Date.now() + '_' + orderCounter,
            name: `Module ${orderCounter}: Core Concepts`,
            weight: '100%',
            order: orderCounter++,
            description: '',
            topics: []
          };
          parsedModules.push(currentMod);
        }

        currentMod.topics.push({
          id: 'top_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          name: cleanTopicName,
          description: '',
          priority: 'medium',
          status: 'not-started',
          estHours: 2,
          confidence: 0,
          revisions: { r1: false, r2: false, r3: false },
          notes: '',
          resources: '',
          timeSpentMinutes: 0
        });
      }
    }

    if (parsedModules.length === 0) return;

    if (appendMode && subject.modules) {
      subject.modules.push(...parsedModules);
    } else {
      subject.modules = parsedModules;
    }

    saveState();
    closeModal('modal-quick-import');
    renderSubjectSelector();
    renderHeroBanner();
    renderStats();
    renderModulesAndTopics();
    populateTimerTopics();
    triggerCelebration();
    addXP(100, 'Imported Syllabus');
  });

  // --- 6. WORKING AUTHENTICATION (DUAL LOCAL & CLOUD) ---
  const btnOpenLogin = document.getElementById('btn-open-login');
  if (btnOpenLogin) btnOpenLogin.addEventListener('click', () => openModal('modal-auth'));

  const tabLogin = document.getElementById('tab-btn-login');
  const tabSignup = document.getElementById('tab-btn-signup');
  const formLogin = document.getElementById('form-login');
  const formSignup = document.getElementById('form-signup');

  tabLogin.addEventListener('click', () => {
    tabLogin.className = 'flex-1 py-2 text-indigo-600 border-b-2 border-indigo-600';
    tabSignup.className = 'flex-1 py-2 text-slate-400 border-b-2 border-transparent';
    formLogin.classList.remove('hidden');
    formSignup.classList.add('hidden');
  });

  tabSignup.addEventListener('click', () => {
    tabSignup.className = 'flex-1 py-2 text-indigo-600 border-b-2 border-indigo-600';
    tabLogin.className = 'flex-1 py-2 text-slate-400 border-b-2 border-transparent';
    formSignup.classList.remove('hidden');
    formLogin.classList.add('hidden');
  });

  // Handle Login (Checks Supabase or Local Accounts)
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('input-login-email').value.trim();
    const password = document.getElementById('input-login-password').value;

    if (supabaseClient) {
      // Authenticate via Supabase Cloud
      try {
        showToast('Signing in via Supabase...');
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        currentUser = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.full_name || data.user.email.split('@')[0],
          isCloud: true
        };
        saveCurrentUser(currentUser);
        closeModal('modal-auth');
        showToast(`Welcome back, ${currentUser.name}! 🎉`);
        loadStudentCloudData();
        return;
      } catch (err) {
        showToast(err.message || 'Cloud login failed, trying local account...');
      }
    }

    // Authenticate via Local Student Accounts
    const localAccounts = getLocalAccounts();
    const found = localAccounts.find(a => a.email.toLowerCase() === email.toLowerCase());

    if (!found) {
      // Auto-create local account if testing!
      const newAcc = {
        id: 'usr_' + Date.now(),
        email: email,
        name: email.split('@')[0],
        password: password,
        createdAt: new Date().toISOString()
      };
      localAccounts.push(newAcc);
      saveLocalAccounts(localAccounts);
      currentUser = { id: newAcc.id, email: newAcc.email, name: newAcc.name, isCloud: false };
      saveCurrentUser(currentUser);
      closeModal('modal-auth');
      addXP(50, 'Student Signed In');
      showToast(`Welcome, ${currentUser.name}! Account ready.`);
      return;
    }

    if (found.password !== password) {
      alert('Incorrect password. Please try again.');
      return;
    }

    currentUser = { id: found.id, email: found.email, name: found.name, isCloud: false };
    saveCurrentUser(currentUser);
    closeModal('modal-auth');
    addXP(30, 'Student Signed In');
    showToast(`Welcome back, ${currentUser.name}! 👋`);
  });

  // Handle Signup
  formSignup.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('input-signup-name').value.trim();
    const email = document.getElementById('input-signup-email').value.trim();
    const password = document.getElementById('input-signup-password').value;

    if (supabaseClient) {
      try {
        showToast('Registering via Supabase Cloud...');
        const { data, error } = await supabaseClient.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } }
        });
        if (error) throw error;
        currentUser = {
          id: data.user.id,
          email: data.user.email,
          name: name,
          isCloud: true
        };
        saveCurrentUser(currentUser);
        closeModal('modal-auth');
        showToast(`Account created for ${name}! ☁️`);
        uploadCurrentStateToCloud();
        return;
      } catch (err) {
        showToast(err.message || 'Cloud signup note: saving locally');
      }
    }

    // Local account registration
    const localAccounts = getLocalAccounts();
    const existing = localAccounts.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      existing.password = password;
      existing.name = name;
    } else {
      localAccounts.push({
        id: 'usr_' + Date.now(),
        name,
        email,
        password,
        createdAt: new Date().toISOString()
      });
    }
    saveLocalAccounts(localAccounts);

    currentUser = { id: 'usr_' + Date.now(), name, email, isCloud: false };
    saveCurrentUser(currentUser);
    closeModal('modal-auth');
    addXP(100, 'Student Registration');
    showToast(`Account created for ${name}! 🎓`);
  });

  const btnSignOut = document.getElementById('btn-signout');
  if (btnSignOut) {
    btnSignOut.addEventListener('click', async () => {
      if (supabaseClient) await supabaseClient.auth.signOut();
      saveCurrentUser(null);
      showToast('Signed out (Guest mode active)');
    });
  }

  const btnProfileSync = document.getElementById('btn-profile-sync');
  if (btnProfileSync) {
    btnProfileSync.addEventListener('click', () => loadStudentCloudData());
  }

  const btnManualSync = document.getElementById('btn-manual-sync');
  if (btnManualSync) {
    btnManualSync.addEventListener('click', () => loadStudentCloudData());
  }

  // Cloud Config Toggle & Save
  const btnToggleCloud = document.getElementById('btn-toggle-cloud-settings');
  const cloudFields = document.getElementById('cloud-config-fields');
  if (btnToggleCloud && cloudFields) {
    btnToggleCloud.addEventListener('click', () => {
      cloudFields.classList.toggle('hidden');
      const saved = localStorage.getItem(SUPABASE_CONFIG_KEY);
      if (saved) {
        try {
          const { url, key } = JSON.parse(saved);
          document.getElementById('input-supabase-url').value = url || '';
          document.getElementById('input-supabase-key').value = key || '';
        } catch (e) {}
      }
    });
  }

  document.getElementById('btn-save-cloud-config').addEventListener('click', () => {
    const url = document.getElementById('input-supabase-url').value.trim();
    const key = document.getElementById('input-supabase-key').value.trim();
    if (!url || !key) {
      alert('Please enter both Supabase URL and Anon key.');
      return;
    }
    localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify({ url, key }));
    if (window.supabase) {
      supabaseClient = window.supabase.createClient(url, key);
      showToast('Cloud database linked!');
      checkSupabaseAuth();
    }
  });

  document.getElementById('btn-copy-sql-schema').addEventListener('click', () => {
    const sql = `-- Run in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    code VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    exam_date DATE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    weight VARCHAR(50),
    order_index INT DEFAULT 1,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium',
    est_hours NUMERIC(4, 1) DEFAULT 2.0,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.student_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    status VARCHAR(30) DEFAULT 'not-started',
    confidence INT DEFAULT 0,
    rev_1 BOOLEAN DEFAULT FALSE,
    rev_2 BOOLEAN DEFAULT FALSE,
    rev_3 BOOLEAN DEFAULT FALSE,
    time_spent_minutes INT DEFAULT 0,
    notes TEXT DEFAULT '',
    resources TEXT DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, topic_id)
);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can manage their own subjects" ON public.subjects;
CREATE POLICY "Students can manage their own subjects" ON public.subjects FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students can manage their own modules" ON public.modules;
CREATE POLICY "Students can manage their own modules" ON public.modules FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students can manage their own topics" ON public.topics;
CREATE POLICY "Students can manage their own topics" ON public.topics FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Students can manage their own progress" ON public.student_progress;
CREATE POLICY "Students can manage their own progress" ON public.student_progress FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);`;

    navigator.clipboard.writeText(sql).then(() => {
      showToast('SQL schema copied to clipboard!');
    }).catch(() => {
      showToast('SQL available in supabase-schema.sql');
    });
  });

  // --- RESET TO EMPTY SYLLABUS & RELOAD SAMPLES ---
  const btnResetEmpty = document.getElementById('btn-reset-empty-syllabus');
  if (btnResetEmpty) {
    btnResetEmpty.addEventListener('click', () => {
      if (confirm('Reset to Empty Syllabus? This will wipe all courses, modules, and topics so you can start with a 100% clean blank slate.')) {
        appState.subjects = [];
        appState.activeSubjectId = null;
        saveState();
        renderSubjectSelector();
        renderHeroBanner();
        renderStats();
        renderModulesAndTopics();
        populateTimerTopics();
        showToast('Syllabus reset to blank slate! 🗑️');
      }
    });
  }

  const btnResetSamples = document.getElementById('btn-reset-all-data');
  if (btnResetSamples) {
    btnResetSamples.addEventListener('click', () => {
      if (confirm('Reload sample courses (DSA, Web Engineering, and Math)?')) {
        appState = JSON.parse(JSON.stringify(DEFAULT_DATA));
        saveState();
        renderSubjectSelector();
        renderHeroBanner();
        renderStats();
        renderModulesAndTopics();
        populateTimerTopics();
        showToast('Sample syllabi reloaded! 📚');
      }
    });
  }

  // --- BACKUP & EXPORT ---
  document.getElementById('btn-export-json').addEventListener('click', () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(appState, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `studyflow_syllabus_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Backup JSON downloaded');
  });

  document.getElementById('input-import-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.subjects && Array.isArray(imported.subjects)) {
          appState = imported;
          saveState();
          renderSubjectSelector();
          renderHeroBanner();
          renderStats();
          renderModulesAndTopics();
          populateTimerTopics();
          initGamification();
          showToast('Data restored!');
        }
      } catch (err) {
        alert('Invalid backup file');
      }
    };
    reader.readAsText(file);
  });

  // --- PRINT CHECKLIST ---
  const btnPrint = document.getElementById('btn-print');
  if (btnPrint) {
    btnPrint.addEventListener('click', () => window.print());
  }

  // --- FILTERS & SEARCH ---
  document.getElementById('search-input').addEventListener('input', (e) => {
    currentFilter.search = e.target.value.trim();
    renderModulesAndTopics();
  });

  document.querySelectorAll('.filter-status-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-status-btn').forEach(b => {
        b.className = 'filter-status-btn px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shrink-0 transition';
      });
      btn.className = 'filter-status-btn px-3 py-1.5 rounded-xl bg-indigo-600 text-white shrink-0 shadow-xs transition';
      currentFilter.status = btn.dataset.filterStatus;
      renderModulesAndTopics();
    });
  });

  document.getElementById('btn-reset-filters').addEventListener('click', () => {
    currentFilter.status = 'all';
    currentFilter.search = '';
    document.getElementById('search-input').value = '';
    document.querySelectorAll('.filter-status-btn').forEach(b => {
      b.className = b.dataset.filterStatus === 'all'
        ? 'filter-status-btn px-3 py-1.5 rounded-xl bg-indigo-600 text-white shrink-0 shadow-xs transition'
        : 'filter-status-btn px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shrink-0 transition';
    });
    renderModulesAndTopics();
  });

  // --- THEME ---
  const themeToggle = document.getElementById('theme-toggle');
  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    if (window.lucide) window.lucide.createIcons();
  });

  // Subject change
  document.getElementById('subject-selector').addEventListener('change', (e) => {
    appState.activeSubjectId = e.target.value;
    saveState();
    renderHeroBanner();
    renderStats();
    renderModulesAndTopics();
    populateTimerTopics();
  });

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- INITIALIZE ---
  function init() {
    initTheme();
    initGamification();
    initSupabase();
    renderSubjectSelector();
    renderHeroBanner();
    renderStats();
    renderModulesAndTopics();
    populateTimerTopics();
    updatePomodoroDisplay();

    if (window.lucide) window.lucide.createIcons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
