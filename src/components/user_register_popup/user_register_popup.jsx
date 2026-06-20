import React, { useState } from 'react';
import styles from './user_register_popup.module.css';
import { useAuth } from '../../context/AuthContext.jsx';

const UserRegisterPopup = ({ userId, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    country: '',
    favouriteTeam: '',
    discordUsername: '',
    bio: ''
  });
  const { setUserName } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  /* The submit button is strictly enabled only when the required username field has text */
  const isFormValid = formData.username.trim().length > 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
        console.log(formData.username);
      const response = await fetch(`${BACKEND_URL}/api/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: userId,
          username: formData.username,
          country: formData.country,
          favourite_cricket_team: formData.favouriteTeam,
          discord_username: formData.discordUsername,
          bio: formData.bio
        })
      });

      const data = await response.json();

      if (data.success !== false) {
        console.log("User successfully created:", data);
        setUserName(formData.username);
        onSuccess();
      } else {
        setErrorMessage(data.error || 'Failed to create user profile.');
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setErrorMessage('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popupCard}>
        <div className={styles.header}>
          <h2 className={styles.title}>Player Registration</h2>
          <p className={styles.subtitle}>Complete your profile to step onto the pitch.</p>
        </div>

        {errorMessage && <div className={styles.errorBox}>{errorMessage}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          
          <div className={styles.inputGroup}>
            <label className={styles.label}>Username <span className={styles.requiredAsterisk}>*</span></label>
            <input
              type="text"
              name="username"
              placeholder="Enter your gamertag"
              className={styles.inputField}
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Country</label>
              <input
                type="text"
                name="country"
                placeholder="Optional"
                className={styles.inputField}
                value={formData.country}
                onChange={handleChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Favourite Team</label>
              <input
                type="text"
                name="favouriteTeam"
                placeholder="e.g., Mumbai Indians"
                className={styles.inputField}
                value={formData.favouriteTeam}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Discord Username</label>
            <input
              type="text"
              name="discordUsername"
              placeholder="user#1234 (Optional)"
              className={styles.inputField}
              value={formData.discordUsername}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Bio</label>
            <textarea
              name="bio"
              placeholder="Tell us about your playstyle... (Optional)"
              className={`${styles.inputField} ${styles.textArea}`}
              value={formData.bio}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className={styles.actionFooter}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Complete Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRegisterPopup;