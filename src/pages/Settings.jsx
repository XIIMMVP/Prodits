import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useAuth } from '../store/AuthContext';
import { useSwipeToClose } from '../hooks/useSwipeToClose';

// ─── Toggle Switch ──────────────────────────────────────────
function Toggle({ value, onChange, color = 'bg-[var(--primary)]' }) {
    return (
        <button
            onClick={() => onChange(!value)}
            className={`w-12 h-7 rounded-full relative transition-colors duration-300 ${value ? color : 'bg-gray-200'}`}
        >
            <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-300 ${value ? 'right-0.5' : 'left-0.5'}`} />
        </button>
    );
}

// ─── Setting Row ────────────────────────────────────────────
function SettingRow({ icon, label, description, children, onClick, danger }) {
    const Wrapper = onClick ? 'button' : 'div';
    return (
        <Wrapper
            onClick={onClick}
            className={`w-full flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors ${onClick ? 'cursor-pointer active:bg-gray-100' : ''}`}
        >
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${danger ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-[var(--text-secondary)]'}`}>
                    <span className="material-symbols-outlined text-lg">{icon}</span>
                </div>
                <div className="flex-1 min-w-0 text-left">
                    <p className={`font-semibold text-sm ${danger ? 'text-red-500' : ''}`}>{label}</p>
                    {description && <p className="text-xs text-[var(--text-secondary)] truncate">{description}</p>}
                </div>
            </div>
            <div className="flex items-center gap-2 ml-3">
                {children}
                {onClick && !children && (
                    <span className="material-symbols-outlined text-gray-300 text-lg">chevron_right</span>
                )}
            </div>
        </Wrapper>
    );
}

// ─── Section Card ───────────────────────────────────────────
function SectionCard({ title, children }) {
    return (
        <div className="mb-5">
            <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider px-1 mb-2">{title}</h3>
            <div className="bg-white rounded-2xl ios-shadow divide-y divide-gray-100 overflow-hidden">
                {children}
            </div>
        </div>
    );
}

