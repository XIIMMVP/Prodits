import { supabase } from './supabase';

// ─── Helper: today date string ──────────────────────────
const todayStr = () => new Date().toISOString().split('T')[0];

// ╔══════════════════════════════════════════════════════════╗
// ║                    ROUTINES                              ║
// ╚══════════════════════════════════════════════════════════╝

export async function fetchRoutines(userId) {
    const { data, error } = await supabase
        .from('routines')
        .select('*')
        .eq('user_id', userId)
        .order('sort_order', { ascending: true });
    if (error) { console.error('fetchRoutines error:', error); throw error; }
    return (data || []).map(mapRoutineFromDB);
}

export async function upsertRoutine(userId, routine) {
    const dbRoutine = mapRoutineToDB(userId, routine);
    const { data, error } = await supabase
        .from('routines')
        .upsert(dbRoutine, { onConflict: 'id' })
        .select()
        .single();
    if (error) { console.error('upsertRoutine error:', error); throw error; }
    return mapRoutineFromDB(data);
}

export async function upsertAllRoutines(userId, routines) {
    if (!routines.length) return;
    const dbRoutines = routines.map((r, i) => mapRoutineToDB(userId, { ...r, sortOrder: i }));
    const { error } = await supabase
        .from('routines')
        .upsert(dbRoutines, { onConflict: 'id' });
    if (error) { console.error('upsertAllRoutines error:', error); throw error; }
}

export async function deleteRoutine(routineId) {
    const { error } = await supabase
        .from('routines')
        .delete()
        .eq('id', routineId);
    if (error) { console.error('deleteRoutine error:', error); throw error; }
}

// Map DB → App format
function mapRoutineFromDB(r) {
    return {
        id: r.id,
        name: r.name,
        icon: r.icon,
        color: r.color,
        category: r.category,
        period: r.period,
        days: r.days,
        time: r.time_of_day,
        essential: r.essential,
        energetic: r.energetic,
        type: r.type,
        target: r.target,
        focusDuration: r.focus_duration,
        subtasks: r.subtasks || [],
        sortOrder: r.sort_order,
    };
}

// Map App → DB format
function mapRoutineToDB(userId, r) {
    return {
        id: r.id,
        user_id: userId,
        name: r.name,
        icon: r.icon || 'wb_sunny',
        color: r.color || 'blue',
        category: r.category || 'salud',
        period: r.period || 'mañana',
        days: r.days || [1, 2, 3, 4, 5],
        time_of_day: r.time || '08:00',
        essential: r.essential || false,
        energetic: r.energetic || false,
        type: r.type || 'check',
        target: r.target || 8,
        focus_duration: r.focusDuration || 25,
        subtasks: r.subtasks || [],
        sort_order: r.sortOrder || 0,
    };
}

// ╔══════════════════════════════════════════════════════════╗
// ║                  DAILY CHECKS                            ║
// ╚══════════════════════════════════════════════════════════╝

export async function fetchAllDailyChecks(userId) {
    const { data, error } = await supabase
        .from('daily_checks')
        .select('*')
        .eq('user_id', userId);
    if (error) { console.error('fetchAllDailyChecks error:', error); throw error; }

    const checks = {};
    (data || []).forEach(c => {
        if (!checks[c.check_date]) checks[c.check_date] = {};
        checks[c.check_date][c.routine_id] = {
            done: c.done,
            count: c.count,
            note: c.note,
            subtasks: c.subtasks || {},
        };
    });
    return checks;
}

export async function upsertDailyCheck(userId, routineId, date, checkData) {
    const { error } = await supabase
        .from('daily_checks')
        .upsert({
            user_id: userId,
            routine_id: routineId,
            check_date: date || todayStr(),
            done: checkData.done || false,
            count: checkData.count || 0,
            note: checkData.note || '',
            subtasks: checkData.subtasks || {},
        }, { onConflict: 'user_id,routine_id,check_date' });
    if (error) { console.error('upsertDailyCheck error:', error); throw error; }
}

// ╔══════════════════════════════════════════════════════════╗
// ║                    ENERGY                                ║
// ╚══════════════════════════════════════════════════════════╝

