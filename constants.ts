import { Campus } from './types';

export const CAMPUSES: Campus[] = [
    { 
        name: "南大沢", 
        lat: 35.623500, 
        lng: 139.376500,
        description: "本部・文理全般。多摩ニュータウンの奥座敷。"
    },
    { 
        name: "日野", 
        lat: 35.661577, 
        lng: 139.366481,
        description: "システムデザイン学部。工業団地の要塞。" 
    },
    { 
        name: "荒川", 
        lat: 35.750036, 
        lng: 139.771859,
        description: "健康福祉学部。都電が走る牧歌的下町。" 
    }
];

export const TOKYO_STATION = {
    lat: 35.681236,
    lng: 139.767125
};

export const CHECKIN_RADIUS_METERS = 1000; // Expanded radius to cover the entire campus
export const TOTAL_BUILDINGS = 51;
export const MASS_PER_BUILDING_KG = 2.0e7; // 20,000 tons