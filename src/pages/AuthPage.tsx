import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

export function AuthPage() {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const navigate = useNavigate();
  const { setAuth, isAuthenticated } = useAuthStore();

  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [usernameCheck, setUsernameCheck] = useState<null | boolean>(null);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const checkUsername = async (username: string) => {
    if (username.length < 3) { setUsernameCheck(null); return; }
    try {
      const res = await authApi.checkUsername(username);
      setUsernameCheck(res.data.available);
    } catch {
      setUsernameCheck(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (name === 'username') {
      const timer = setTimeout(() => checkUsername(value), 500);
      return () => clearTimeout(timer);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'At least 6 characters';
    if (!isLogin) {
      if (!form.username) errs.username = 'Username is required';
      else if (!/^[a-zA-Z0-9_-]{3,30}$/.test(form.username)) errs.username = 'Letters, numbers, _ and - only (3-30)';
      else if (usernameCheck === false) errs.username = 'Username is taken';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (isLogin) {
        const res = await authApi.login({ email: form.email, password: form.password });
        setAuth(res.data.user, res.data.token);
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        const res = await authApi.register(form);
        setAuth(res.data.user, res.data.token);
        toast.success('Account created!');
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Something went wrong';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 pt-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-green-500/5 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-green-500/3 rounded-full blur-[100px]" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(34,197,94,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <img src="https://png.pngtree.com/png-clipart/20210606/original/pngtree-bio-logo-green-organic-leaf-png-image_6387668.jpg" alt="BioLink" className="w-10 h-10 rounded-full object-cover" />
            <span className="text-white font-bold text-xl">Bio<span className="text-green-500">Link</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white">
            {isLogin ? 'С возвращением' : 'Создайте аккаунт'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isLogin ? 'Войдите для управления вашей страницей' : 'Начните создавать свою био-страницу сегодня'}
          </p>
        </div>

        <GlassCard className="p-8" glow>
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="relative">
                <Input
                  label="Имя пользователя"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="ваш_username"
                  error={errors.username}
                  hint="Это будет ваша публичная ссылка: /u/username"
                  leftIcon={<span className="text-green-500/60 text-sm font-mono">@</span>}
                />
                {form.username.length >= 3 && usernameCheck !== null && (
                  <div className={`absolute right-3 top-9 text-xs font-medium ${usernameCheck ? 'text-green-400' : 'text-red-400'}`}>
                    {usernameCheck ? '✓ Доступно' : '✗ Занято'}
                  </div>
                )}
              </div>
            )}

            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@example.com"
              error={errors.email}
              leftIcon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />

            <Input
              label="Пароль"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.password}
              hint={!isLogin ? 'Минимум 6 символов' : undefined}
              leftIcon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
              {isLogin ? 'Войти' : 'Создать аккаунт'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {isLogin ? "Нет аккаунта?" : 'Уже есть аккаунт?'}{' '}
            <Link
              to={isLogin ? '/register' : '/login'}
              className="text-green-400 hover:text-green-300 transition-colors font-medium"
            >
              {isLogin ? 'Зарегистрироваться' : 'Войти'}
            </Link>
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
