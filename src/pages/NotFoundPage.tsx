import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-red-500/5 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-red-500/3 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 text-center max-w-md">
        <GlassCard className="p-12" glow>
          <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700 mb-4">
            404
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
          <p className="text-gray-500 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/">
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 text-black font-semibold hover:bg-green-400 transition-all duration-200 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </button>
          </Link>
        </GlassCard>
      </div>
    </div>
  );
}
