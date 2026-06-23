import React, { useState } from "react";
import styles from "./login.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../firebase";

const Login = () => {
  const navigate = useNavigate();
  const { login, callBackendLogin, setUserId, createUserInBackend } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmailLogin() {
    try {
      setError("");
      setLoading(true);

      await login(email, password);

      const user = auth.currentUser;

      // Get Firebase ID token for the logged-in user
      const firebaseToken = await auth.currentUser.getIdToken();

      // Call the backend /login route with the Firebase token
      await callBackendLogin(firebaseToken);
      
      console.log(user.uid);
      setUserId(user.uid);
      
      console.log("User ID set in context:", auth.currentUser.uid);
      console.log("Email/Password login successful, navigating to /chat");

      //navigate("/chat");
    } catch (e) {
      setError("Failed to log in" + e.message);
    }
    setLoading(false);
  }

  async function handleGoogleSignIn() {
    const provider = new GoogleAuthProvider();
    try {
      setError("");
      setLoading(true);
      //console.log("Opening Google popup...");
      const result = await signInWithPopup(auth, provider);

      // Get Firebase ID token for the Google user
      const firebaseToken = await result.user.getIdToken();

      // Call the backend /login route with the Firebase token
      await callBackendLogin(firebaseToken);
      setUserId(result.user.uid);
      await createUserInBackend(result.user.uid);
      console.log("User ID set in context:", result.user.uid);
      console.log("Google sign-in successful, navigating to /chat");

      //navigate("/chat");
    } catch (e) {
      setError("Failed to sign in with Google: " + e.message);
      console.error(e);
    }
    setLoading(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Login</h1>
          <p className={styles.subtitle}>Enter your details to access the pitch</p>
        </div>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <div className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email"
              className={styles.inputField}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="Password"
              className={styles.inputField}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button disabled={loading} onClick={handleEmailLogin} className={styles.primaryButton}>
            Login
          </button>
        </div>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <button onClick={handleGoogleSignIn} disabled={loading} type="button" className={styles.googleButton}>
          <svg className={styles.googleIcon} width="24" height="24" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign In With Google
        </button>

        <p className={styles.signupText}>
          Don't have an account?{" "}
          <span onClick={() => navigate("/signup")} className={styles.signupLink}>Create one.</span>
        </p>
      </div>
    </div>
  );
};

export default Login;