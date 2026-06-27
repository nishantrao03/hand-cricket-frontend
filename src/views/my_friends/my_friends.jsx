import React, { useMemo, useState, useEffect } from "react";
import styles from "./my_friends.module.css";
import ViewProfile from "../../components/view_profile/view_profile";
import { useAuth } from "../../context/AuthContext.jsx";

const getInitials = (name = "") => name.trim().split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase() || "").join("") || "?";

const MyFriends = () => {
    const { userId, userName, fetchWithAuth } = useAuth();
    const [search, setSearch] = useState("");
    const [friends, setFriends] = useState([]);
    const [profilesMap, setProfilesMap] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [removingFriendId, setRemovingFriendId] = useState(null);
    const [selectedFriend, setSelectedFriend] = useState(null);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const loadFriends = async () => {
            if (!userId) return;
            
            try {
                setIsLoading(true);
                const response = await fetchWithAuth(
                  `${BACKEND_URL}/api/fetch-friends`,
                  {
                    credentials: 'include'
                  }
                );
                
                const result = await response.json();
                console.log(result);
                
                if (response.ok && result.success) {
                    const newProfilesMap = {};
                    
                    // Extract the actual friend profile from the relationship record
                    const formattedFriends = (result.data || []).map(record => {
                        const isUser1 = record.user1Id === userId;
                        const friendProfile = isUser1 ? record.user2 : record.user1;
                        
                        // Store the full profile data in the map using the user ID as the key
                        newProfilesMap[friendProfile.id] = friendProfile;
                        
                        return {
                            id: friendProfile.id,
                            username: friendProfile.username,
                            wins: friendProfile.matchesWon || 0,
                            matches: friendProfile.matchesPlayed || 0,
                            lastSeen: "Offline" // Fallback since Prisma schema doesn't have lastSeen
                        };
                    });
                    
                    setProfilesMap(newProfilesMap);
                    setFriends(formattedFriends);
                }
            } catch (err) {
                console.error("Failed to fetch friends:", err);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadFriends();
    }, [userId]);

    const filteredFriends = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();
        return friends.filter(friend => !normalizedSearch || friend.username.toLowerCase().includes(normalizedSearch));
    }, [search, friends]);

    const handleRemoveFriend = async (friendId) => {
        try {
            setRemovingFriendId(friendId);

            const response = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_URL}/api/remove-friend`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, friendId })
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || "Failed to remove friend");
            }

            setFriends(prev => prev.filter(friend => friend.id !== friendId));

        } catch (err) {
            alert(err.message || "Failed to remove friend");
        } finally {
            setRemovingFriendId(null);
        }
    };

    return (
        <>
            <div className={styles.page}>
                <div className={styles.contentShell}>
                    <header className={styles.headerBlock}>
                        <p className={styles.eyebrow}>Social Hub</p>
                        <h1 className={styles.title}>My Friends</h1>
                        <p className={styles.subtitle}>View your friends list, search profiles, and manage your connections.</p>
                    </header>

                    <section className={styles.topPanel}>
                        <div className={styles.searchWrap}>
                            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search friends by username" className={styles.searchInput} />
                        </div>
                    </section>

                    <section className={styles.summaryGrid}>
                        <div className={styles.summaryCard}>
                            <span className={styles.summaryLabel}>Total Friends</span>
                            <span className={styles.summaryValue}>{friends.length}</span>
                        </div>

                        <div className={styles.summaryCard}>
                            <span className={styles.summaryLabel}>Showing</span>
                            <span className={styles.summaryValue}>{filteredFriends.length}</span>
                        </div>
                    </section>

                    {isLoading ? (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyTitle}>Loading friends...</p>
                        </div>
                    ) : filteredFriends.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyTitle}>No friends found</p>
                            <p className={styles.emptyText}>Try another search term.</p>
                        </div>
                    ) : (
                        <section className={styles.friendsGrid}>
                            {filteredFriends.map(friend => (
                                <article key={friend.id} className={styles.friendCard}>
                                    <div className={styles.friendTop}>
                                        <div className={styles.avatar}>{getInitials(friend.username)}</div>

                                        <div className={styles.friendIdentity}>
                                            <h3 className={styles.friendName}>{friend.username}</h3>
                                            <p className={styles.lastSeen}>{friend.lastSeen}</p>
                                        </div>
                                    </div>

                                    <div className={styles.statsGrid}>
                                        <div className={styles.statBox}>
                                            <span className={styles.statLabel}>Wins</span>
                                            <span className={styles.statValue}>{friend.wins}</span>
                                        </div>

                                        <div className={styles.statBox}>
                                            <span className={styles.statLabel}>Matches</span>
                                            <span className={styles.statValue}>{friend.matches}</span>
                                        </div>

                                        <div className={styles.statBox}>
                                            <span className={styles.statLabel}>Win Rate</span>
                                            {/* Safety check added here to prevent NaN% if matches is 0 */}
                                            <span className={styles.statValue}>{friend.matches > 0 ? Math.round((friend.wins / friend.matches) * 100) : 0}%</span>
                                        </div>
                                    </div>

                                    <div className={styles.actionRow}>
                                        <button type="button" className={styles.secondaryButton} onClick={() => setSelectedFriend(profilesMap[friend.id])}>View Profile</button>
                                        <button type="button" className={styles.ghostButton} onClick={() => handleRemoveFriend(friend.id)} disabled={removingFriendId === friend.id}>
                                            {removingFriendId === friend.id ? "Removing..." : "Remove"}
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </section>
                    )}
                </div>
            </div>

            <ViewProfile friend={selectedFriend} onClose={() => setSelectedFriend(null)} />
        </>
    );
};

export default MyFriends;