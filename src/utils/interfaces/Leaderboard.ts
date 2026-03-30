export interface LeaderboardEntry {
    id?: string;
    playerName: string;
    email: string;
    marketingConsent: boolean;
    scores: (number | null)[];
    totalShots: number;
    totalDiff: number;
    courseId: string;
    courseName: string;
    gameId: string;
    format: "slagspil" | "hulspil";
    createdAt?: string;
}

