import api from "../utils/axiosBase.tsx"
import type {Course} from "../utils/interfaces/Course.ts";

class CourseService {

    static async createCourse(course: Course): Promise<Course> {
        await api.post('/courses', course)
        return course;
    }

    static async getCourses(): Promise<Course[]> {
        const response = await api.get('/courses')
        return response.data as Course[];
    }

    static async getCourseById(id: string): Promise<Course> {
        const response = await api.get('/courses/' + id);
        return response.data as Course;
    }
}

export default CourseService;