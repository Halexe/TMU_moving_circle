
import React, { useState, useEffect } from 'react';
import { OperativeProfile } from '../types';
import { Trophy, Zap, Activity, TrendingUp, Award, Target, ArrowRight, Globe, Users, Server } from 'lucide-react';

// Constants for calculations (based on TheoryPage)
const FORCE_PER_PUSH_N = 500;
const DISTANCE_PER_PUSH_M = 0.0000245;
const GOAL_DISTANCE_M = 45000; // Approx distance to Marunouchi

// Mock Global Data (Simulating server aggregation)
const MOCK_GLOBAL_STATS = {
    activeOperatives: 9421,
    baseTotalPushes: 15840200, // Start with ~15.8 million pushes
};

// Rank Logic
const RANKS = [
    { threshold: 0, title: "訓練生 (Trainee)", color: "text-neutral-500" },
    { threshold: 10, title: "二等兵 (Private)", color: "text-neutral-400" },
    { threshold: 50, title: "上等兵 (Private First Class)", color: "text-neutral-300" },
    { threshold: 100, title: "伍長 (Corporal)", color: "text-green-600" },
    { threshold: 500, title: "軍曹 (Sergeant)", color: "text-green-500" },
    { threshold: 1000, title: "少尉 (Second Lieutenant)", color: "text-blue-500" },
    { threshold: 5000, title: "大尉 (Captain)", color: "text-blue-400" },
    { threshold: 10000, title: "少佐 (Major)", color: "text-red-500" },
    { threshold: 50000, title: "大佐 (Colonel)", color: "text-red-600" },
    { threshold: 100000, title: "将軍 (General)", color: "text-yellow-500" },
];

const getRank = (pushes: number) => {
    // Find the highest rank where threshold <= pushes
    return [...RANKS].reverse().find(r => pushes >= r.threshold) || RANKS[0];
};

const getNextRank = (pushes: number) => {
    return RANKS.find(r => r.threshold > pushes) || null;
};

// Achievement Logic
const ACHIEVEMENTS = [
    { id: 'first_step', threshold: 1, title: "最初の一歩", desc: "物理的移動を開始した。", icon: Activity },
    { id: 'kilo_pusher', threshold: 100, title: "センチュリオン", desc: "100回の推力を供給した。", icon: Zap },
    { id: 'millimeter', threshold: 41, title: "1ミリの奇跡", desc: "計算上、キャンパスを1mm動かした (約41回)。", icon: TrendingUp },
    { id: 'dedication', threshold: 500, title: "忠実なる推進者", desc: "500回の貢献を達成。", icon: Target },
    { id: 'elite', threshold: 1000, title: "エリート工作員", desc: "1000回達成。もはや趣味ではない。", icon: Award },
    { id: 'legend', threshold: 10000, title: "伝説の英雄", desc: "1万回達成。銅像が立つレベル。", icon: Trophy },
];

const StatCard = ({ label, value, unit, subtext, icon: Icon, colorClass = "text-white", borderClass = "border-neutral-800" }: any) => (
    <div className={`bg-neutral-900/50 border ${borderClass} p-6 rounded-xl relative overflow-hidden group hover:bg-neutral-900 transition-all`}>
        <div className={`absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity ${colorClass}`}>
            <Icon size={48} />
        </div>
        <div className="relative z-10">
            <div className="text-neutral-500 text-xs font-mono uppercase tracking-widest mb-2">{label}</div>
            <div className="flex items-baseline gap-1">
                <span className={`text-3xl font-black ${colorClass} font-mono`}>{value}</span>
                <span className="text-neutral-400 text-sm">{unit}</span>
            </div>
            {subtext && <div className="text-xs text-neutral-600 mt-2 font-mono">{subtext}</div>}
        </div>
    </div>
);

