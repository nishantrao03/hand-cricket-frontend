import React, { useEffect, useState } from "react";
import styles from "./view_profile.module.css";

const ViewProfile = ({ friend, onClose }) => {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!friend) return;

        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                setError("");
                setProfile(null);

                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/fetch-user`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: friend.id })
                });

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.error || "Failed to fetch profile");
                }

                setProfile(result.data);

            } catch (err) {
                setError(err.message || "Failed to fetch profile");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [friend]);

    useEffect(() => {
        if (!friend) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [friend, onClose]);

    if (!friend) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <div>
                        <p className={styles.eyebrow}>Friend Profile</p>
                        <h2 className={styles.title}>{friend.username}</h2>
                    </div>

                    <button type="button" className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                {isLoading ? (
                    <div className={styles.stateBlock}>
                        <div className={styles.spinner}></div>
                        <p className={styles.stateText}>Loading profile...</p>
                    </div>
                ) : error ? (
                    <div className={styles.stateBlock}>
                        <p className={styles.errorText}>{error}</p>
                    </div>
                ) : profile ? (
                    <div className={styles.content}>
                        <div className={styles.profileCard}>
                            <div className={styles.statRow}>
                                <span className={styles.statLabel}>Username</span>
                                <span className={styles.statValue}>{profile.username}</span>
                            </div>

                            <div className={styles.statRow}>
                                <span className={styles.statLabel}>Matches Played</span>
                                <span className={styles.statValue}>{profile.matchesPlayed}</span>
                            </div>

                            <div className={styles.statRow}>
                                <span className={styles.statLabel}>Matches Won</span>
                                <span className={styles.statValue}>{profile.matchesWon}</span>
                            </div>

                            <div className={styles.statRow}>
                                <span className={styles.statLabel}>Net Run Rate</span>
                                <span className={styles.statValue}>{profile.netRunRate}</span>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default ViewProfile;