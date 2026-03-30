import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase.ts";
import { useAuth } from "../../hooks/useAuth.ts";
import { useNavigate } from "react-router-dom";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import scorecard_logo from "../../assets/scorecard logo.png";

const LoginPage = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/admin/dashboard");
        } catch {
            setError("Forkert e-mail eller adgangskode");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <p className="text-center mt-20 animate-pulse">Indlæser...</p>;
    }

    if (user) {
        navigate("/admin/dashboard");
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-5">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <img src={scorecard_logo} alt="Scorecard" className="w-20 mb-4" />
                    <div className="flex items-center gap-2 text-green-700">
                        <LockClosedIcon className="w-5 h-5" />
                        <span className="text-sm font-semibold uppercase tracking-wide">Admin</span>
                    </div>
                </div>

                {/* Login card */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h1 className="text-xl font-bold text-center mb-1">Log ind</h1>
                    <p className="text-sm text-gray-400 text-center mb-6">Kun for baneadministratorer</p>

                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label htmlFor="email" className="text-sm font-medium">E-mail</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@bane.dk"
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="password" className="text-sm font-medium">Adgangskode</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 text-center">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-linear-to-r from-green-500 to-green-800 text-white font-bold rounded-lg py-3 px-4 transition hover:opacity-90 disabled:opacity-50"
                        >
                            {isSubmitting ? "Logger ind..." : "Log ind"}
                        </button>
                    </form>
                </div>

                <p className="text-xs text-gray-300 text-center mt-6">
                    Denne side er kun til autoriserede administratorer
                </p>
            </div>
        </div>
    );
};

export default LoginPage;