const StatsPage = () => {
    const [profile, setProfile] = useState<OperativeProfile | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('tmu_operative_profile');
        if (saved) {
            setProfile(JSON.parse(saved));
        }
    }, []);

    if (!profile) {
        return <div className="text-center py-20 text-neutral-500">戦術データ取得中...</div>;
    }

    const currentRank = getRank(profile.totalPushes);
    const nextRank = getNextRank(profile.totalPushes);
    
    // Personal Calcs
    const personalForce = profile.totalPushes * FORCE_PER_PUSH_N;
    const personalDistance = profile.totalPushes * DISTANCE_PER_PUSH_M;
    
    // Global Calcs (Mocked + Personal)
    const globalPushes = MOCK_GLOBAL_STATS.baseTotalPushes + profile.totalPushes;
    const globalDistance = globalPushes * DISTANCE_PER_PUSH_M;
    const globalProgressPercent = (globalDistance / GOAL_DISTANCE_M) * 100;

    // Rank Progress
    let rankProgress = 100;
    if (nextRank) {
        const prevThreshold = currentRank.threshold;
        const nextThreshold = nextRank.threshold;
        rankProgress = ((profile.totalPushes - prevThreshold) / (nextThreshold - prevThreshold)) * 100;
    }

    return (
        <div className="animate-in fade-in duration-700 pb-12">
            {/* Header */}
            <div className="mb-8 border-b border-neutral-800 pb-6">
                <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                    <Activity className="text-red-500" />
                    戦術データ記録 (TACTICAL DATA LOG)
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm font-mono text-neutral-500">
                    <span>ID: <span className="text-neutral-300">{profile.id}</span></span>
                    <span className="hidden sm:inline">|</span>
                    <span>NAME: <span className="text-neutral-300">{profile.codename}</span></span>
                    <span className="hidden sm:inline">|</span>
                    <span>CLASS: <span className={`${currentRank.color} font-bold`}>{currentRank.title}</span></span>
                </div>
            </div>

            {/* --- GLOBAL CAMPAIGN STATUS --- */}
            <div className="mb-12">
                <h3 className="text-neutral-400 text-xs font-mono uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Globe size={14} /> グローバル作戦状況 (集計値)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-neutral-950 border border-red-900/30 p-6 rounded-lg flex flex-col justify-between shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-3 mb-2 text-red-500">
                            <Server size={20} />
                            <span className="text-xs font-bold uppercase tracking-wider">総供給推力</span>
                        </div>
                        <div>
                            <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                                {globalPushes.toLocaleString()}
                            </div>
                            <div className="text-xs text-neutral-500 font-mono mt-1">総プッシュ回数 (全エージェント)</div>
                        </div>
                    </div>

                    <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-lg flex flex-col justify-between">
                         <div className="flex items-center gap-3 mb-2 text-cyan-500">
                            <TrendingUp size={20} />
                            <span className="text-xs font-bold uppercase tracking-wider">総移動距離</span>
                        </div>
                         <div>
                            <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                                {globalDistance.toFixed(3)} <span className="text-lg text-neutral-500">m</span>
                            </div>
                            <div className="text-xs text-neutral-500 font-mono mt-1">理論上の全学移動距離</div>
                        </div>
                    </div>

                    <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-lg flex flex-col justify-between">
                        <div className="flex items-center gap-3 mb-2 text-yellow-500">
                            <Users size={20} />
                            <span className="text-xs font-bold uppercase tracking-wider">参加工作員数</span>
                        </div>
                         <div>
                            <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                                {MOCK_GLOBAL_STATS.activeOperatives.toLocaleString()}
                            </div>
                            <div className="text-xs text-neutral-500 font-mono mt-1">展開中のエージェント</div>
                        </div>
                    </div>
                </div>

                 {/* Global Progress Bar */}
                 <div className="mt-6 bg-neutral-900 border border-neutral-800 rounded-lg p-6 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4 text-sm font-mono">
                        <span className="text-cyan-500">現在地</span>
                        <div className="flex items-center gap-2 text-neutral-600">
                            <span className="text-xs">TARGET</span>
                            <ArrowRight size={14} />
                        </div>
                        <span className="text-red-500">丸の内 (Marunouchi)</span>
                    </div>
                    
                    <div className="h-4 bg-black rounded-full border border-neutral-800 relative overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-red-900 to-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)] relative"
                            style={{ width: `${Math.max(globalProgressPercent * 10, 1)}%` }} 
                        >
                             <div className="absolute right-0 top-0 bottom-0 w-px bg-white/50"></div>
                        </div>
                    </div>
                    
                    <div className="mt-3 flex justify-between text-[10px] text-neutral-500 font-mono uppercase">
                        <span>作戦進捗率: {globalProgressPercent.toFixed(6)}%</span>
                        <span>完了予定: 56.0 年後</span>
                    </div>
                </div>
            </div>

            {/* --- PERSONAL STATS --- */}
            <div className="mb-8 pt-8 border-t border-neutral-800">
                 <h3 className="text-neutral-400 text-xs font-mono uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Target size={14} /> 個人戦績 (Personal Performance)
                </h3>

                {/* Rank Progress Card */}
                <div className="mb-6 bg-neutral-900/30 p-6 rounded-xl border border-neutral-800">
                    {nextRank ? (
                        <>
                            <div className="flex justify-between text-xs uppercase tracking-widest text-neutral-500 mb-2">
                                <span>次期昇進 (Next Promotion)</span>
                                <span className={nextRank.color}>{nextRank.title}</span>
                            </div>
                            <div className="h-2 bg-black rounded-full overflow-hidden border border-neutral-800">
                                <div 
                                    className="h-full bg-white/20"
                                    style={{ width: `${rankProgress}%` }}
                                ></div>
                            </div>
                            <div className="mt-2 text-right text-xs font-mono text-neutral-400">
                                {profile.totalPushes.toLocaleString()} / {nextRank.threshold.toLocaleString()} REQ
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-yellow-500 font-bold text-sm uppercase tracking-widest">
                            最高ランク到達 (Maximum Rank Achieved)
                        </div>
                    )}
                </div>

                {/* Personal Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard 
                        label="総プッシュ数" 
                        value={profile.totalPushes.toLocaleString()} 
                        unit="回" 
                        icon={Zap}
                        colorClass="text-yellow-500"
                        borderClass="border-yellow-500/20"
                    />
                    <StatCard 
                        label="総発生推力" 
                        value={(personalForce / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} 
                        unit="kN" 
                        subtext="500N / 回"
                        icon={Activity}
                        colorClass="text-red-500"
                    />
                    <StatCard 
                        label="貢献移動距離" 
                        value={(personalDistance * 1000).toLocaleString(undefined, { maximumFractionDigits: 2 })} 
                        unit="mm" 
                        subtext="理論上の貢献値"
                        icon={TrendingUp}
                        colorClass="text-cyan-500"
                    />
                    <StatCard 
                        label="燃焼カロリー" 
                        value={(profile.totalPushes * 0.5).toFixed(1)} 
                        unit="kcal" 
                        subtext="推定 0.5kcal / 回"
                        icon={Target}
                        colorClass="text-green-500"
                    />
                </div>
            </div>

            {/* Achievements */}
            <div>
                <h3 className="text-neutral-400 text-xs font-mono uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Award size={14} /> 勲章・実績 (Medals & Commendations)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ACHIEVEMENTS.map((ach) => {
                        const isUnlocked = profile.totalPushes >= ach.threshold;
                        const Icon = ach.icon;
                        return (
                            <div 
                                key={ach.id}
                                className={`p-4 rounded-lg border flex items-start gap-4 transition-all
                                    ${isUnlocked 
                                        ? 'bg-neutral-900 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]' 
                                        : 'bg-neutral-950 border-neutral-800 opacity-50'
                                    }`}
                            >
                                <div className={`p-2 rounded bg-neutral-950 border shrink-0 ${isUnlocked ? 'border-yellow-500 text-yellow-500' : 'border-neutral-700 text-neutral-700'}`}>
                                    <Icon size={20} />
                                </div>
                                <div>
                                    <h4 className={`font-bold text-sm ${isUnlocked ? 'text-white' : 'text-neutral-500'}`}>
                                        {ach.title}
                                    </h4>
                                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{ach.desc}</p>
                                    {!isUnlocked && (
                                        <div className="text-[10px] text-neutral-600 mt-2 font-mono uppercase border-t border-neutral-800 pt-1 inline-block">
                                            未解除 (必要数: {ach.threshold})
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StatsPage;