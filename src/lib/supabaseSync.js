import { supabase } from '../lib/supabase';

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
    if (error) throw error;
    return data.map(mapRoutineFromDB);
}

export async function upsertRoutine(userId, routine) {
    const dbRoutine = mapRoutineToDB(userId, routine);
    const { data, error } = await supabase
        .from('routines')
        .upsert(dbRoutine, { onConflict: 'id' })
        .select()
        .single();
    if (error) throw error;
    return mapRoutineFromDB(data);
}

export async function deleteRoutine(routineId) {
    const { error } = await supabase
        .from('routines')
        .delete()
        .eq('id', routineId);
    if (error) throw error;
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
        id: r.id || undefined,
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

export async function fetchDailyChecks(userId, date) {
    const { data, error } = await supabase
        .from('daily_checks')
        .select('*')
        .eq('user_id', userId)
        .eq('check_date', date || todayStr());
    if (error) throw error;

    // Convert array to object keyed by routine_id
    const checks = {};
    data.forEach(c => {
        checks[c.routine_id] = {
            done: c.done,
            count: c.count,
            note: c.note,
            subtasks: c.subtasks || {},
        };
    });
    return checks;
}

export async function fetchAllDailyChecks(userId) {
    const { data, error } = await supabase
        .from('daily_checks')
        .select('*')
        .eq('user_id', userId);
    if (error) throw error;

    // Convert to nested object { date: { routineId: { done, count, ... } } }
    const checks = {};
    data.forEach(c => {
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
    if (error) throw error;
}

// ╔══════════════════════════════════════════════════════════╗
// ║                    ENERGY                                ║
// ╚══════════════════════════════════════════════════════════╝

export async function fetchEnergy(userId) {
    const { data, error } = await supabase
        .from('energy_logs')
        .select('*')
        .eq('user_id', userId);
    if (error) throw error;

    const energy = {};
    data.forEach(e => { energy[e.log_date] = e.level; });
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
    if (error) throw error;
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
    if (error) throw error;
    return data.map(j => ({
        id: j.id,
        date: j.entry_date,
        category: j.category,
        title: j.title,
        text: j.body,
        photo: j.photo_url,
        time: j.entry_time,
    }));
}

export async function insertJournal(userId, entry) {
    const { data, error } = await supabase
        .from('journal_entries')
        .insert({
            user_id: userId,
            entry_date: entry.date || todayStr(),
            category: entry.category || 'salud',
            title: entry.title,
            body: entry.text || '',
            photo_url: entry.photo || '',
            entry_time: entry.time || '',
        })
        .select()
        .single();
    if (error) throw error;
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
    if (error) throw error;
}

// ╔══════════════════════════════════════════════════════════╗
// ║              COMPLETION HISTORY                          ║
// ╚══════════════════════════════════════════════════════════╝

export async function fetchHistory(userId) {
    const { data, error } = await supabase
        .from('completion_history')
        .select('*')
        .eq('user_id', userId);
    if (error) throw error;

    const history = {};
    data.forEach(h => { history[h.history_date] = h.ratio; });
    return history;
}

export async function upsertHistory(userId, date, ratio) {
    const { error } = await supabase
        .from('completion_history')
        .upsert({
            user_id: userId,
            history_date: date,
            ratio,
        }, { onConflict: 'user_id,history_date' });
    if (error) throw error;
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
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
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
    if (error) throw error;
}

// ╔══════════════════════════════════════════════════════════╗
// ║              FULL STATE SYNC                             ║
// ╚══════════════════════════════════════════════════════════╝

export async function loadFullState(userId) {
    const [routines, dailyChecks, energy, journal, history, settings] = await Promise.all([
        fetchRoutines(userId),
        fetchAllDailyChecks(userId),
        fetchEnergy(userId),
        fetchJournal(userId),
        fetchHistory(userId),
        fetchUserSettings(userId),
    ]);

    return {
        routines,
        dailyChecks,
        energy,
        journal,
        history,
        emergencyMode: settings?.emergency_mode || false,
        energeticMode: settings?.energetic_mode || false,
        userSettings: settings ? {
            notifications: settings.notifications,
            dailyReminder: settings.daily_reminder,
            reminderTime: settings.reminder_time,
            sound: settings.sound,
            vibration: settings.vibration,
            weekStart: settings.week_start,
        } : null,
    };
}
