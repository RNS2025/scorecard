import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6 text-center">
            <span className="text-5xl">⛳</span>
            <h1 className="text-2xl font-bold text-gray-800">404 – Siden findes ikke</h1>
            <p className="text-gray-500 text-sm max-w-xs">Den side du leder efter eksisterer ikke eller er blevet flyttet.</p>
            <button
                onClick={() => navigate("/courses")}
                className="mt-2 px-5 py-2 bg-green-600 text-white rounded-lg font-semibold"
            >
                Gå til valg af bane
            </button>

            <button
                onClick={() => navigate("/")}
                className="mt-2 px-5 py-2 bg-green-600 text-white rounded-lg font-semibold"
            >
                Gå til forside
            </button>
        </div>
    );
};

export default NotFoundPage;

