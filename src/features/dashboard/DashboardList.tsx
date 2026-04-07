import { useNavigate } from "react-router-dom";
import { useCourses } from "../../hooks/useCourses.ts";
import { useCourseImage } from "../../hooks/useCourseImage.ts";
import type { Course } from "../../utils/interfaces/Course.ts";

const CourseCard = ({ course }: { course: Course }) => {
    const navigate = useNavigate();
    const { data: logoUrl } = useCourseImage(String(course.id), "logo");

    return (
        <button
            onClick={() => navigate(`/${course.id}/dashboard`)}
            className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/50
                       rounded-2xl p-8 flex flex-col items-center gap-4 transition-all duration-200
                       hover:scale-[1.02] cursor-pointer"
        >
            {logoUrl ? (
                <img src={logoUrl} alt={course.name} className="h-16 object-contain" />
            ) : (
                <div className="h-16 w-16 rounded-full bg-green-700/40 flex items-center justify-center text-2xl font-bold text-green-300">
                    {course.name.charAt(0)}
                </div>
            )}
            <div className="text-center">
                <h2 className="text-xl font-bold text-white">{course.name}</h2>
                <p className="text-white/40 text-sm mt-1">
                    {course.city}{course.sport ? ` · ${course.sport}` : ""}
                </p>
            </div>
        </button>
    );
};

const DashboardList = () => {
    const { data: courses, isLoading } = useCourses();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <p className="text-white/40 text-2xl animate-pulse">Henter baner...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-10 py-16">
            <h1 className="text-4xl font-bold mb-2">Vælg bane</h1>
            <p className="text-white/40 text-lg mb-12">Vælg den bane du vil vise på dashboardet</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
                {courses?.sort((a, b) => a.name.localeCompare(b.name, "da")).map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>

            {courses?.length === 0 && (
                <p className="text-white/30 text-lg mt-8">Ingen baner fundet</p>
            )}
        </div>
    );
};

export default DashboardList;

