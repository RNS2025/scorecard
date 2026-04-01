import { useParams } from "react-router-dom";
import { useLeaderboard } from "../../hooks/useLeaderboard.ts";
import { useCourse } from "../../hooks/useCourses.ts";
import { useCourseImage } from "../../hooks/useCourseImage.ts";
import LeaderboardTable from "./LeaderboardTable.tsx";
import RulesList from "./RulesList.tsx";

const TvDashboardPage = () => {
    const { courseId } = useParams();
    const { data: course } = useCourse(String(courseId));
    const { data: allTimeEntries } = useLeaderboard(courseId, "all");
    const { data: monthEntries } = useLeaderboard(courseId, "month");
    const { data: logoUrl } = useCourseImage(String(courseId), "logo");

    const getDiffLabel = (diff: number) => {
        if (diff === 0) return "Par";
        return diff > 0 ? `+${diff}` : `${diff}`;
    };

    const getDiffColor = (diff: number) => {
        if (diff === 0) return "text-gray-400";
        if (diff < 0) return "text-green-400";
        return "text-red-400";
    };

    const getMedalColor = (position: number) => {
        if (position === 0) return "bg-yellow-400 text-yellow-900";
        if (position === 1) return "bg-gray-300 text-gray-700";
        if (position === 2) return "bg-amber-600 text-white";
        return "bg-white/10 text-white/60";
    };

    if (!course) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <p className="text-white/40 text-2xl animate-pulse">Henter dashboard...</p>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-950 text-white flex flex-col overflow-hidden cursor-none select-none">

            {/* Header */}
            <div className="flex items-center justify-between px-10 py-5 bg-linear-to-r from-green-700 to-green-900 shrink-0">
                <div className="flex items-center gap-6">
                    {logoUrl && (
                        <img src={logoUrl} alt="Logo" className="h-14 object-contain" />
                    )}
                    <div>
                        <h1 className="text-3xl font-bold">{course.name}</h1>
                        <p className="text-green-300 text-lg">{course.numberOfHoles} huller · Par {course.par}</p>
                    </div>
                </div>
            </div>

            {/* Content – 3 kolonner */}
            <div className="flex-1 grid grid-cols-3 gap-6 px-10 py-6 overflow-hidden">

                {/* All-time */}
                <div className="flex flex-col overflow-hidden">
                    <h2 className="text-xl font-bold mb-4 text-white/80">All-time</h2>
                    <LeaderboardTable
                        entries={allTimeEntries}
                        getDiffLabel={getDiffLabel}
                        getDiffColor={getDiffColor}
                        getMedalColor={getMedalColor}
                    />
                </div>

                {/* Månedlig */}
                <div className="flex flex-col overflow-hidden">
                    <h2 className="text-xl font-bold mb-4 text-white/80">Denne måned</h2>
                    <LeaderboardTable
                        entries={monthEntries}
                        getDiffLabel={getDiffLabel}
                        getDiffColor={getDiffColor}
                        getMedalColor={getMedalColor}
                    />
                </div>

                {/* Regler */}
                <div className="flex flex-col overflow-hidden">
                    <h2 className="text-xl font-bold mb-4 text-white/80">Regler</h2>
                    <RulesList rules={course.rules ?? []} />
                </div>
            </div>
        </div>
    );
};

export default TvDashboardPage;

