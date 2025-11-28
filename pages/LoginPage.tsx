
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, Terminal, AlertTriangle, ChevronRight } from 'lucide-react';

const LoginPage = () => {
  const [id, setId] = useState('');
  const [code, setCode] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect back to where they came from, or operation page
  const from = (location.state as any)?.from?.pathname || '/operation';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !code) return;

    setIsAuthenticating(true);
    await login(id, code);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-neutral-900/80 border border-red-900/50 rounded-lg p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
        
        {/* Decor Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse"></div>
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-900/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center border border-red-500/30 mb-4">
            <Shield className="text-red-500" size={32} />
          </div>
          <h1 className="text-xl font-black text-white tracking-widest uppercase mb-1">
            アクセス制限区域 (Restricted)
          </h1>
          <p className="text-xs text-red-500 font-mono uppercase">
            TMU 統合戦術ネットワーク
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-neutral-500 uppercase flex items-center gap-2">
              <Terminal size={12} /> 学籍番号 / エージェントID
            </label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full bg-black/50 border border-neutral-800 text-white px-4 py-3 rounded focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-mono tracking-widest placeholder-neutral-700"
              placeholder="12345678"
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-neutral-500 uppercase flex items-center gap-2">
              <Lock size={12} /> セキュリティコード
            </label>
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-black/50 border border-neutral-800 text-white px-4 py-3 rounded focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-mono tracking-widest placeholder-neutral-700"
              placeholder="••••••••"
            />
          </div>

          <div className="bg-red-900/10 border border-red-900/30 p-3 rounded flex items-start gap-3">
            <AlertTriangle className="text-red-500 shrink-0" size={16} />
            <p className="text-[10px] text-neutral-400 leading-tight">
              警告: 物理キャンパス移転システムへの不正アクセスは、大学兵站規則に対する重大な違反行為です。全ての入力された運動エネルギーはログに記録されます。
            </p>
          </div>

          <button
            type="submit"
            disabled={isAuthenticating || !id || !code}
            className={`w-full py-4 rounded font-bold text-sm uppercase tracking-widest transition-all relative overflow-hidden group
              ${isAuthenticating 
                ? 'bg-neutral-800 text-neutral-500 cursor-wait' 
                : 'bg-red-700 text-white hover:bg-red-600 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]'
              }`}
          >
            {isAuthenticating ? (
              <span className="flex items-center justify-center gap-2 animate-pulse">
                認証中...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                リンク確立 <ChevronRight size={16} />
              </span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[10px] text-neutral-600 font-mono">
            ENCRYPTION: AES-256 // PROTOCOL: MOVING-TMU-V3
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;