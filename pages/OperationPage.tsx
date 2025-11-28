
import React, { useState, useEffect, useMemo } from 'react';
import { getDistance } from '../utils/geo';
import { CAMPUSES, CHECKIN_RADIUS_METERS, TOKYO_STATION } from '../constants';
import { RankingEntry, OperativeProfile } from '../types';
import { Crosshair, Navigation, User, RefreshCw, Trophy, MapPin, Edit3, Copy, Key, Check, LogIn } from 'lucide-react';

// Mock Data for Ranking
const MOCK_NAMES = ["TMU_Squire", "Hino_Defender", "Arakawa_Medic", "Physics_Fan", "Ramen_Lover", "Credits_Lost"];
const generateMockRanking = (): RankingEntry[] => {
    return Array.from({ length: 10 }).map((_, i) => ({
        rank: i + 1,
        name: MOCK_NAMES[i % MOCK_NAMES.length] + `_${Math.floor(Math.random() * 100)}`,
        count: Math.floor(10000 / (i + 1)) + Math.floor(Math.random() * 500),
        lastActive: "Just now"
    }));
};

// --- Utility: ID Generator ---
const generateTacticalId = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `TMU-${result.slice(0, 4)}-${result.slice(4)}`;
};

const TacticalMap = ({ userLat, userLng }: { userLat: number | null, userLng: number | null }) => {
    // Adjusted bounds for ~16:9 aspect ratio centering on Tokyo/Tama area
    const BOUNDS = {
        minLat: 35.53,
        maxLat: 35.85,
        minLng: 139.25, 
        maxLng: 139.85
    };

    const toPercentX = (lng: number) => ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100;
    const toPercentY = (lat: number) => 100 - ((lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;

    return (
        <div className="w-full aspect-video bg-neutral-950 border border-neutral-800 rounded-xl relative overflow-hidden mb-8 shadow-2xl ring-1 ring-white/5 group">
            {/* Grid & Decor */}
            <div className="absolute inset-0 opacity-10"
                 style={{
                    backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                 }}>
            </div>
            <div className="absolute top-4 left-4 text-[10px] font-mono text-neutral-600 pointer-events-none z-30 leading-tight">
                SECTOR: TOKYO METROPOLIS (東京都全域)<br/>
                SCALE: 1:100000
            </div>

            {/* Connection Lines (Vectors) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                {CAMPUSES.map(c => (
                    <line
                        key={`line-${c.name}`}
                        x1={`${toPercentX(c.lng)}%`}
                        y1={`${toPercentY(c.lat)}%`}
                        x2={`${toPercentX(TOKYO_STATION.lng)}%`}
                        y2={`${toPercentY(TOKYO_STATION.lat)}%`}
                        stroke="#dc2626"
                        strokeWidth="1"
                        strokeDasharray="2 4"
                    />
                ))}
            </svg>

            {/* Tokyo Station (Target) */}
            <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ left: `${toPercentX(TOKYO_STATION.lng)}%`, top: `${toPercentY(TOKYO_STATION.lat)}%` }}
            >
                <div className="w-6 h-6 border border-red-500/50 rounded-full animate-ping absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative group/marker cursor-help">
                   <MapPin size={20} className="text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-900/90 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none border border-red-500/50 z-50">
                       TARGET: MARUNOUCHI
                   </div>
                </div>
            </div>

            {/* Campuses */}
            {CAMPUSES.map(c => (
                <div
                    key={c.name}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                    style={{ left: `${toPercentX(c.lng)}%`, top: `${toPercentY(c.lat)}%` }}
                >
                    <div className="w-2 h-2 bg-cyan-500 rounded-sm shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                    <div className="text-[10px] text-cyan-400/70 font-mono absolute top-3 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
                        {c.name}
                    </div>
                </div>
            ))}

            {/* User Position */}
            {userLat && userLng && (
                <div
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-1000 ease-in-out"
                    style={{ left: `${toPercentX(userLng)}%`, top: `${toPercentY(userLat)}%` }}
                >
                    <div className="w-4 h-4 bg-yellow-500 rounded-full opacity-20 animate-ping absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,1)] border border-black"></div>
                    <div className="text-[9px] text-yellow-400 font-mono font-bold absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap drop-shadow-md bg-black/50 px-1 rounded">
                        YOU
                    </div>
                </div>
            )}
        </div>
    );
};

