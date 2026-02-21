import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import * as sync from '../lib/supabaseSync';

// ─── Helpers ────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const today = () => new Date().toISOString().split('T')[0];
const persist = (state) => localStorage.setItem('prodits_state', JSON.stringify(state));
const load = () => {
    try { return JSON.parse(localStorage.getItem('prodits_state')); } catch { return null; }
};

// ─── Default State ──────────────────────────────────────────
const CATEGORIES = ['salud', 'mente', 'hogar', 'trabajo'];
const PERIODS = ['mañana', 'tarde', 'noche'];

const defaultRoutines = [
    {
        id: uid(), name: 'Ritual de Mañana', icon: 'wb_sunny', color: 'orange',
        category: 'salud', period: 'mañana', days: [1, 2, 3, 4, 5, 6, 0],
        time: '07:30', essential: true, type: 'check',
        subtasks: [
            { id: uid(), text: 'Hacer la cama', done: false },
            { id: uid(), text: 'Ducha fría', done: false },
            { id: uid(), text: 'Meditar 10 min', done: false },
        ]
    },
    {
        id: uid(), name: 'Consumo de Agua', icon: 'water_drop', color: 'blue',
        category: 'salud', period: 'mañana', days: [1, 2, 3, 4, 5, 6, 0],
        time: '08:00', essential: true, type: 'counter', target: 8, count: 0,
        subtasks: []
    },
    {
        id: uid(), name: 'Sesión de Trabajo Profundo', icon: 'laptop_mac', color: 'indigo',
        category: 'trabajo', period: 'tarde', days: [1, 2, 3, 4, 5],
        time: '14:00', essential: true, type: 'focus', focusDuration: 25,
        subtasks: []
    },
    {
        id: uid(), name: 'Leer 30 min', icon: 'menu_book', color: 'teal',
        category: 'mente', period: 'noche', days: [1, 2, 3, 4, 5, 6, 0],
        time: '21:00', essential: false, type: 'check',
        subtasks: []
    },
    {
        id: uid(), name: 'Relajación Nocturna', icon: 'self_improvement', color: 'purple',
        category: 'mente', period: 'noche', days: [1, 2, 3, 4, 5, 6, 0],
        time: '22:00', essential: false, type: 'check',
        subtasks: []
    },
];

const defaultState = {
    routines: defaultRoutines,
    dailyChecks: {},
    energy: {},
    emergencyMode: false,
    energeticMode: false,
    journal: [
        {
            id: uid(), date: today(), category: 'salud', title: 'Disciplina Mañanera',
            text: 'Meta de 5km completada al amanecer. Saliendo de la zona de confort.',
            photo: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
            time: '07:30 AM'
        },
        {
            id: uid(), date: today(), category: 'trabajo', title: 'Sesión de Trabajo Enfocado',
            text: '3 horas de programación concentrada sin distracciones. Hito alcanzado.',
            photo: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
            time: '04:00 PM'
        },
    ],
    history: {},
    focusTimer: { running: false, routineId: null, remaining: 0, total: 0 },
    lastReset: today(),
    // Sync metadata
    _syncing: false,
    _loaded: false,
};

