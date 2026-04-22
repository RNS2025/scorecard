import scorecard_logo from "../assets/scorecard logo.png"
import {useCourses} from "../hooks/useCourses.ts";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

const SelectCoursesPage = () => {
    const { data: courses, isLoading, isError } = useCourses();
    const [selectedCourseId, setSelectedCourseId] = useState<string>("");
    const navigate = useNavigate();

    return (
        <div>
            <div className="flex flex-col gap-4 items-center">
            <img src={scorecard_logo} alt="Scorecard Logo" className="w-64" />
             <h1 className="text-4xl font-bold text-center">Velkommen til Scorecard</h1>
            </div>

            <div className="mt-10 mx-6">
                {isLoading && <p className="text-center animate-pulse">Henter baner...</p>}
                {isError && <p className="text-center text-red-500">Kunne ikke hente baner</p>}


                <div className="flex flex-col gap-6">
                {courses && (
                    <select
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Vælg en bane</option>
                        {courses.sort((a, b) => a.name.localeCompare(b.name)).map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.name}
                            </option>
                        ))}
                    </select>
                )}

                {selectedCourseId !== "" && selectedCourseId !== null && (
                    <button onClick={() => navigate(`/${selectedCourseId}/creategame`)} className="w-full bg-linear-to-r from-green-500 to-green-800 text-white rounded py-2 px-4 transition">
                        Fortsæt
                    </button>
                )}
                </div>
            </div>
        </div>
    );
};

export default SelectCoursesPage;