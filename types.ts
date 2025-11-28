
export interface Campus {
    name: string;
    lat: number;
    lng: number;
    description: string;
}

export interface RankingEntry {
    rank: number;
    name: string;
    count: number;
    lastActive: string;
}

export interface UserState {
    name: string;
    totalPushes: number;
    lastPushTime: number | null;
}

export interface OperativeProfile {
    id: string;       // Unique Tactical ID (e.g., TMU-X9Z2-11)
    codename: string; // Display Name
    totalPushes: number;
    joinedAt: number;
}
