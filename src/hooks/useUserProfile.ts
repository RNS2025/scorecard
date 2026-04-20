import { useState, useEffect, useCallback } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase.ts";
import { useAuth } from "./useAuth.ts";

export interface UserProfile {
    name: string;
    email: string;
}

export const useUserProfile = () => {
    const { user, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            Promise.resolve().then(() => {
                setProfile(null);
                setLoading(false);
            });
            return;
        }

        getDoc(doc(firestore, "users", user.uid))
            .then((snap) => {
                if (snap.exists()) {
                    setProfile(snap.data() as UserProfile);
                } else {
                    setProfile(null);
                }
            })
            .finally(() => setLoading(false));
    }, [user, authLoading, refreshKey]);

    return { profile, loading, user, refetch };
};


