import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

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
    // Daily checks: { '2026-02-20': { routineId: { done: bool, count: N, note: '', photo: '', subtasks: {} } } }
    dailyChecks: {},
    energy: {}, // { '2026-02-20': 3 }  (1-5)
    emergencyMode: false,
    // Journal entries
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
    // Heatmap history: { '2026-02-20': 0.8 } (0-1 completion ratio)
    history: {},
    // Focus timer state (not persisted fully, mostly runtime)
    focusTimer: { running: false, routineId: null, remaining: 0, total: 0 },
    // Last reset date
    lastReset: today(),
};

// ─── Reducer ────────────────────────────────────────────────
function reducer(state, action) {
    switch (action.type) {
        case 'SET_ENERGY': {
            return { ...state, energy: { ...state.energy, [today()]: action.level } };
        }
        case 'TOGGLE_EMERGENCY': {
            return { ...state, emergencyMode: !state.emergencyMode };
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
        default:
            return state;
    }
}

// ─── Context ────────────────────────────────────────────────
const StoreContext = createContext(null);

export function StoreProvider({ children }) {
    const saved = load();
    const [state, dispatch] = useReducer(reducer, saved || defaultState);

    // Persist on every change
    useEffect(() => { persist(state); }, [state]);

    // Daily reset check
    useEffect(() => {
        if (state.lastReset !== today()) {
            // Record yesterday's completion before reset
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