// ─── Confirm Modal ──────────────────────────────────────────
function ConfirmModal({ title, message, confirmLabel, onConfirm, onClose, danger }) {
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm ios-shadow" onClick={e => e.stopPropagation()}>
                <div className="text-center mb-6">
                    <div className={`w-14 h-14 rounded-full ${danger ? 'bg-red-50' : 'bg-blue-50'} flex items-center justify-center mx-auto mb-4`}>
                        <span className={`material-symbols-outlined text-2xl ${danger ? 'text-red-500' : 'text-[var(--primary)]'}`}>
                            {danger ? 'warning' : 'info'}
                        </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{title}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">{message}</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-2xl font-bold text-sm bg-gray-100 text-[var(--text-main)] hover:bg-gray-200 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 py-3 rounded-2xl font-bold text-sm text-white transition-colors ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-[var(--primary)] hover:opacity-90'}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Export Data ─────────────────────────────────────────────
function exportData(state) {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prodits_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// ─── Main Settings Page ─────────────────────────────────────
export default function Settings() {
    const { state, dispatch } = useStore();
    const { user, signOut, updateProfile } = useAuth();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showProfileEdit, setShowProfileEdit] = useState(false);

    // Local settings (persisted in localStorage separately)
    const [settings, setSettings] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('prodits_settings')) || {
                notifications: true,
                dailyReminder: true,
                reminderTime: '08:00',
                sound: true,
                vibration: true,
                weekStart: 'lunes',
            };
        } catch {
            return {
                notifications: true,
                dailyReminder: true,
                reminderTime: '08:00',
                sound: true,
                vibration: true,
                weekStart: 'lunes',
            };
        }
    });

    const updateSetting = (key, value) => {
        const next = { ...settings, [key]: value };
        setSettings(next);
        localStorage.setItem('prodits_settings', JSON.stringify(next));
    };

    // Modal states
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showExportDone, setShowExportDone] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);

    // Stats
    const totalRoutines = state.routines.length;
    const totalJournal = state.journal.length;
    const totalDays = Object.keys(state.dailyChecks).length;

    // Import handler
    const handleImport = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                if (data.routines && data.dailyChecks) {
                    dispatch({ type: 'LOAD_STATE', state: data });
                    setShowImportModal(false);
                    alert('¡Datos importados correctamente!');
                } else {
                    alert('El archivo no contiene datos válidos de Prodits.');
                }
            } catch {
                alert('Error al leer el archivo. Asegúrate de que es un JSON válido.');
            }
        };
        reader.readAsText(file);
    };

    // Reset progress
    const handleResetProgress = () => {
        dispatch({ type: 'LOAD_STATE', state: { ...state, dailyChecks: {}, history: {}, energy: {} } });
        setShowResetConfirm(false);
    };

    // Delete all data
    const handleDeleteAll = () => {
        localStorage.removeItem('prodits_state');
        localStorage.removeItem('prodits_settings');
        window.location.reload();
    };

    const userPhoto = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;
    const userName = user?.user_metadata?.full_name || 'Usuario';
    const userInitial = (userName || user?.email || 'P')[0].toUpperCase();

    return (
        <div className="max-w-lg mx-auto px-4 sm:px-5 pt-4 pb-8">

            {/* ─── Perfil (clickeable) ──────────────────────── */}
            <button
                onClick={() => setShowProfileEdit(true)}
                className="w-full bg-white rounded-2xl ios-shadow p-5 mb-5 text-left active:scale-[0.98] transition-transform"
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden shadow-lg shadow-blue-200 flex-shrink-0">
                        {userPhoto ? (
                            <img src={userPhoto} alt="Perfil" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[var(--primary)] to-blue-400 flex items-center justify-center text-white text-2xl font-bold">
                                {userInitial}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="font-bold text-lg truncate">{userName}</h2>
                        <p className="text-xs text-[var(--text-secondary)] truncate">{user?.email}</p>
                    </div>
                    <span className="material-symbols-outlined text-gray-300 text-lg">chevron_right</span>
                </div>
                <div className="flex gap-3">
                    <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-[var(--primary)]">{totalRoutines}</p>
                        <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Rutinas</p>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-emerald-500">{totalDays}</p>
                        <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Días Activos</p>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-amber-500">{totalJournal}</p>
                        <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Diario</p>
                    </div>
                </div>
            </button>

            {/* ─── Notificaciones ───────────────────────────── */}
            <SectionCard title="Notificaciones">
                <SettingRow icon="notifications" label="Notificaciones" description="Recibe recordatorios de tus hábitos">
                    <Toggle value={settings.notifications} onChange={v => updateSetting('notifications', v)} />
                </SettingRow>
                <SettingRow icon="alarm" label="Recordatorio Diario" description="Te avisamos para que no olvides tus rutinas">
                    <Toggle value={settings.dailyReminder} onChange={v => updateSetting('dailyReminder', v)} />
                </SettingRow>
                {settings.dailyReminder && (
                    <SettingRow icon="schedule" label="Hora del recordatorio" description={settings.reminderTime}>
                        <input
                            type="time"
                            value={settings.reminderTime}
                            onChange={e => updateSetting('reminderTime', e.target.value)}
                            className="text-sm text-[var(--primary)] font-semibold bg-transparent outline-none"
                        />
                    </SettingRow>
                )}
                <SettingRow icon="volume_up" label="Sonidos" description="Reproducir sonidos al completar tareas">
                    <Toggle value={settings.sound} onChange={v => updateSetting('sound', v)} />
                </SettingRow>
                <SettingRow icon="vibration" label="Vibración" description="Vibrar al interactuar">
                    <Toggle value={settings.vibration} onChange={v => updateSetting('vibration', v)} />
                </SettingRow>
            </SectionCard>

            {/* ─── General ──────────────────────────────────── */}
            <SectionCard title="General">
                <SettingRow icon="calendar_month" label="Inicio de semana" description={settings.weekStart === 'lunes' ? 'Lunes' : 'Domingo'}>
                    <button
                        onClick={() => updateSetting('weekStart', settings.weekStart === 'lunes' ? 'domingo' : 'lunes')}
                        className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-semibold text-[var(--text-secondary)] hover:bg-gray-200 transition-colors"
                    >
                        {settings.weekStart === 'lunes' ? 'Lun' : 'Dom'}
                    </button>
                </SettingRow>
            </SectionCard>

            {/* ─── Datos ────────────────────────────────────── */}
            <SectionCard title="Tus Datos">
                <SettingRow
                    icon="download"
                    label="Exportar Datos"
                    description="Descarga una copia de tus datos"
                    onClick={() => {
                        exportData(state);
                        setShowExportDone(true);
                        setTimeout(() => setShowExportDone(false), 2000);
                    }}
                >
                    {showExportDone && (
                        <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            Listo
                        </span>
                    )}
                </SettingRow>
                <SettingRow
                    icon="upload"
                    label="Importar Datos"
                    description="Restaura desde una copia de seguridad"
                    onClick={() => setShowImportModal(true)}
                />
                <SettingRow
                    icon="restart_alt"
                    label="Reiniciar Progreso"
                    description="Borra el historial diario pero mantiene rutinas"
                    onClick={() => setShowResetConfirm(true)}
                    danger
                />
                <SettingRow
                    icon="delete_forever"
                    label="Borrar Todos los Datos"
                    description="Elimina toda la información de la app"
                    onClick={() => setShowDeleteConfirm(true)}
                    danger
                />
            </SectionCard>

            {/* ─── Cuenta ─────────────────────────────────── */}
            <SectionCard title="Cuenta">
                <SettingRow
                    icon="logout"
                    label="Cerrar Sesión"
                    description={user?.email}
                    onClick={() => setShowLogoutConfirm(true)}
                    danger
                />
            </SectionCard>

            {/* ─── Acerca de ────────────────────────────────── */}
            <SectionCard title="Acerca de">
                <SettingRow icon="info" label="Versión" description="Prodits v1.0.0">
                    <span className="text-xs text-[var(--text-secondary)] font-mono">1.0.0</span>
                </SettingRow>
                <SettingRow icon="code" label="Desarrollado con" description="React + Vite + TailwindCSS">
                    <span className="text-xs text-[var(--text-secondary)]">⚡</span>
                </SettingRow>
                <SettingRow icon="favorite" label="Hecho con amor" description="Para ayudarte a ser tu mejor versión" />
            </SectionCard>

            {/* Footer note */}
            <p className="text-center text-[10px] text-[var(--text-secondary)] mt-6 mb-2">
                Tus datos se sincronizan de forma segura en la nube.
                <br />Protegidos con Supabase.
            </p>

            {/* ─── Modals ───────────────────────────────────── */}
            {showResetConfirm && (
                <ConfirmModal
                    title="¿Reiniciar progreso?"
                    message="Se borrarán todos los registros diarios, historial y energía. Tus rutinas y diario se mantendrán intactos."
                    confirmLabel="Reiniciar"
                    onConfirm={handleResetProgress}
                    onClose={() => setShowResetConfirm(false)}
                    danger
                />
            )}

            {showDeleteConfirm && (
                <ConfirmModal
                    title="¿Borrar todo?"
                    message="Esta acción eliminará permanentemente todas tus rutinas, progreso, diario y configuración. Esta acción no se puede deshacer."
                    confirmLabel="Borrar Todo"
                    onConfirm={handleDeleteAll}
                    onClose={() => setShowDeleteConfirm(false)}
                    danger
                />
            )}

            {showLogoutConfirm && (
                <ConfirmModal
                    title="¿Cerrar sesión?"
                    message="Tus datos están sincronizados en la nube. Podrás acceder a ellos cuando vuelvas a iniciar sesión."
                    confirmLabel="Cerrar Sesión"
                    onConfirm={async () => { await signOut(); setShowLogoutConfirm(false); }}
                    onClose={() => setShowLogoutConfirm(false)}
                    danger
                />
            )}

            {showImportModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowImportModal(false)}>
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm ios-shadow" onClick={e => e.stopPropagation()}>
                        <div className="text-center mb-6">
                            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-2xl text-[var(--primary)]">upload_file</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2">Importar Datos</h3>
                            <p className="text-sm text-[var(--text-secondary)]">Selecciona un archivo de copia de seguridad (.json) previamente exportado.</p>
                        </div>
                        <label className="block w-full py-3 rounded-2xl font-bold text-sm text-white bg-[var(--primary)] hover:opacity-90 transition-opacity text-center cursor-pointer mb-3">
                            Seleccionar Archivo
                            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                        </label>
                        <button
                            onClick={() => setShowImportModal(false)}
                            className="w-full py-3 rounded-2xl font-bold text-sm bg-gray-100 text-[var(--text-main)] hover:bg-gray-200 transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* ─── Edit Profile Modal ─────────────────────────── */}
            {showProfileEdit && (
                <EditProfileModal
                    user={user}
                    userPhoto={userPhoto}
                    userName={userName}
                    userInitial={userInitial}
                    updateProfile={updateProfile}
                    onClose={() => setShowProfileEdit(false)}
                />
            )}
        </div>
    );
}

// ─── Edit Profile Modal ─────────────────────────────────────
function EditProfileModal({ user, userPhoto, userName, userInitial, updateProfile, onClose }) {
    const [name, setName] = useState(userName);
    const [photoPreview, setPhotoPreview] = useState(userPhoto);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const fileInputRef = useState(null);

    const handlePhotoSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            alert('La imagen es muy grande. Máximo 2MB.');
            return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => {
            setPhotoPreview(ev.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const updates = {};
            if (name !== userName) updates.fullName = name;
            if (photoPreview !== userPhoto) updates.avatarUrl = photoPreview;

            if (Object.keys(updates).length > 0) {
                const { error } = await updateProfile(updates);
                if (error) {
                    alert('Error al guardar: ' + error.message);
                    setSaving(false);
                    return;
                }
            }
            setSaved(true);
            setTimeout(() => {
                onClose();
            }, 800);
        } catch (err) {
            alert('Error inesperado al guardar.');
        }
        setSaving(false);
    };

    const { dragY, handlers, resetDrag } = useSwipeToClose(onClose);

    useEffect(() => {
        return () => resetDrag();
    }, []);

    return (
        <div
            className="fixed z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4"
            style={{
                top: '-env(safe-area-inset-top, 0px)',
                left: 0, right: 0, bottom: 0,
                paddingTop: 'env(safe-area-inset-top, 0px)',
                backgroundColor: 'transparent'
            }}
            onClick={onClose}
        >
            <div
                className={`bg-white rounded-t-[2.5rem] sm:rounded-3xl p-6 pt-3 w-full sm:max-w-sm ios-shadow overflow-hidden ${dragY > 0 ? '' : 'animate-slide-up'}`}
                style={{
                    transform: `translateY(${dragY}px)`,
                    transition: dragY > 0 ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Drag Handle Area */}
                <div
                    className="cursor-grab active:cursor-grabbing touch-none py-2 -mt-2 -mx-6 mb-2"
                    {...handlers}
                >
                    <div className="w-12 h-1.5 rounded-full bg-gray-200/80 mx-auto" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold">Editar Perfil</h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-transform">
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>

                {/* Photo */}
                <div className="flex flex-col items-center mb-6">
                    <div className="relative mb-3">
                        <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-white">
                            {photoPreview ? (
                                <img src={photoPreview} alt="Perfil" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[var(--primary)] to-blue-400 flex items-center justify-center text-white text-3xl font-bold">
                                    {userInitial}
                                </div>
                            )}
                        </div>
                        <label className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white shadow-lg cursor-pointer active:scale-90 transition-transform">
                            <span className="material-symbols-outlined text-sm">photo_camera</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoSelect}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">Toca la cámara para cambiar la foto</p>
                </div>

                {/* Name */}
                <div className="mb-6">
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Nombre</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-[#F2F2F7] border-none rounded-2xl py-3 px-4 text-base font-medium focus:ring-2 focus:ring-[var(--primary)]/20 transition-all outline-none"
                        placeholder="Tu nombre"
                    />
                </div>

                {/* Email (read-only) */}
                <div className="mb-6">
                    <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">Correo electrónico</label>
                    <div className="w-full bg-[#F2F2F7] rounded-2xl py-3 px-4 text-base text-[var(--text-secondary)]">
                        {user?.email}
                    </div>
                </div>

                {/* Save */}
                <button
                    onClick={handleSave}
                    disabled={saving || saved}
                    className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all ${saved
                        ? 'bg-emerald-500 text-white'
                        : saving
                            ? 'bg-gray-200 text-gray-400'
                            : 'bg-[var(--primary)] text-white hover:opacity-90 active:scale-[0.98]'
                        }`}
                >
                    {saved ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                            ¡Guardado!
                        </span>
                    ) : saving ? (
                        'Guardando...'
                    ) : (
                        'Guardar Cambios'
                    )}
                </button>
            </div>
        </div>
    );
}
