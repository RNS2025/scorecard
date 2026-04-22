import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import GameService from "../services/GameService.ts";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase/firebase.ts";
import type { Game } from "../utils/interfaces/Game.ts";

export const useGame = (id: string) => {
    return useQuery({
        queryKey: ['game', id],
        queryFn: () => GameService.getGameById(id),
    });
};

/**
 * Real-time Firestore listener for a game document.
 * Returns { data, isLoading } – updates instantly when any client saves.
 */
export const useGameLive = (id: string) => {
    const [data, setData] = useState<Game | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const ref = doc(firestore, "games", id);
        const unsub = onSnapshot(ref, (snap) => {
            if (snap.exists()) {
                setData({ id: snap.id, ...snap.data() } as Game);
            }
            setIsLoading(false);
        });
        return () => unsub();
    }, [id]);

    return { data, isLoading };
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
