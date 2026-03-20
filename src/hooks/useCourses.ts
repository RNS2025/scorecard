import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import CourseService from "../services/CourseService.ts";

export const useCourses = () => {
    return useQuery({
        queryKey: ['courses'],
        queryFn: CourseService.getCourses,
    });
};

export const useCourse = (id: string) => {
    return useQuery({
        queryKey: ['course', id],
        queryFn: () => CourseService.getCourseById(id),
    });
};

export const useCreateCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: CourseService.createCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['course']}).then();
        },
    });
};
