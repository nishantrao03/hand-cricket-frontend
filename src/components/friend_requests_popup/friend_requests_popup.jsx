import React, { useState, useEffect } from 'react';
import styles from './friend_requests_popup.module.css';
import { useAuth } from '../../context/AuthContext.jsx';

const getInitials = (name = "") => name.trim().substring(0, 2).toUpperCase() || "?";

const FriendRequestsPopup = ({ onClose }) => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processingId, setProcessingId] = useState(null);
    const { fetchWithAuth } = useAuth();

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetchWithAuth(
                    `${BACKEND_URL}/api/fetch-friend-requests`,
                    {
                        credentials: 'include'
                    }
                );

                const result = await response.json();

                if (response.ok && result.success) {
                    setRequests(result.data || []);
                } else {
                    setError(result.error || "Failed to load friend requests.");
                }
            } catch (err) {
                console.error("Error fetching friend requests:", err);
                setError("A network error occurred while fetching requests.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequests();
    }, [BACKEND_URL]);

    const handleAccept = async (senderId, requestId) => {
        try {
            setProcessingId(requestId);
            const response = await fetchWithAuth(`${BACKEND_URL}/api/accept-friend-request`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ senderId })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setRequests(prev => prev.filter(req => req.id !== requestId));
            } else {
                alert(result.error || "Failed to accept request.");
            }
        } catch (err) {
            console.error("Error accepting request:", err);
            alert("A network error occurred.");
        } finally {
            setProcessingId(null);
        }
    };

    const handleDecline = async (senderId, requestId) => {
        try {
            setProcessingId(requestId);
            const response = await fetchWithAuth(`${BACKEND_URL}/api/decline-friend-request`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ senderId })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setRequests(prev => prev.filter(req => req.id !== requestId));
            } else {
                alert(result.error || "Failed to decline request.");
            }
        } catch (err) {
            console.error("Error declining request:", err);
            alert("A network error occurred.");
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            {/* Prevent clicking inside the modal from closing it */}
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                
                <button className={styles.closeButton} onClick={onClose}>×</button>
                
                <header className={styles.headerBlock}>
                    <p className={styles.eyebrow}>Social Hub</p>
                    <h1 className={styles.title}>MY FRIEND REQUESTS</h1>
                    <p className={styles.subtitle}>Review incoming requests and expand your network.</p>
                </header>

                <div className={styles.content}>
                    {isLoading ? (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyText}>Loading requests...</p>
                        </div>
                    ) : error ? (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyText} style={{ color: "#ff8f8f" }}>{error}</p>
                        </div>
                    ) : requests.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyText}>You have no pending friend requests.</p>
                        </div>
                    ) : (
                        <ul className={styles.requestsList}>
                            {requests.map(req => {
                                /* Safely extract username assuming Prisma include: { sender: true } */
                                const senderUsername = req.sender?.username || req.username || "Unknown Player";
                                
                                return (
                                    <li key={req.id} className={styles.requestCard}>
                                        <div className={styles.userInfo}>
                                            <div className={styles.avatar}>{getInitials(senderUsername)}</div>
                                            <span className={styles.username}>{senderUsername}</span>
                                        </div>
                                        <div className={styles.actionButtons}>
                                            <button 
                                                className={styles.acceptBtn} 
                                                onClick={() => handleAccept(req.senderId, req.id)}
                                                disabled={processingId === req.id}
                                            >
                                                {processingId === req.id ? "..." : "Accept"}
                                            </button>
                                            <button 
                                                className={styles.declineBtn} 
                                                onClick={() => handleDecline(req.senderId, req.id)}
                                                disabled={processingId === req.id}
                                            >
                                                {processingId === req.id ? "..." : "Decline"}
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FriendRequestsPopup;