const OperationPage = () => {
    const [geoState, setGeoState] = useState<{ lat: number | null; lng: number | null; error: string | null }>({
        lat: null, lng: null, error: null
    });
    
    // Profile State
    const [profile, setProfile] = useState<OperativeProfile>(() => {
        const saved = localStorage.getItem('tmu_operative_profile');
        if (saved) return JSON.parse(saved);
        
        // Init new profile
        const newProfile: OperativeProfile = {
            id: generateTacticalId(),
            codename: `Agent_${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
            totalPushes: 0,
            joinedAt: Date.now()
        };
        localStorage.setItem('tmu_operative_profile', JSON.stringify(newProfile));
        return newProfile;
    });

    const [ranking, setRanking] = useState<RankingEntry[]>([]);
    const [isPushing, setIsPushing] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [editName, setEditName] = useState('');
    const [isEnteringId, setIsEnteringId] = useState(false);
    const [inputId, setInputId] = useState('');
    const [copyFeedback, setCopyFeedback] = useState(false);

    // Initialize Ranking
    useEffect(() => {
        setRanking(generateMockRanking());
    }, []);

    // Watch Position
    useEffect(() => {
        if (!navigator.geolocation) {
            setGeoState(prev => ({ ...prev, error: "Geolocation not supported" }));
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                setGeoState({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                    error: null
                });
            },
            (err) => {
                setGeoState(prev => ({ ...prev, error: err.message }));
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    // Calculate Nearest Campus using useMemo to prevent render-cycle crashes
    const nearestCampus = useMemo(() => {
        if (!geoState.lat || !geoState.lng) return null;

        let min = { dist: Infinity, campus: CAMPUSES[0] };
        CAMPUSES.forEach(c => {
            const d = getDistance(geoState.lat!, geoState.lng!, c.lat, c.lng);
            if (d < min.dist) {
                min = { dist: d, campus: c };
            }
        });
        return min;
    }, [geoState.lat, geoState.lng]);

    const isWithinRange = useMemo(() => {
        return nearestCampus && nearestCampus.dist <= CHECKIN_RADIUS_METERS;
    }, [nearestCampus]);

    // --- Profile Actions ---
    const updateProfile = (updates: Partial<OperativeProfile>) => {
        const newProfile = { ...profile, ...updates };
        setProfile(newProfile);
        localStorage.setItem('tmu_operative_profile', JSON.stringify(newProfile));
    };

    const handleLoadProfile = () => {
        // In a real app, this would fetch from DB. 
        // Here we simulate "Recovering" an account by just accepting the ID and resetting stats mock-style
        if (inputId.length < 8) return;

        const recoveredProfile: OperativeProfile = {
            id: inputId.toUpperCase(),
            codename: `Recovered_${inputId.slice(-4)}`,
            totalPushes: Math.floor(Math.random() * 500), // Mock existing pushes
            joinedAt: Date.now() - 10000000
        };
        
        setProfile(recoveredProfile);
        localStorage.setItem('tmu_operative_profile', JSON.stringify(recoveredProfile));
        setIsEnteringId(false);
        setInputId('');
    };

    const copyIdToClipboard = () => {
        navigator.clipboard.writeText(profile.id);
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
    };

    // --- Game Actions ---
    const handlePush = () => {
        if (!isWithinRange) {
            alert("射程圏外です。キャンパスに接近して推力を供給してください。");
            return;
        }

        setIsPushing(true);

        // Simulate API call
        setTimeout(() => {
            const newTotal = profile.totalPushes + 1;
            updateProfile({ totalPushes: newTotal });
            setIsPushing(false);
            
            // Update Mock Ranking for visual feedback
            setRanking(prev => {
                // Remove existing entry of self if exists to avoid dupes in mock logic
                const others = prev.filter(r => r.name !== profile.codename && !r.name.startsWith('Agent_'));
                
                // Add self
                const myEntry: RankingEntry = { 
                    rank: 0, 
                    name: profile.codename, 
                    count: newTotal, 
                    lastActive: 'Now' 
                };
                
                const newRank = [...others, myEntry]
                    .sort((a, b) => b.count - a.count)
                    .map((r, i) => ({...r, rank: i+1}))
                    .slice(0, 10);
                    
                return newRank;
            });
        }, 800);
    };

    // Dynamic Status Text
    const statusText = useMemo(() => {
        if (geoState.error) return `GPS Error: ${geoState.error}`;
        if (!geoState.lat) return "測位中 (Triangulating)...";
        
        // If we have lat/lng but nearestCampus is technically null
        if (!nearestCampus) return "兵站計算中 (Calculating logistics)...";

        if (isWithinRange) return `目標ロック: ${nearestCampus.campus.name} (${Math.round(nearestCampus.dist)}m)`;
        return `射程圏外。最寄: ${nearestCampus.campus.name} (${Math.round(nearestCampus.dist)}m)`;
    }, [geoState, isWithinRange, nearestCampus]);

    return (
        <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-700">
            
            {/* Header Section */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                    <Navigation className="text-red-500" />
                    作戦本部 (Operation HQ)
                </h2>
                <p className="text-neutral-500 mt-2">物理的推力を同期せよ。キャンパスを押し出せ。</p>
            </div>

            {/* Tactical Map */}
            <TacticalMap userLat={geoState.lat} userLng={geoState.lng} />

            {/* Control Panel */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-2xl mb-8 relative overflow-hidden">
                {/* Background Grid Effect */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                {/* GPS Status */}
                <div className="flex items-center gap-2 text-sm font-mono text-neutral-400 mb-6 bg-black/40 p-3 rounded border border-neutral-800">
                    <Crosshair size={16} className={isWithinRange ? "text-green-500 animate-pulse" : "text-red-500"} />
                    <span>{statusText}</span>
                </div>

                {/* ID CARD SYSTEM */}
                <div className="mb-6 bg-neutral-950 border border-neutral-800 rounded-lg p-4 relative group transition-all hover:border-neutral-700">
                    <div className="absolute top-2 right-2 flex gap-2">
                        {/* Switch ID Button */}
                        {!isEnteringId && (
                            <button 
                                onClick={() => setIsEnteringId(true)}
                                className="p-1.5 text-neutral-600 hover:text-white hover:bg-neutral-800 rounded transition-colors"
                                title="既存IDをロード"
                            >
                                <LogIn size={14} />
                            </button>
                        )}
                    </div>

                    {isEnteringId ? (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <div className="text-xs text-yellow-500 font-mono mb-2 flex items-center gap-2">
                                <Key size={12} /> MANUAL OVERRIDE: ENTER TACTICAL ID
                            </div>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={inputId}
                                    onChange={(e) => setInputId(e.target.value)}
                                    placeholder="TMU-XXXX-XXXX"
                                    className="bg-black border border-yellow-500/50 text-yellow-500 font-mono text-sm px-3 py-2 rounded w-full focus:outline-none focus:border-yellow-500"
                                    autoFocus
                                />
                                <button 
                                    onClick={handleLoadProfile}
                                    className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 px-3 py-2 rounded text-xs font-bold hover:bg-yellow-500/30 whitespace-nowrap"
                                >
                                    読込
                                </button>
                                <button 
                                    onClick={() => setIsEnteringId(false)}
                                    className="bg-neutral-800 text-neutral-400 px-3 py-2 rounded text-xs hover:bg-neutral-700"
                                >
                                    中止
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-start gap-4">
                            {/* Avatar / Rank Icon */}
                            <div className="w-12 h-12 bg-neutral-900 rounded border border-neutral-800 flex items-center justify-center text-neutral-500 shrink-0">
                                <User size={24} />
                            </div>
                            
                            {/* Details */}
                            <div className="flex-grow min-w-0">
                                {/* ID Row */}
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest">Tactical ID</span>
                                    <div className="flex items-center gap-2 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800/50">
                                        <span className="text-xs font-mono text-neutral-300 tracking-wider">{profile.id}</span>
                                        <button 
                                            onClick={copyIdToClipboard}
                                            className={`text-neutral-500 hover:text-white transition-colors ${copyFeedback ? 'text-green-500' : ''}`}
                                        >
                                            {copyFeedback ? <Check size={10} /> : <Copy size={10} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Name Row */}
                                <div className="flex items-center justify-between">
                                    {isEditingName ? (
                                        <div className="flex items-center gap-2 w-full mt-1">
                                            <input 
                                                type="text" 
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="bg-neutral-900 text-white font-mono px-2 py-1 rounded border border-red-900 focus:outline-none focus:border-red-500 w-full text-sm"
                                                autoFocus
                                                onBlur={() => {
                                                    if (editName.trim()) updateProfile({ codename: editName.trim() });
                                                    setIsEditingName(false);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        if (editName.trim()) updateProfile({ codename: editName.trim() });
                                                        setIsEditingName(false);
                                                    }
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div 
                                            className="flex items-center gap-2 group/name cursor-pointer" 
                                            onClick={() => {
                                                setEditName(profile.codename);
                                                setIsEditingName(true);
                                            }}
                                            title="コードネームを編集"
                                        >
                                            <span className="font-bold text-white font-mono text-lg truncate">
                                                {profile.codename}
                                            </span>
                                            <Edit3 size={12} className="text-neutral-600 group-hover/name:text-neutral-400" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* The BIG Button */}
                <button
                    onClick={handlePush}
                    disabled={!isWithinRange || isPushing}
                    className={`w-full py-6 rounded-lg font-black text-xl tracking-widest uppercase transition-all transform duration-100
                        ${!isWithinRange 
                            ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed border border-neutral-700' 
                            : isPushing
                                ? 'bg-red-700 text-white scale-95 shadow-inner'
                                : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_50px_rgba(220,38,38,0.6)] active:scale-95 border border-red-500'
                        }
                    `}
                >
                    {isPushing ? (
                        <span className="flex items-center justify-center gap-2">
                            <RefreshCw className="animate-spin" /> 推力充填中...
                        </span>
                    ) : (
                        isWithinRange ? "物理的推力を供給 (CHECK-IN)" : "目標エリアへ接近せよ"
                    )}
                </button>

                <div className="mt-4 flex justify-between text-xs text-neutral-500 font-mono border-t border-neutral-800 pt-2">
                    <span>総貢献: {profile.totalPushes}回</span>
                    <span>発生推力: 500N / 回</span>
                </div>
            </div>

            {/* Ranking Section */}
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6">
                <h3 className="text-yellow-500 font-bold flex items-center gap-2 mb-4 uppercase tracking-wider text-sm">
                    <Trophy size={16} /> 週間トップエージェント
                </h3>
                
                <div className="space-y-3">
                    {ranking.length === 0 ? (
                        <div className="text-center text-neutral-600 py-8">戦術データ同期中...</div>
                    ) : (
                        ranking.map((entry) => (
                            <div key={entry.rank} className={`flex items-center justify-between p-3 rounded border transition-colors
                                ${entry.name === profile.codename 
                                    ? 'bg-red-900/10 border-red-900/50' 
                                    : 'bg-neutral-800/30 border-neutral-800/50 hover:bg-neutral-800'
                                }`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 flex items-center justify-center rounded font-bold text-sm
                                        ${entry.rank === 1 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 
                                          entry.rank === 2 ? 'bg-neutral-400/20 text-neutral-300 border border-neutral-400/30' :
                                          entry.rank === 3 ? 'bg-orange-700/20 text-orange-600 border border-orange-700/30' :
                                          'bg-neutral-900 text-neutral-600'
                                        }
                                    `}>
                                        {entry.rank}
                                    </div>
                                    <div className="font-mono text-neutral-300 flex items-center gap-2">
                                        {entry.name}
                                        {entry.name === profile.codename && <span className="text-[10px] text-red-500">(YOU)</span>}
                                    </div>
                                </div>
                                <div className="font-mono text-red-500 font-bold">
                                    {entry.count.toLocaleString()} <span className="text-xs text-neutral-600 font-normal">回</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
};

export default OperationPage;