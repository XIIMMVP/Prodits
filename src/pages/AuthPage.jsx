import { useState } from 'react';
import { useAuth } from '../store/AuthContext';

export default function AuthPage() {
    const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
    const [mode, setMode] = useState('login'); // login | register | reset
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            if (mode === 'reset') {
                const { error } = await resetPassword(email);
                if (error) throw error;
                setMessage('Te hemos enviado un enlace para restablecer tu contraseña.');
                setLoading(false);
                return;
            }

            if (mode === 'register') {
                const { error } = await signUp(email, password, name);
                if (error) throw error;
                setMessage('¡Cuenta creada! Revisa tu correo para verificar tu cuenta.');
            } else {
                const { error } = await signIn(email, password);
                if (error) throw error;
            }
        } catch (err) {
            setError(err.message || 'Ha ocurrido un error');
        }
        setLoading(false);
    };

    const handleGoogle = async () => {
        setError('');
        const { error } = await signInWithGoogle();
        if (error) setError(error.message);
    };

    return (
        <div className="min-h-screen min-h-[100dvh] bg-[var(--bg-main)] flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-6 sm:mb-10">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[var(--primary)] to-blue-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-200">
                        <span className="text-3xl sm:text-4xl">🎯</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Prodits</h1>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Tu gestor de hábitos</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl ios-shadow p-5 sm:p-6">
                    <h2 className="text-xl font-bold mb-6 text-center">
                        {mode === 'login' ? 'Iniciar Sesión' : mode === 'register' ? 'Crear Cuenta' : 'Restablecer Contraseña'}
                    </h2>

                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 rounded-2xl p-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-red-500 text-sm">error</span>
                            <p className="text-xs text-red-600">{error}</p>
                        </div>
                    )}

                    {message && (
                        <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                            <p className="text-xs text-emerald-600">{message}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                        {mode === 'register' && (
                            <div>
                                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 block">Nombre</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Tu nombre"
                                    required
                                    className="w-full border border-[var(--border)] rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
                                />
                            </div>
                        )}

                        <div>
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 block">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                required
                                className="w-full border border-[var(--border)] rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
                            />
                        </div>

                        {mode !== 'reset' && (
                            <div>
                                <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5 block">Contraseña</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="w-full border border-[var(--border)] rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-[var(--primary)] text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading && (
                                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                            )}
                            {mode === 'login' ? 'Entrar' : mode === 'register' ? 'Crear Cuenta' : 'Enviar Enlace'}
                        </button>
                    </form>

                    {mode !== 'reset' && (
                        <>
                            <div className="flex items-center gap-3 my-4 sm:my-5">
                                <div className="flex-1 h-px bg-gray-200" />
                                <span className="text-xs text-[var(--text-secondary)]">o</span>
                                <div className="flex-1 h-px bg-gray-200" />
                            </div>

                            <button
                                onClick={handleGoogle}
                                className="w-full py-3 bg-white border border-gray-200 rounded-2xl font-semibold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
                            >
                                <svg width="18" height="18" viewBox="0 0 18 18">
                                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                                    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                                </svg>
                                Continuar con Google
                            </button>
                        </>
                    )}

                    {/* Footer links */}
                    <div className="mt-6 text-center space-y-2">
                        {mode === 'login' && (
                            <>
                                <button onClick={() => { setMode('reset'); setError(''); setMessage(''); }} className="text-xs text-[var(--primary)] font-semibold hover:underline block mx-auto">
                                    ¿Olvidaste tu contraseña?
                                </button>
                                <p className="text-xs text-[var(--text-secondary)]">
                                    ¿No tienes cuenta?{' '}
                                    <button onClick={() => { setMode('register'); setError(''); setMessage(''); }} className="text-[var(--primary)] font-semibold hover:underline">
                                        Regístrate
                                    </button>
                                </p>
                            </>
                        )}
                        {mode === 'register' && (
                            <p className="text-xs text-[var(--text-secondary)]">
                                ¿Ya tienes cuenta?{' '}
                                <button onClick={() => { setMode('login'); setError(''); setMessage(''); }} className="text-[var(--primary)] font-semibold hover:underline">
                                    Inicia sesión
                                </button>
                            </p>
                        )}
                        {mode === 'reset' && (
                            <button onClick={() => { setMode('login'); setError(''); setMessage(''); }} className="text-xs text-[var(--primary)] font-semibold hover:underline">
                                ← Volver al inicio de sesión
                            </button>
                        )}
                    </div>
                </div>

                <p className="text-center text-[10px] text-[var(--text-secondary)] mt-6">
                    Tus datos se sincronizan de forma segura en la nube.
                </p>
            </div>
        </div>
    );
}
