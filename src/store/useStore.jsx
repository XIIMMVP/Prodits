import { createContext, useContext, useReducer, useEffect, useCallback, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import * as sync from '../lib/supabaseSync';

// ─── Helpers ────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const today = () => new Date().toISOString().split('T')[0];
const persist = (state) => {
    try {
        const { _synced, ...rest } = state;
        localStorage.setItem('prodits_state', JSON.stringify(rest));
    } catch (e) { console.error('persist error:', e); }
};
const load = () => {
    try { return JSON.parse(localStorage.getItem('prodits_state')); } catch { return null; }
};

// ─── Constants ──────────────────────────────────────────────
const CATEGORIES = ['salud', 'mente', 'hogar', 'trabajo'];
const PERIODS = ['mañana', 'tarde', 'noche'];

// ─── Default State ──────────────────────────────────────────
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
            const newRoutine = { id: uid(), ...action.routine };
            return { ...state, routines: [...state.routines, newRoutine], _lastAdded: newRoutine };
        }
        case 'UPDATE_ROUTINE': {
            return { ...state, routines: state.routines.map(r => r.id === action.id ? { ...r, ...action.data } : r) };
        }
        case 'DELETE_ROUTINE': {
            return { ...state, routines: state.routines.filter(r => r.id !== action.id) };
        }
        case 'ADD_JOURNAL': {
            const newEntry = { id: uid(), date: today(), ...action.entry };
            return { ...state, journal: [newEntry, ...state.journal], _lastJournal: newEntry };
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
        case 'HYDRATE_FROM_CLOUD': {
            return {
                ...state,
                routines: action.data.routines,
                dailyChecks: action.data.dailyChecks,
                energy: action.data.energy,
                journal: action.data.journal,
                history: action.data.history,
                emergencyMode: action.data.emergencyMode,
                energeticMode: action.data.energeticMode,
            };
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
    const [state, rawDispatch] = useReducer(reducer, saved || defaultState);
    const stateRef = useRef(state);
    const [cloudLoaded, setCloudLoaded] = useState(false);

    // Keep stateRef in sync
    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    // ─── Load from Supabase when user signs in ─────────
    useEffect(() => {
        if (!user) {
            setCloudLoaded(false);
            return;
        }

        let cancelled = false;
        console.log('[Sync] Loading state from Supabase for user:', user.id);

        sync.loadFullState(user.id).then(data => {
            if (cancelled) return;

            const hasCloudData = data.routines.length > 0 || data.journal.length > 0 || Object.keys(data.dailyChecks).length > 0;

            if (hasCloudData) {
                console.log('[Sync] Found cloud data, hydrating...');
                rawDispatch({ type: 'HYDRATE_FROM_CLOUD', data });
            } else {
                console.log('[Sync] No cloud data found, pushing local state...');
                sync.pushFullState(user.id, stateRef.current)
                    .then(() => console.log('[Sync] Local state pushed to cloud'))
                    .catch(err => console.error('[Sync] Push failed:', err));
            }
            setCloudLoaded(true);
        }).catch(err => {
            console.error('[Sync] Load failed:', err);
            setCloudLoaded(true); // Allow app to work offline
        });

        return () => { cancelled = true; };
    }, [user?.id]);

    // ─── Persist locally on every change ───────────────
    useEffect(() => { persist(state); }, [state]);

    // ─── Daily reset check ──────────────────────────────
    useEffect(() => {
        if (state.lastReset !== today()) {
            const yesterday = state.lastReset;
            const dow = new Date(yesterday).getDay();
            const todayRoutines = state.routines.filter(r => r.days.includes(dow));
            if (todayRoutines.length > 0 && state.dailyChecks[yesterday]) {
                const done = todayRoutines.filter(r => state.dailyChecks[yesterday]?.[r.id]?.done).length;
                rawDispatch({ type: 'RECORD_HISTORY', date: yesterday, ratio: done / todayRoutines.length });
            }
            rawDispatch({ type: 'DAILY_RESET' });
        }
    }, [state.lastReset, state.routines, state.dailyChecks]);

    // ─── Smart dispatch: sync each action to Supabase ───
    const dispatch = useCallback((action) => {
        rawDispatch(action);

        // Sync to Supabase if user is logged in
        if (!user) return;

        // Use setTimeout(0) to get updated state from stateRef
        setTimeout(() => {
            const currentState = stateRef.current;
            syncAction(user.id, action, currentState).catch(err => {
                console.error('[Sync] Action sync failed:', action.type, err);
            });
        }, 50);
    }, [user]);

    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
}

// ─── Sync individual actions to Supabase ────────────────────
async function syncAction(userId, action, state) {
    const d = today();

    switch (action.type) {
        // ── Routines ──────────────────────────────────────
        case 'ADD_ROUTINE': {
            const newRoutine = state._lastAdded || state.routines[state.routines.length - 1];
            if (newRoutine) {
                console.log('[Sync] Upserting new routine:', newRoutine.name);
                await sync.upsertRoutine(userId, newRoutine);
            }
            break;
        }
        case 'UPDATE_ROUTINE': {
            const updated = state.routines.find(r => r.id === action.id);
            if (updated) {
                console.log('[Sync] Updating routine:', updated.name);
                await sync.upsertRoutine(userId, updated);
            }
            break;
        }
        case 'DELETE_ROUTINE': {
            console.log('[Sync] Deleting routine:', action.id);
            await sync.deleteRoutine(action.id);
            break;
        }

        // ── Daily checks ─────────────────────────────────
        case 'TOGGLE_TASK':
        case 'TOGGLE_SUBTASK':
        case 'INCREMENT_COUNTER':
        case 'ADD_NOTE': {
            const checkData = state.dailyChecks[d]?.[action.routineId];
            if (checkData) {
                console.log('[Sync] Syncing daily check for routine:', action.routineId);
                await sync.upsertDailyCheck(userId, action.routineId, d, checkData);
            }
            break;
        }

        // ── Energy ────────────────────────────────────────
        case 'SET_ENERGY': {
            console.log('[Sync] Syncing energy level');
            await sync.upsertEnergy(userId, d, state.energy[d]);
            break;
        }

        // ── Modes ─────────────────────────────────────────
        case 'TOGGLE_EMERGENCY':
        case 'SET_EMERGENCY_MODE':
        case 'TOGGLE_ENERGETIC':
        case 'SET_ENERGETIC_MODE': {
            console.log('[Sync] Syncing modes');
            await sync.upsertUserSettings(userId, {
                emergencyMode: state.emergencyMode,
                energeticMode: state.energeticMode,
            });
            break;
        }

        // ── Journal ───────────────────────────────────────
        case 'ADD_JOURNAL': {
            const newEntry = state._lastJournal || state.journal[0];
            if (newEntry) {
                console.log('[Sync] Upserting journal entry:', newEntry.title);
                await sync.upsertJournal(userId, newEntry);
            }
            break;
        }
        case 'DELETE_JOURNAL': {
            console.log('[Sync] Deleting journal entry:', action.id);
            await sync.deleteJournal(action.id);
            break;
        }

        // ── History ───────────────────────────────────────
        case 'RECORD_HISTORY': {
            console.log('[Sync] Recording history for:', action.date);
            await sync.upsertHistory(userId, action.date, action.ratio);
            break;
        }
    }
}

// ─── Exports ────────────────────────────────────────────────
export function useStore() {
    const ctx = useContext(StoreContext);
    if (!ctx) throw new Error('useStore must be used within StoreProvider');
    return ctx;
}

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
