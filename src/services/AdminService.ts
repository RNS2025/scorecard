import api from "../utils/axiosBase.tsx";
import { auth } from "../firebase/firebase.ts";

const getAuthHeader = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    const token = await user.getIdToken();
    return { Authorization: `Bearer ${token}` };
};

export interface AdminProfile {
    uid: string;
    email: string;
    courseId: string;
    courseName: string;
}

export interface AdminStats {
    totalRounds: number;
    uniquePlayers: number;
    avgScore: number;
    bestScore: number | null;
    roundsThisWeek: number;
    roundsThisMonth: number;
    marketingConsents: number;
    uniqueMarketingEmails: number;
}

export interface MarketingEmail {
    email: string;
    playerName: string;
    createdAt: string | null;
}

class AdminService {
    static async getProfile(): Promise<AdminProfile> {
        const headers = await getAuthHeader();
        const response = await api.get('/admin/profile', { headers });
        return response.data;
    }

    static async getStats(): Promise<AdminStats> {
        const headers = await getAuthHeader();
        const response = await api.get('/admin/stats', { headers });
        return response.data;
    }

    static async getLeaderboard(): Promise<import("../utils/interfaces/Leaderboard.ts").LeaderboardEntry[]> {
        const headers = await getAuthHeader();
        const response = await api.get('/admin/leaderboard', { headers });
        return response.data;
    }

    static async getMarketingEmails(): Promise<MarketingEmail[]> {
        const headers = await getAuthHeader();
        const response = await api.get('/admin/marketing-emails', { headers });
        return response.data;
    }
}

export default AdminService;