// ─── Reducer ────────────────────────────────────────────────
function reducer(state, action) {
    switch (action.type) {
        case 'SET_ENERGY': {
            return { ...state, energy: { ...state.energy, [today()]: action.level } };
        }
        case 'TOGGLE_EMERGENCY': {
            return { ...state, emergencyMode: !state.emergencyMode, energeticMode: false };
        }
        case 'SET_EMERGENCY_MODE': {
            return { ...state, emergencyMode: action.value, energeticMode: action.value ? false : state.energeticMode };
        }
        case 'TOGGLE_ENERGETIC': {
            return { ...state, energeticMode: !state.energeticMode, emergencyMode: false };
        }
        case 'SET_ENERGETIC_MODE': {
            return { ...state, energeticMode: action.value, emergencyMode: action.value ? false : state.emergencyMode };
        }
        case 'TOGGLE_TASK': {
            const d = today();
            const checks = { ...state.dailyChecks };
            if (!checks[d]) checks[d] = {};
            if (!checks[d][action.routineId]) checks[d][action.routineId] = { done: false, count: 0, note: '', subtasks: {} };
            checks[d][action.routineId] = { ...checks[d][action.routineId], done: !checks[d][action.routineId].done };
            return { ...state, dailyChecks: checks };
        }
        case 'TOGGLE_SUBTASK': {
            const d = today();
            const checks = { ...state.dailyChecks };
            if (!checks[d]) checks[d] = {};
            if (!checks[d][action.routineId]) checks[d][action.routineId] = { done: false, count: 0, note: '', subtasks: {} };
            const subs = { ...checks[d][action.routineId].subtasks };
            subs[action.subtaskId] = !subs[action.subtaskId];
            checks[d][action.routineId] = { ...checks[d][action.routineId], subtasks: subs };
            return { ...state, dailyChecks: checks };
        }
        case 'INCREMENT_COUNTER': {
            const d = today();
            const checks = { ...state.dailyChecks };
            if (!checks[d]) checks[d] = {};
            if (!checks[d][action.routineId]) checks[d][action.routineId] = { done: false, count: 0, note: '' };
            const c = checks[d][action.routineId].count + action.delta;
            const routine = state.routines.find(r => r.id === action.routineId);
            const newCount = Math.max(0, Math.min(c, routine?.target || 99));
            checks[d][action.routineId] = { ...checks[d][action.routineId], count: newCount, done: newCount >= (routine?.target || 99) };
            return { ...state, dailyChecks: checks };
        }
        case 'ADD_NOTE': {
            const d = today();
            const checks = { ...state.dailyChecks };
            if (!checks[d]) checks[d] = {};
            if (!checks[d][action.routineId]) checks[d][action.routineId] = { done: false, count: 0, note: '' };
            checks[d][action.routineId] = { ...checks[d][action.routineId], note: action.note };
            return { ...state, dailyChecks: checks };
        }
        case 'ADD_ROUTINE': {
            return { ...state, routines: [...state.routines, { id: uid(), ...action.routine }] };
        }
        case 'UPDATE_ROUTINE': {
            return { ...state, routines: state.routines.map(r => r.id === action.id ? { ...r, ...action.data } : r) };
        }
        case 'DELETE_ROUTINE': {
            return { ...state, routines: state.routines.filter(r => r.id !== action.id) };
        }
        case 'ADD_JOURNAL': {
            return { ...state, journal: [{ id: uid(), date: today(), ...action.entry }, ...state.journal] };
        }
        case 'DELETE_JOURNAL': {
            return { ...state, journal: state.journal.filter(j => j.id !== action.id) };
        }
        case 'SET_FOCUS_TIMER': {
            return { ...state, focusTimer: { ...state.focusTimer, ...action.data } };
        }
        case 'RECORD_HISTORY': {
            return { ...state, history: { ...state.history, [action.date]: action.ratio } };
        }
        case 'DAILY_RESET': {
            return { ...state, lastReset: today() };
        }
        case 'LOAD_STATE': {
            return { ...action.state, focusTimer: defaultState.focusTimer };
        }
        case 'LOAD_FROM_SUPABASE': {
            return {
                ...state,
                routines: action.data.routines,
                dailyChecks: action.data.dailyChecks,
                energy: action.data.energy,
                journal: action.data.journal,
                history: action.data.history,
                emergencyMode: action.data.emergencyMode,
                energeticMode: action.data.energeticMode,
                _loaded: true,
                _syncing: false,
            };
        }
        case 'SET_SYNCING': {
            return { ...state, _syncing: action.value };
        }
        default:
            return state;
    }
}

// ─── Context ────────────────────────────────────────────────
const StoreContext = createContext(null);

