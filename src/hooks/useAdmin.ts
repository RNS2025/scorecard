import { useQuery } from "@tanstack/react-query";
import AdminService from "../services/AdminService.ts";

export const useAdminProfile = () => {
    return useQuery({
        queryKey: ['admin', 'profile'],
        queryFn: AdminService.getProfile,
    });
};

export const useAdminStats = () => {
    return useQuery({
        queryKey: ['admin', 'stats'],
        queryFn: AdminService.getStats,
    });
};

export const useAdminLeaderboard = () => {
    return useQuery({
        queryKey: ['admin', 'leaderboard'],
        queryFn: AdminService.getLeaderboard,
    });
};

export const useAdminMarketingEmails = () => {
    return useQuery({
        queryKey: ['admin', 'marketing-emails'],
        queryFn: AdminService.getMarketingEmails,
    });
};

