import React, { useState } from 'react';
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "../../utils/fetchWithAuth";
import styles from './match_history.module.css';
import MatchDetails from '../../components/match_details/match_details';

const MatchHistory = () => {
    const [limit, setLimit] = useState(5);
    const [sortOrder, setSortOrder] = useState("desc");
    const [outcome, setOutcome] = useState("all");
    const [selectedMatch, setSelectedMatch] = useState(null);

    const fetchMatches = async ({ pageParam = null }) => {
        let url = `${import.meta.env.VITE_BACKEND_URL}/api/match-history?limit=${limit}&sortOrder=${sortOrder}&outcome=${outcome}`;
        if (pageParam) url += `&cursor=${pageParam}`;

        const response = await fetchWithAuth(url);
        if (!response.ok) throw new Error("Failed to fetch match history");
        return response.json();
    };

    const {
        data,
        error,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ["matchHistory", limit, sortOrder, outcome],
        queryFn: fetchMatches,
        getNextPageParam: (lastPage) => lastPage.nextCursor
    });

    if (isLoading) {
        return (
            <div className={styles.page}>
                <div className={styles.contentShell}>
                    <div className={styles.stateCard}>
                        <div className={styles.loaderContainer}>
                            <div className={styles.spinner}></div>
                            <p className={styles.stateText}>Loading match history...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className={styles.page}>
                <div className={styles.contentShell}>
                    <div className={styles.stateCard}>
                        <p className={styles.errorText}>Error: {error.message}</p>
                    </div>
                </div>
            </div>
        );
    }

    const allMatches = data?.pages?.flatMap(page => page?.matches || []) || [];

    return (
        <div className={styles.page}>
            <div className={styles.contentShell}>
                <header className={styles.headerBlock}>
                    <p className={styles.eyebrow}>Career Record</p>
                    <h1 className={styles.title}>Match History</h1>
                    <p className={styles.subtitle}>Browse your recent games, sort results, and filter wins or losses.</p>
                </header>

                <section className={styles.controlsPanel}>
                    <div className={styles.controlsGrid}>
                        <div className={styles.controlGroup}>
                            <label className={styles.controlLabel} htmlFor="history-limit">Matches</label>
                            <select id="history-limit" className={styles.selectField} value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
                                {[5, 10, 20, 50, 100].map(n => <option key={n} value={n}>Show {n}</option>)}
                            </select>
                        </div>

                        <div className={styles.controlGroup}>
                            <label className={styles.controlLabel} htmlFor="history-sort">Sort</label>
                            <select id="history-sort" className={styles.selectField} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                                <option value="desc">Newest</option>
                                <option value="asc">Oldest</option>
                            </select>
                        </div>

                        <div className={styles.controlGroup}>
                            <label className={styles.controlLabel} htmlFor="history-outcome">Result</label>
                            <select id="history-outcome" className={styles.selectField} value={outcome} onChange={(e) => setOutcome(e.target.value)}>
                                <option value="all">All Matches</option>
                                <option value="win">Wins</option>
                                <option value="loss">Losses</option>
                            </select>
                        </div>
                    </div>
                </section>

                {allMatches.length === 0 ? (
                    <div className={styles.stateCard}>
                        <p className={styles.emptyTitle}>No matches found</p>
                        <p className={styles.stateText}>Try changing the filters or play a few matches first.</p>
                    </div>
                ) : (
                    <>
                        <ul className={styles.matchList}>
                            {data?.pages?.map((page, pageIndex) => (
                                <React.Fragment key={pageIndex}>
                                    {page?.matches?.map((match) => {
                                        const winnerName = match.winner?.username || "—";

                                        return (
                                            <li key={match.id} className={styles.matchCard}>
                                                <div className={styles.cardTop}>
                                                    <div className={styles.playersBlock}>
                                                        <span className={styles.playerName}>{match.player1.username}</span>
                                                        <span className={styles.vsBadge}>VS</span>
                                                        <span className={styles.playerName}>{match.player2.username}</span>
                                                    </div>
                                                </div>

                                                <div className={styles.cardDivider}></div>

                                                <div className={styles.metaGrid}>
                                                    <div className={styles.metaRow}>
                                                        <span className={styles.metaLabel}>Status</span>
                                                        <span className={styles.metaValue}>{match.status}</span>
                                                    </div>

                                                    <div className={styles.metaRow}>
                                                        <span className={styles.metaLabelWinner}>Winner</span>
                                                        <span className={styles.metaValueWinner}>{winnerName}</span>
                                                    </div>
                                                </div>

                                                <button className={styles.viewButton} onClick={() => setSelectedMatch(match)}>
                                                    View Details
                                                </button>
                                            </li>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </ul>

                        <div className={styles.footerAction}>
                            <button className={styles.primaryButton} onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
                                {isFetchingNextPage ? "Loading..." : hasNextPage ? "Load More Matches" : "No More Matches"}
                            </button>
                        </div>
                    </>
                )}

                {selectedMatch && <MatchDetails match={selectedMatch} onClose={() => setSelectedMatch(null)} />}
            </div>
        </div>
    );
};

export default MatchHistory;