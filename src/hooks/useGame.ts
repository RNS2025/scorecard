import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import GameService from "../services/GameService.ts";

export const useGame = (id: string) => {
    return useQuery({
        queryKey: ['game', id],
        queryFn: () => GameService.getGameById(id),
    });
};

export const useCreateGame = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: GameService.createGame,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['game'] });
        },
    });
};

export const useUpdateGame = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: GameService.updateGame,
        onSuccess: (game) => {
            queryClient.invalidateQueries({ queryKey: ['game', game.id] });
        },
    });
};
