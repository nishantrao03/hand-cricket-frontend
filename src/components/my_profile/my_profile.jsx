import React, { useState } from 'react';
import styles from './my_profile.module.css';
import { useAuth } from '../../context/AuthContext.jsx';

const MyProfilePopup = ({ user, onClose, onSuccess }) => {
    /* Initialize local state with existing user data */
    const { fetchWithAuth } = useAuth();
    console.log(user);

    const [formData, setFormData] = useState({
        country: user.country || '',
        favoriteTeam: user.favoriteTeam || '',
        discordUsername: user.discordUsername || '',
        bio: user.bio || ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    /* Determine if any field has been modified */
    const isDirty = 
        formData.country !== (user.country || '') ||
        formData.favoriteTeam !== (user.favoriteTeam || '') ||
        formData.discordUsername !== (user.discordUsername || '') ||
        formData.bio !== (user.bio || '');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!isDirty) return;
        
        try {
            setIsSaving(true);
            setError(null);

            const response = await fetchWithAuth(`${BACKEND_URL}/api/update-user`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    id: user.id, /* Required by the updateUser Prisma tool */
                    ...formData 
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                if (onSuccess) onSuccess();
            } else {
                setError(result.error || "Failed to update profile details.");
            }
        } catch (err) {
            console.error("Profile update error:", err);
            setError("A network error occurred while updating.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            {/* Prevent clicking inside the modal from closing it */}
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                
                <button className={styles.closeButton} onClick={onClose}>×</button>
                
                <header className={styles.headerBlock}>
                    <p className={styles.eyebrow}>Social Hub</p>
                    <h1 className={styles.title}>MY PROFILE</h1>
                    <p className={styles.subtitle}>View and update your personal player details.</p>
                </header>

                <div className={styles.content}>
                    {error && <div className={styles.errorBox}>{error}</div>}
                    
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Country</label>
                        <input type="text" name="country" className={styles.input} value={formData.country} onChange={handleChange} placeholder="e.g. India" />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Favorite Team</label>
                        <input type="text" name="favoriteTeam" className={styles.input} value={formData.favoriteTeam} onChange={handleChange} placeholder="e.g. Mumbai Indians" />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Discord Username</label>
                        <input type="text" name="discordUsername" className={styles.input} value={formData.discordUsername} onChange={handleChange} placeholder="e.g. player#1234" />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Bio</label>
                        <textarea name="bio" className={styles.textarea} value={formData.bio} onChange={handleChange} placeholder="Write something about your playing style..." rows="3"></textarea>
                    </div>
                    
                    <div className={styles.actionFooter}>
                        <button className={styles.saveBtn} onClick={handleSave} disabled={!isDirty || isSaving}>
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfilePopup;