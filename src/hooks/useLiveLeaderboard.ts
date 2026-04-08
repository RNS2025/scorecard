import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, type Timestamp } from "firebase/firestore";
import { firestore } from "../firebase/firebase.ts";
import type { LeaderboardEntry } from "../utils/interfaces/Leaderboard.ts";

export const useLiveLeaderboard = (courseId?: string, period?: string) => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!courseId) return;

        const constraints = [
            where("courseId", "==", courseId),
            orderBy("totalShots", "asc"),
        ];

        if (period && period !== "all") {
            const now = new Date();
            let startDate: Date | undefined;

            if (period === "week") {
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            } else if (period === "month") {
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            }

            if (startDate) {
                constraints.push(where("createdAt", ">=", startDate));
            }
        }

        const q = query(collection(firestore, "leaderboard"), ...constraints);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => {
                const raw = doc.data();
                return {
                    id: doc.id,
                    ...raw,
                    createdAt: (raw.createdAt as Timestamp)?.toDate?.()?.toISOString() ?? null,
                } as LeaderboardEntry;
            });
            setEntries(data);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [courseId, period]);

    return { data: entries, isLoading };
};