export async function fetchEnergy(userId) {
    const { data, error } = await supabase
        .from('energy_logs')
        .select('*')
        .eq('user_id', userId);
    if (error) { console.error('fetchEnergy error:', error); throw error; }

    const energy = {};
    (data || []).forEach(e => { energy[e.log_date] = e.level; });
    return energy;
}

export async function upsertEnergy(userId, date, level) {
    const { error } = await supabase
        .from('energy_logs')
        .upsert({
            user_id: userId,
            log_date: date || todayStr(),
            level,
        }, { onConflict: 'user_id,log_date' });
    if (error) { console.error('upsertEnergy error:', error); throw error; }
}

// ╔══════════════════════════════════════════════════════════╗
// ║                   JOURNAL                                ║
// ╚══════════════════════════════════════════════════════════╝

export async function fetchJournal(userId) {
    const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    if (error) { console.error('fetchJournal error:', error); throw error; }
    return (data || []).map(j => ({
        id: j.id,
        date: j.entry_date,
        category: j.category,
        title: j.title,
        text: j.body,
        photo: j.photo_url,
        time: j.entry_time,
    }));
}

export async function upsertJournal(userId, entry) {
    const { data, error } = await supabase
        .from('journal_entries')
        .upsert({
            id: entry.id,
            user_id: userId,
            entry_date: entry.date || todayStr(),
            category: entry.category || 'salud',
            title: entry.title,
            body: entry.text || '',
            photo_url: entry.photo || '',
            entry_time: entry.time || '',
        }, { onConflict: 'id' })
        .select()
        .single();
    if (error) { console.error('upsertJournal error:', error); throw error; }
    return {
        id: data.id,
        date: data.entry_date,
        category: data.category,
        title: data.title,
        text: data.body,
        photo: data.photo_url,
        time: data.entry_time,
    };
}

export async function deleteJournal(journalId) {
    const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', journalId);
    if (error) { console.error('deleteJournal error:', error); throw error; }
}

// ╔══════════════════════════════════════════════════════════╗
// ║              COMPLETION HISTORY                          ║
// ╚══════════════════════════════════════════════════════════╝

export async function fetchHistory(userId) {
    const { data, error } = await supabase
        .from('completion_history')
        .select('*')
        .eq('user_id', userId);
    if (error) { console.error('fetchHistory error:', error); throw error; }

    const history = {};
    (data || []).forEach(h => {
        history[h.history_date] = { ratio: h.ratio, mode: h.mode || 'normal' };
    });
    return history;
}

export async function upsertHistory(userId, date, historyData) {
    const ratio = typeof historyData === 'object' ? historyData.ratio : historyData;
    const mode = typeof historyData === 'object' ? historyData.mode : 'normal';

    const { error } = await supabase
        .from('completion_history')
        .upsert({
            user_id: userId,
            history_date: date,
            ratio,
            mode,
        }, { onConflict: 'user_id,history_date' });
    if (error) { console.error('upsertHistory error:', error); throw error; }
}

// ╔══════════════════════════════════════════════════════════╗
// ║               USER SETTINGS                              ║
// ╚══════════════════════════════════════════════════════════╝

export async function fetchUserSettings(userId) {
    const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
    if (error && error.code !== 'PGRST116') { console.error('fetchUserSettings error:', error); throw error; }
    return data;
}

export async function upsertUserSettings(userId, settings) {
    const { error } = await supabase
        .from('user_settings')
        .upsert({
            user_id: userId,
            notifications: settings.notifications,
            daily_reminder: settings.dailyReminder,
            reminder_time: settings.reminderTime,
            sound: settings.sound,
            vibration: settings.vibration,
            week_start: settings.weekStart,
            emergency_mode: settings.emergencyMode,
            energetic_mode: settings.energeticMode,
        }, { onConflict: 'user_id' });
    if (error) { console.error('upsertUserSettings error:', error); throw error; }
}

// ╔══════════════════════════════════════════════════════════╗
// ║                  APPOINTMENTS                            ║
// ╚══════════════════════════════════════════════════════════╝

