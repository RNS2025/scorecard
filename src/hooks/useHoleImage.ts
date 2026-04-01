import { useQuery } from "@tanstack/react-query";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebase.ts";

const fetchHoleImageUrl = async (courseId: string, holeNumber: number): Promise<string> => {
    const folderRef = ref(storage, `${courseId}`);
    const result = await listAll(folderRef);
    const match = result.items.find((item) => {
        const name = item.name.split('.')[0]; // fjern filtype
        return name === String(holeNumber);
    });
    if (!match) throw new Error(`No image found for hole ${holeNumber}`);
    return await getDownloadURL(match);
};

export const useHoleImage = (courseId: string, holeNumber: number) => {
    return useQuery({
        queryKey: ['holeImage', courseId, holeNumber],
        queryFn: () => fetchHoleImageUrl(courseId, holeNumber),
        staleTime: Infinity, // Billederne ændres aldrig, så cache uendeligt
        retry: 1,
    });
};


