import {useQuery} from "@tanstack/react-query";
import {UserService} from "../services/UserService.ts";

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: () => UserService.getAllUsers(),
        staleTime: Infinity,
    });
};