export async function fetchAppointments(userId) {
    const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true });
    if (error) { console.error('fetchAppointments error:', error); throw error; }
    return (data || []).map(a => ({
        id: a.id,
        title: a.title,
        date: a.date,
        time: a.time,
        description: a.description
    }));
}

export async function upsertAppointment(userId, appt) {
    const { data, error } = await supabase
        .from('appointments')
        .upsert({
            id: appt.id,
            user_id: userId,
            title: appt.title,
            date: appt.date,
            time: appt.time,
            description: appt.description || ''
        }, { onConflict: 'id' })
        .select()
        .single();
    if (error) { console.error('upsertAppointment error:', error); throw error; }
    return data;
}

export async function deleteAppointment(id) {
    const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);
    if (error) { console.error('deleteAppointment error:', error); throw error; }
}

// ╔══════════════════════════════════════════════════════════╗
// ║                    NOTES                                 ║
// ╚══════════════════════════════════════════════════════════╝

export async function fetchNotes(userId) {
    const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    if (error) { console.error('fetchNotes error:', error); throw error; }
    return (data || []).map(n => ({
        id: n.id,
        title: n.title,
        text: n.text,
        color: n.color || 'gray',
        createdAt: n.created_at,
        updatedAt: n.updated_at
    }));
}

export async function upsertNote(userId, note) {
    const { data, error } = await supabase
        .from('notes')
        .upsert({
            id: note.id,
            user_id: userId,
            title: note.title,
            text: note.text,
            color: note.color || 'gray',
            created_at: note.createdAt || new Date().toISOString(),
            updated_at: note.updatedAt || new Date().toISOString()
        }, { onConflict: 'id' })
        .select()
        .single();
    if (error) { console.error('upsertNote error:', error); throw error; }
    return data;
}

export async function deleteNote(id) {
    const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);
    if (error) { console.error('deleteNote error:', error); throw error; }
}

// ╔══════════════════════════════════════════════════════════╗
// ║              FULL STATE SYNC                             ║
// ╚══════════════════════════════════════════════════════════╝

export async function loadFullState(userId) {
    const [routines, dailyChecks, energy, journal, history, settings, appointments, notes] = await Promise.all([
        fetchRoutines(userId),
        fetchAllDailyChecks(userId),
        fetchEnergy(userId),
        fetchJournal(userId),
        fetchHistory(userId),
        fetchUserSettings(userId),
        fetchAppointments(userId),
        fetchNotes(userId),
    ]);

    return {
        routines,
        dailyChecks,
        energy,
        journal,
        history,
        appointments,
        notes,
        emergencyMode: settings?.emergency_mode || false,
        energeticMode: settings?.energetic_mode || false,
    };
}

export async function pushFullState(userId, state) {
    const promises = [];

    // Push all routines
    if (state.routines?.length > 0) {
        promises.push(upsertAllRoutines(userId, state.routines));
    }

    // Push all daily checks
    for (const [date, checks] of Object.entries(state.dailyChecks || {})) {
        for (const [routineId, checkData] of Object.entries(checks)) {
            promises.push(upsertDailyCheck(userId, routineId, date, checkData));
        }
    }

    // Push energy
    for (const [date, level] of Object.entries(state.energy || {})) {
        promises.push(upsertEnergy(userId, date, level));
    }

    // Push journal
    for (const entry of (state.journal || [])) {
        promises.push(upsertJournal(userId, entry));
    }

    // Push appointments
    for (const appt of (state.appointments || [])) {
        promises.push(upsertAppointment(userId, appt));
    }

    // Push history
    for (const [date, historyData] of Object.entries(state.history || {})) {
        promises.push(upsertHistory(userId, date, historyData));
    }

    // Push notes
    for (const note of (state.notes || [])) {
        promises.push(upsertNote(userId, note));
    }

    // Push modes
    promises.push(upsertUserSettings(userId, {
        emergencyMode: state.emergencyMode,
        energeticMode: state.energeticMode,
    }));

    const results = await Promise.allSettled(promises);
    const failed = results.filter(r => r.status === 'rejected');
    if (failed.length > 0) {
        console.error('pushFullState: some operations failed:', failed);
    }
}
