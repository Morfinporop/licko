import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from './Button';

export function Navbar() {
  const { isAuthenticated, user, logout, isAdmin } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src="https://png.pngtree.com/png-clipart/20210606/original/pngtree-bio-logo-green-organic-leaf-png-image_6387668.jpg" alt="BioLink" className="w-9 h-9 rounded-full object-cover group-hover:scale-110 transition-transform duration-300" />
            <span className="text-white font-bold text-lg tracking-tight">Bio<span className="text-green-500">Link</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm text-gray-500 hover:text-white transition-colors duration-200">Главная</Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="text-sm text-gray-500 hover:text-white transition-colors duration-200">Кабинет</Link>
                <Link to="/editor" className="text-sm text-gray-500 hover:text-white transition-colors duration-200">Редактор</Link>
                {isAdmin && (
                  <Link to="/admin" className="text-sm text-green-400 hover:text-green-300 transition-colors duration-200 font-medium">
                    Админ
                  </Link>
                )}
              </>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-xs text-green-400 font-medium">
                        {user?.username?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-300 hidden sm:block">@{user?.username}</span>
                  </div>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:block">Выход</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Войти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Регистрация</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
