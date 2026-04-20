import Modal from "react-responsive-modal";
import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../../firebase/firebase.ts";
import { useUserProfile } from "../../hooks/useUserProfile.ts";
import { PencilIcon, CheckIcon } from "@heroicons/react/24/outline";

interface LoginModalProps {
    open: boolean;
    onClose: () => void;
}

const LoginModal = ({ open, onClose }: LoginModalProps) => {
    const { profile, loading: checkingUser, user, refetch } = useUserProfile();
    const [isRegistering, setIsRegistering] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = () => {
        setName("");
        setEmail("");
        setPassword("");
        setError(null);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            resetForm();
            onClose();
        } catch {
            setError("Forkert e-mail eller adgangskode");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError("Indtast venligst dit navn");
            return;
        }
        if (password.length < 6) {
            setError("Adgangskoden skal være mindst 6 tegn");
            return;
        }

        setIsSubmitting(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            await setDoc(doc(firestore, "users", uid), {
                name: name.trim(),
                email: email.trim(),
            });

            resetForm();
            onClose();
        } catch (err: unknown) {
            if (err instanceof Error && "code" in err) {
                const firebaseErr = err as { code: string };
                if (firebaseErr.code === "auth/email-already-in-use") {
                    setError("Denne e-mail er allerede i brug");
                } else if (firebaseErr.code === "auth/invalid-email") {
                    setError("Ugyldig e-mailadresse");
                } else if (firebaseErr.code === "auth/weak-password") {
                    setError("Adgangskoden er for svag");
                } else {
                    setError("Noget gik galt. Prøv igen");
                }
            } else {
                setError("Noget gik galt. Prøv igen");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = async () => {
        await auth.signOut();
        resetForm();
        setIsEditingName(false);
    };

    const handleSaveName = async () => {
        if (!user || !editedName.trim()) return;
        await updateDoc(doc(firestore, "users", user.uid), {
            name: editedName.trim(),
        });
        setIsEditingName(false);
        refetch();
    };

    return (
        <Modal open={open} onClose={onClose} showCloseIcon={false} center>
            <div className="flex flex-col gap-4 text-black min-w-70">

                {checkingUser ? (
                    <p className="text-center py-4 animate-pulse">Tjekker bruger...</p>
                ) : profile && user ? (
                    <div className="flex flex-col items-center gap-4 py-2">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-xl">👤</span>
                        </div>
                        <div className="text-center flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2">
                                {isEditingName ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-40 text-center"
                                            autoFocus
                                            onKeyDown={(e) => { if (e.key === "Enter") handleSaveName(); }}
                                        />
                                        <button onClick={handleSaveName} className="text-green-600 hover:text-green-800 transition">
                                            <CheckIcon className="w-5 h-5" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-semibold">{profile.name}</p>
                                        <button
                                            onClick={() => { setEditedName(profile.name); setIsEditingName(true); }}
                                            className="text-gray-400 hover:text-gray-600 transition"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                            <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-500 text-white font-bold rounded-lg py-3 px-4 transition hover:opacity-90"
                        >
                            Log ud
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Tab switch */}
                        <div className="flex rounded-lg overflow-hidden border border-gray-200">
                            <button
                                type="button"
                                onClick={() => { setIsRegistering(false); setError(null); }}
                                className={`flex-1 py-2 text-sm font-semibold transition ${
                                    !isRegistering ? "bg-green-600 text-white" : "bg-gray-50 text-gray-500"
                                }`}
                            >
                                Log ind
                            </button>
                            <button
                                type="button"
                                onClick={() => { setIsRegistering(true); setError(null); }}
                                className={`flex-1 py-2 text-sm font-semibold transition ${
                                    isRegistering ? "bg-green-600 text-white" : "bg-gray-50 text-gray-500"
                                }`}
                            >
                                Opret konto
                            </button>
                        </div>

                        <form
                            onSubmit={isRegistering ? handleRegister : handleLogin}
                            className="flex flex-col gap-3"
                        >
                            {isRegistering && (
                                <div className="flex flex-col gap-1">
                                    <label htmlFor="login-name" className="text-sm font-medium">Navn</label>
                                    <input
                                        id="login-name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Dit navn"
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            )}

                            <div className="flex flex-col gap-1">
                                <label htmlFor="login-email" className="text-sm font-medium">E-mail</label>
                                <input
                                    id="login-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="din@email.dk"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label htmlFor="login-password" className="text-sm font-medium">Adgangskode</label>
                                <input
                                    id="login-password"
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
                                {isSubmitting
                                    ? (isRegistering ? "Opretter..." : "Logger ind...")
                                    : (isRegistering ? "Opret konto" : "Log ind")
                                }
                            </button>
                        </form>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default LoginModal;
