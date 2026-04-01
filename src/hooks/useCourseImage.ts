import { useQuery } from "@tanstack/react-query";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebase.ts";

const fetchCourseImage = async (courseId: string, fileName: string): Promise<string> => {
    const folderRef = ref(storage, `${courseId}`);
    const result = await listAll(folderRef);
    const match = result.items.find((item) => {
        const name = item.name.split('.')[0];
        return name === fileName;
    });
    if (!match) throw new Error(`No image found: ${fileName}`);
    return await getDownloadURL(match);
};

export const useCourseImage = (courseId: string, fileName: string) => {
    return useQuery({
        queryKey: ['courseImage', courseId, fileName],
        queryFn: () => fetchCourseImage(courseId, fileName),
        staleTime: Infinity,
        retry: 1,
    });
};

