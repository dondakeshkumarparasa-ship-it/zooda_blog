import { Shield, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface LoginScreenProps {
  onSubmit: (password: string) => void;
}

export function LoginScreen({ onSubmit }: LoginScreenProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <div className="min-h-screen bg-[#D4ECFC] flex items-center justify-center p-4 relative font-sans">
      <button 
        type="button" 
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white hover:bg-slate-100 text-slate-800 flex items-center justify-center text-xl transition-all shadow-sm z-20" 
        onClick={() => window.location.href = '/'}
      >
        &times;
      </button>

      <div className="w-full max-w-md relative">
        <div className="bg-white rounded-[32px] shadow-xl p-10 text-slate-800">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-[18px] bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Shield className="h-8 w-8 text-slate-400" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign in as Admin</h1>
            <p className="text-slate-500 mt-2 text-sm max-w-[320px] mx-auto leading-relaxed">
              Access your Zooda account to bring your store, posts, and teams together. For free
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            <button 
              type="submit"
              className="w-full py-4 rounded-2xl bg-[#0F1322] hover:bg-[#1C243B] text-white font-bold text-base shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 transition-all duration-300 mt-6"
            >
              Get Started
            </button>
          </form>

          <div className="flex items-center my-6 text-slate-400 text-[10px] font-bold tracking-widest uppercase">
            <div className="flex-1 border-b border-dashed border-slate-200"></div>
            <span className="px-3">Or sign in with</span>
            <div className="flex-1 border-b border-dashed border-slate-200"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button type="button" className="flex items-center justify-center gap-2 bg-white border border-slate-200 py-3 rounded-2xl text-slate-900 text-sm font-semibold hover:bg-slate-50 transition-colors">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Google</span>
            </button>
            <button type="button" className="flex items-center justify-center gap-2 bg-white border border-slate-200 py-3 rounded-2xl text-slate-900 text-sm font-semibold hover:bg-slate-50 transition-colors">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Protected by local authentication
          </p>
        </div>
      </div>
    </div>
  );
}

interface SetupPasswordScreenProps {
  onSubmit: (password: string, confirm: string) => void;
}

export function SetupPasswordScreen({ onSubmit }: SetupPasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password, confirm);
  };

  return (
    <div className="min-h-screen bg-[#D4ECFC] flex items-center justify-center p-4 relative font-sans">
      <button 
        type="button" 
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white hover:bg-slate-100 text-slate-800 flex items-center justify-center text-xl transition-all shadow-sm z-20" 
        onClick={() => window.location.href = '/'}
      >
        &times;
      </button>

      <div className="w-full max-w-md relative">
        <div className="bg-white rounded-[32px] shadow-xl p-10 text-slate-800">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-[18px] bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Shield className="h-8 w-8 text-slate-400" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Set Admin Password</h1>
            <p className="text-slate-500 mt-2 text-sm max-w-[320px] mx-auto leading-relaxed">
              First time setup. Create a secure password to protect your admin dashboard.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="New password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all text-sm"
              />
            </div>
            
            <button 
              type="submit"
              className="w-full py-4 rounded-2xl bg-[#0F1322] hover:bg-[#1C243B] text-white font-bold text-base shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 transition-all duration-300 mt-6"
            >
              Set Password
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Your password is stored locally in your browser
          </p>
        </div>
      </div>
    </div>
  );
}
