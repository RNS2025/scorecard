import api from "../utils/axiosBase.tsx";
import type { LeaderboardEntry } from "../utils/interfaces/Leaderboard.ts";

class LeaderboardService {
    static async publishScores(entries: Omit<LeaderboardEntry, "id" | "createdAt">[]): Promise<LeaderboardEntry[]> {
        const response = await api.post('/leaderboard', entries);
        return response.data as LeaderboardEntry[];
    }

    static async getLeaderboard(courseId?: string, period?: string): Promise<LeaderboardEntry[]> {
        const params: Record<string, string> = {};
        if (courseId) params.courseId = courseId;
        if (period) params.period = period;
        const response = await api.get('/leaderboard', { params });
        return response.data as LeaderboardEntry[];
    }
}

export default LeaderboardService;