export function StoreProvider({ children }) {
    const { user } = useAuth();
    const saved = load();
    const [state, dispatch] = useReducer(reducer, saved || defaultState);
    const syncTimeoutRef = useRef(null);
    const prevStateRef = useRef(state);

    // ─── Load from Supabase when user signs in ─────────
    useEffect(() => {
        if (!user) return;

        let cancelled = false;
        dispatch({ type: 'SET_SYNCING', value: true });

        sync.loadFullState(user.id).then(data => {
            if (cancelled) return;
            // Only load if the user has data in Supabase
            if (data.routines.length > 0 || Object.keys(data.dailyChecks).length > 0) {
                dispatch({ type: 'LOAD_FROM_SUPABASE', data });
            } else {
                // First time: push local data to Supabase
                pushFullStateToSupabase(user.id, state);
                dispatch({ type: 'SET_SYNCING', value: false });
            }
        }).catch(err => {
            console.error('Failed to load from Supabase:', err);
            dispatch({ type: 'SET_SYNCING', value: false });
        });

        return () => { cancelled = true; };
    }, [user?.id]);

    // ─── Persist locally on every change ────────────────
    useEffect(() => { persist(state); }, [state]);

    // ─── Debounced sync to Supabase ─────────────────────
    useEffect(() => {
        if (!user || state._syncing || !state._loaded) return;

        // Don't sync on initial load
        if (prevStateRef.current === state) return;
        prevStateRef.current = state;

        // Debounce: wait 1s after last change before syncing
        if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = setTimeout(() => {
            syncStateToSupabase(user.id, state).catch(err => {
                console.error('Sync error:', err);
            });
        }, 1000);

        return () => {
            if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
        };
    }, [state, user]);

    // Daily reset check
    useEffect(() => {
        if (state.lastReset !== today()) {
            const yesterday = state.lastReset;
            const todayRoutines = state.routines.filter(r => {
                const dow = new Date(yesterday).getDay();
                return r.days.includes(dow);
            });
            if (todayRoutines.length > 0 && state.dailyChecks[yesterday]) {
                const done = todayRoutines.filter(r => state.dailyChecks[yesterday]?.[r.id]?.done).length;
                dispatch({ type: 'RECORD_HISTORY', date: yesterday, ratio: done / todayRoutines.length });
            }
            dispatch({ type: 'DAILY_RESET' });
        }
    }, [state.lastReset, state.routines, state.dailyChecks]);

    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
}

// ─── Sync Helpers ───────────────────────────────────────────
async function syncStateToSupabase(userId, state) {
    const d = today();
    const promises = [];

    // Sync today's daily checks
    if (state.dailyChecks[d]) {
        for (const [routineId, checkData] of Object.entries(state.dailyChecks[d])) {
            promises.push(sync.upsertDailyCheck(userId, routineId, d, checkData));
        }
    }

    // Sync today's energy
    if (state.energy[d]) {
        promises.push(sync.upsertEnergy(userId, d, state.energy[d]));
    }

    // Sync modes
    promises.push(sync.upsertUserSettings(userId, {
        emergencyMode: state.emergencyMode,
        energeticMode: state.energeticMode,
    }));

    await Promise.allSettled(promises);
}

async function pushFullStateToSupabase(userId, state) {
    try {
        // Push all routines
        for (const routine of state.routines) {
            await sync.upsertRoutine(userId, routine);
        }

        // Push all daily checks
        for (const [date, checks] of Object.entries(state.dailyChecks)) {
            for (const [routineId, checkData] of Object.entries(checks)) {
                await sync.upsertDailyCheck(userId, routineId, date, checkData);
            }
        }

        // Push energy
        for (const [date, level] of Object.entries(state.energy)) {
            await sync.upsertEnergy(userId, date, level);
        }

        // Push journal
        for (const entry of state.journal) {
            await sync.insertJournal(userId, entry);
        }

        // Push history
        for (const [date, ratio] of Object.entries(state.history)) {
            await sync.upsertHistory(userId, date, ratio);
        }
    } catch (err) {
        console.error('Push full state error:', err);
    }
}

export function useStore() {
    const ctx = useContext(StoreContext);
    if (!ctx) throw new Error('useStore must be used within StoreProvider');
    return ctx;
}

// ─── Selector hooks ─────────────────────────────────────────
export function useTodayRoutines(state) {
    const dow = new Date().getDay();
    return state.routines.filter(r => r.days.includes(dow));
}

export function useCompletionRatio(state) {
    const d = today();
    const dow = new Date().getDay();
    const todayRoutines = state.routines.filter(r => r.days.includes(dow));
    if (todayRoutines.length === 0) return 0;
    const done = todayRoutines.filter(r => state.dailyChecks[d]?.[r.id]?.done).length;
    return done / todayRoutines.length;
}

export function useCategoryCompletion(state, category) {
    const d = today();
    const dow = new Date().getDay();
    const catRoutines = state.routines.filter(r => r.days.includes(dow) && r.category === category);
    if (catRoutines.length === 0) return 0;
    const done = catRoutines.filter(r => state.dailyChecks[d]?.[r.id]?.done).length;
    return done / catRoutines.length;
}

export { CATEGORIES, PERIODS, today, uid };
