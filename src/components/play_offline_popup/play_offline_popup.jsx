import React, { useState } from 'react';
import styles from './play_offline_popup.module.css';
import { fetchWithAuth } from '../../utils/fetchWithAuth.js';
import { useNavigate } from 'react-router-dom';

const PlayOfflinePopup = ({ matchId, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [overs, setOvers] = useState(5);
  const [wickets, setWickets] = useState(10);
  
  const navigate = useNavigate();

  /* Fallback to window.location.origin if VITE_FRONTEND_URL is not set */
  const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
  const matchLink = `${FRONTEND_URL}/match/${matchId}`;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetchWithAuth(
        `${BACKEND_URL}/api/create-match-invitation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            id: matchId,
            overs: parseInt(overs),
            wickets: parseInt(wickets)
          })
        }
      );
      const data = await response.json();
      
      console.log(data);

      if (data.success == true) {
        setIsGenerated(true);
      } else {
        setError(data.error || "Failed to generate match link.");
      }
    } catch (err) {
      console.error("Error generating match:", err);
      setError("Network error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(matchLink);
      setCopied(true);
      /* Reset the copied state after 2 seconds for UX feedback */
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popupCard}>
        
        {/* Header with Close Button */}
        <div className={styles.header}>
          <h2 className={styles.title}>Invite Opponent</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" className={styles.closeIcon}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div className={styles.content}>
          <p className={styles.description}>
            {isGenerated 
              ? "Share the link below with whoever you want to play against." 
              : "Generate a secure private link to challenge an opponent offline."}
          </p>

          {error && <div className={styles.errorBox}>{error}</div>}

          {!isGenerated ? (
            <>
              <div className={styles.settingsRow}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Overs</label>
                  <select className={styles.selectField} value={overs} onChange={(e) => setOvers(e.target.value)}>
                    {Array.from({ length: 16 }, (_, i) => i + 5).map((num) => (
                      <option key={`over-${num}`} value={num}>{num} Overs</option>
                    ))}
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Wickets</label>
                  <select className={styles.selectField} value={wickets} onChange={(e) => setWickets(e.target.value)}>
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                      <option key={`wicket-${num}`} value={num}>{num} Wickets</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.generateContainer}>
                <button className={styles.generateButton} onClick={handleGenerateLink} disabled={isGenerating}>
                  {isGenerating ? "Generating..." : "Generate Invite Link"}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className={styles.linkBar}>
                <input 
                  type="text" 
                  readOnly 
                  value={matchLink} 
                  className={styles.linkInput}
                />
                <button 
                  className={`${styles.copyBtn} ${copied ? styles.copiedState : ''}`} 
                  onClick={handleCopy}
                >
                  {copied ? (
                    <svg viewBox="0 0 24 24" className={styles.actionIcon}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className={styles.actionIcon}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
              
              {/* Subtle feedback text below the bar */}
              <div className={styles.feedbackWrapper}>
                {copied && <span className={styles.feedbackText}>Copied to clipboard!</span>}
              </div>

              {/* Footer Action Area */}
              <div className={styles.actionFooter}>
                <button className={styles.joinButton} onClick={() => navigate(`/match/${matchId}`)}>
                  JOIN
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default PlayOfflinePopup;