import React, { useMemo, useState } from "react";
import styles from "./my_friends.module.css";
import ViewProfile from "../../components/view_profile/view_profile";

const DUMMY_FRIENDS = [
    { id: "friend-1", username: "KingKohli18", wins: 28, matches: 41, lastSeen: "Last seen 12m ago" },
    { id: "friend-2", username: "Ralnat", wins: 19, matches: 33, lastSeen: "Last seen 2h ago" },
    { id: "friend-3", username: "Hitman45", wins: 34, matches: 52, lastSeen: "Last seen 1h ago" },
    { id: "friend-4", username: "Sky360", wins: 12, matches: 20, lastSeen: "Last seen yesterday" },
    { id: "friend-5", username: "BoomBoom", wins: 23, matches: 37, lastSeen: "Last seen 8m ago" },
    { id: "friend-6", username: "YorkerKing", wins: 15, matches: 29, lastSeen: "Last seen 5m ago" }
];

const getInitials = (name = "") => name.trim().split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase() || "").join("") || "?";

const MyFriends = () => {
    const [search, setSearch] = useState("");
    const [friends, setFriends] = useState(DUMMY_FRIENDS);
    const [removingFriendId, setRemovingFriendId] = useState(null);
    const [selectedFriend, setSelectedFriend] = useState(null);

    const filteredFriends = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();
        return friends.filter(friend => !normalizedSearch || friend.username.toLowerCase().includes(normalizedSearch));
    }, [search, friends]);

    const handleRemoveFriend = async (friendId) => {
        try {
            setRemovingFriendId(friendId);

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/remove-friend`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ friendId })
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

                    {filteredFriends.length === 0 ? (
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
                                            <span className={styles.statValue}>{Math.round((friend.wins / friend.matches) * 100)}%</span>
                                        </div>
                                    </div>

                                    <div className={styles.actionRow}>
                                        <button type="button" className={styles.secondaryButton} onClick={() => setSelectedFriend(friend)}>View Profile</button>
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

// import React, { useMemo, useState, useEffect, useContext } from "react";
// import styles from "./my_friends.module.css";
// import ViewProfile from "../../components/view_profile/view_profile";
// import { useAuth } from "../../context/AuthContext";
// import { fetchWithAuth } from "../../utils/fetchWithAuth";

// const getInitials = (name = "") => name.trim().split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase() || "").join("") || "?";

// const MyFriends = () => {
//     // CORRECTED: Extracting userId directly based on your AuthContext
//     const  userId  = useContext(useAuth); 
//     const [search, setSearch] = useState("");
//     const [friends, setFriends] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [removingFriendId, setRemovingFriendId] = useState(null);
//     const [selectedFriend, setSelectedFriend] = useState(null);

//     // Fetch friends on component mount
//     useEffect(() => {
//         const loadFriends = async () => {
//             try {
//                 const response = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_URL}/api/fetch-friends`);
//                 const result = await response.json();
//                 if (response.ok) {
//                     setFriends(result.data || result || []);
//                 }
//             } catch (err) {
//                 console.error("Failed to load friends:", err);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         loadFriends();
//     }, []);

//     const filteredFriends = useMemo(() => {
//         const normalizedSearch = search.trim().toLowerCase();
//         return friends.filter(friend => !normalizedSearch || friend.username.toLowerCase().includes(normalizedSearch));
//     }, [search, friends]);

//     const handleRemoveFriend = async (friendId) => {
//         try {
//             setRemovingFriendId(friendId);

//             const response = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_URL}/api/remove-friend`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 // CORRECTED: Passing the direct userId variable here
//                 body: JSON.stringify({ userId, friendId }) 
//             });

//             const result = await response.json();

//             if (!response.ok || !result.success) {
//                 throw new Error(result.error || "Failed to remove friend");
//             }

//             // Instantly remove from UI
//             setFriends(prev => prev.filter(friend => friend.id !== friendId));

//         } catch (err) {
//             alert(err.message || "Failed to remove friend");
//         } finally {
//             setRemovingFriendId(null);
//         }
//     };

//     return (
//         <>
//             <div className={styles.page}>
//                 <div className={styles.contentShell}>
//                     <header className={styles.headerBlock}>
//                         <p className={styles.eyebrow}>Social Hub</p>
//                         <h1 className={styles.title}>My Friends</h1>
//                         <p className={styles.subtitle}>View your friends list, search profiles, and manage your connections.</p>
//                     </header>

//                     <section className={styles.topPanel}>
//                         <div className={styles.searchWrap}>
//                             <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search friends by username" className={styles.searchInput} />
//                         </div>
//                     </section>

//                     <section className={styles.summaryGrid}>
//                         <div className={styles.summaryCard}>
//                             <span className={styles.summaryLabel}>Total Friends</span>
//                             <span className={styles.summaryValue}>{friends.length}</span>
//                         </div>

//                         <div className={styles.summaryCard}>
//                             <span className={styles.summaryLabel}>Showing</span>
//                             <span className={styles.summaryValue}>{filteredFriends.length}</span>
//                         </div>
//                     </section>

//                     {isLoading ? (
//                         <div className={styles.emptyState}>
//                             <p className={styles.emptyTitle}>Loading friends...</p>
//                         </div>
//                     ) : filteredFriends.length === 0 ? (
//                         <div className={styles.emptyState}>
//                             <p className={styles.emptyTitle}>No friends found</p>
//                             <p className={styles.emptyText}>Try another search term.</p>
//                         </div>
//                     ) : (
//                         <section className={styles.friendsGrid}>
//                             {filteredFriends.map(friend => (
//                                 <article key={friend.id} className={styles.friendCard}>
//                                     <div className={styles.friendTop}>
//                                         <div className={styles.avatar}>{getInitials(friend.username)}</div>

//                                         <div className={styles.friendIdentity}>
//                                             <h3 className={styles.friendName}>{friend.username}</h3>
//                                             <p className={styles.lastSeen}>{friend.lastSeen || "Offline"}</p>
//                                         </div>
//                                     </div>

//                                     <div className={styles.statsGrid}>
//                                         <div className={styles.statBox}>
//                                             <span className={styles.statLabel}>Wins</span>
//                                             <span className={styles.statValue}>{friend.wins || 0}</span>
//                                         </div>

//                                         <div className={styles.statBox}>
//                                             <span className={styles.statLabel}>Matches</span>
//                                             <span className={styles.statValue}>{friend.matches || 0}</span>
//                                         </div>

//                                         <div className={styles.statBox}>
//                                             <span className={styles.statLabel}>Win Rate</span>
//                                             <span className={styles.statValue}>
//                                                 {friend.matches ? Math.round((friend.wins / friend.matches) * 100) : 0}%
//                                             </span>
//                                         </div>
//                                     </div>

//                                     <div className={styles.actionRow}>
//                                         <button 
//                                             type="button" 
//                                             className={styles.secondaryButton} 
//                                             onClick={() => setSelectedFriend(friend)}
//                                         >
//                                             View Profile
//                                         </button>
//                                         <button type="button" className={styles.ghostButton} onClick={() => handleRemoveFriend(friend.id)} disabled={removingFriendId === friend.id}>
//                                             {removingFriendId === friend.id ? "Removing..." : "Remove"}
//                                         </button>
//                                     </div>
//                                 </article>
//                             ))}
//                         </section>
//                     )}
//                 </div>
//             </div>

//             <ViewProfile friend={selectedFriend} onClose={() => setSelectedFriend(null)} />
//         </>
//     );
// };

// export default MyFriends;