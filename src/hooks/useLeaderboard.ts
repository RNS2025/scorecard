import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LeaderboardService from "../services/LeaderboardService.ts";

export const useLeaderboard = (courseId?: string, period?: string) => {
    return useQuery({
        queryKey: ['leaderboard', courseId, period],
        queryFn: () => LeaderboardService.getLeaderboard(courseId, period),
        enabled: !!courseId,
    });
};

export const usePublishScores = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: LeaderboardService.publishScores,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['leaderboard']}).then();
        },
    });
};

