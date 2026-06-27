// import React, { useContext, useState, useEffect } from "react";
// import { auth } from "../firebase";
// import { 
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged
// } from "firebase/auth";

// const AuthContext = React.createContext();

// export function useAuth() {
//   return useContext(AuthContext);
// }

// export function AuthProvider({ children }) {
//   const [currentUser, setCurrentUser] = useState();
//   const [loading, setLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

//   function signup(email, password) {
//     return createUserWithEmailAndPassword(auth, email, password);
//   }

//   function login(email, password) {
//     return signInWithEmailAndPassword(auth, email, password);
//   }

//   function logout() {
//     return signOut(auth);
//   }

//   async function callBackendLogin(firebaseToken) {
//     try {
//       await fetch(`${BACKEND_URL}/login`, {
//         method: "POST",
//         credentials: "include", // ensures cookies are stored
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ firebaseToken }),
//       });
//       console.log("Successfully called backend /login");
//     } catch (err) {
//       console.error("Error calling backend /login:", err);
//     }
//   }

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       // If no Firebase user, clear state immediately
//       if (!user) {
//         setCurrentUser(null);
//         setIsAuthenticated(false);
//         setLoading(false);
//         return;
//       }

//       // If there is a firebase user, validate access token with backend
//       (async () => {
//         try {
//           // Check access token validity
//           const accessResp = await fetch(`${BACKEND_URL}/access-token`, {
//             method: "GET",
//             credentials: "include",
//           });

//           if (accessResp.ok) {
//             // Access token valid
//             console.log("Access token valid");
//             setCurrentUser(user);
//             setIsAuthenticated(true);
//             setLoading(false);
//             return;
//           }

//           // If access token invalid/expired, try refreshing
//           if (accessResp.status === 401 || accessResp.status === 403) {
//             const refreshResp = await fetch(`${BACKEND_URL}/refresh-token`, {
//               method: "POST",
//               credentials: "include",
//             });

//             if (refreshResp.ok) {
//               // Refresh succeeded — consider user still signed in
//               console.log("Access token refreshed");
//               setCurrentUser(user);
//               setIsAuthenticated(true);
//               setLoading(false);
//               return;
//             }

//             // Refresh failed -> clear auth state
//             await logout().catch(() => {}); // ensure firebase is signed out too
//             console.log("Refresh token invalid, logged out");
//             setCurrentUser(null);
//             setisAuthenticated(false);
//             setLoading(false);
//             return;
//           }

//           // Any other response: treat as unauthenticated
//           await logout().catch(() => {});
//           setCurrentUser(null);
//           setIsAuthenticated(false);
//         } catch (err) {
//           // Network or unexpected error -> clear auth to be safe
//           await logout().catch(() => {});
//           setCurrentUser(null);
//           setIsAuthenticated(false);
//         } finally {
//           setLoading(false);
//         }
//       })();
//     });

//     return unsubscribe;
//   }, []);

//   const value = {
//     currentUser,
//     isAuthenticated,
//     login,
//     signup,
//     logout,
//     callBackendLogin,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }


import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { io } from "socket.io-client";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(() => {
    // Load from localStorage on initial mount
    const storedId = localStorage.getItem("userId");
    return storedId ? storedId : null;
  });
  const [userName, setUserName] = useState(null);
  // const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    localStorage.removeItem("userId");
    setUserId(null);
    return signOut(auth);
  }

  // async function createUserInBackend(uid) {
  


  //   if (!uid) {
  //     console.error('createUserInBackend called without uid');
  //     return { ok: false, message: 'missing uid' };
  //   }

  //   try {
  //     // Prefer the Firebase displayName if available
  //     const name = auth.currentUser?.displayName || '';

  //     const resp = await fetch(`${BACKEND_URL}/create-user`, {
  //       method: 'POST',
  //       credentials: 'include',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ uid, name }),
  //     });

  //     const data = await resp.json().catch(() => ({ ok: resp.ok }));

  //     if (!resp.ok) {
  //       console.error('createUserInBackend failed:', resp.status, data);
  //       return { ok: false, status: resp.status, data };
  //     }

  //     console.log('createUserInBackend success', data);
  //     return data;
  //   } catch (err) {
  //     console.error('createUserInBackend error:', err);
  //     return { ok: false, message: 'network_error' };
  //   }
  // }

  async function createUserInBackend(uid) {
  // TEMPORARY:
  // DB not implemented yet.
  // Stub function so existing login/signup flow does not break.

  if (!uid) {
    console.error('createUserInBackend called without uid');
    return { ok: false, message: 'missing uid' };
  }

  return {
    ok: true,
    skipped: true,
    message: 'User created',
  };
}

  async function handleLogout() {
    // First notify backend to clear cookies (access & refresh)
    try {
      await fetch(`${BACKEND_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      //console.log('Backend logout successful');
    } catch (err) {
      console.error('Backend logout request failed:', err);
      // proceed to firebase logout regardless
    }

    try {
      // This `logout` function already removes localStorage and signs out of Firebase
      await logout();
      //console.log('Firebase logout successful');
    } catch (err) {
      console.error('Firebase logout failed:', err);
    }

    // // Clear local auth state
    // try {
    //   setUserId(null);
    //   setIsAuthenticated(false);
    // } catch (err) {
    //   // ignore
    // }
  }

  async function callBackendLogin(firebaseToken) {
    try {
      await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        credentials: "include", // ensures cookies are stored
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firebaseToken }),
      });
      console.log("Successfully called backend /login");
    } catch (err) {
      console.error("Error calling backend /login:", err);
    }
  }
  /*
  useEffect(() => {
    console.log("Auth state changed, userId:", userId);
    if (!userId) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        // Check access token validity
        const accessResp = await fetch(`${BACKEND_URL}/access-token`, {
          method: "GET",
          credentials: "include",
        });
        console.log(accessResp);
        console.log("Access token validation response status:", accessResp.status);

        if (accessResp.ok) {
          console.log("Access token valid");
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }

        // If access token invalid/expired, try refreshing
        if (accessResp.status === 401 || accessResp.status === 403) {
          const refreshResp = await fetch(`${BACKEND_URL}/refresh-token`, {
            method: "POST",
            credentials: "include",
          });

          if (refreshResp.ok) {
            console.log("Access token refreshed");
            setIsAuthenticated(true);
            setLoading(false);
            return;
          }

          // Refresh failed -> clear auth state
          await logout().catch(() => {});
          console.log("Refresh token invalid, logged out");
          setUserId(null);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // Any other response: treat as unauthenticated
        await logout().catch(() => {});
        setUserId(null);
        setIsAuthenticated(false);
      } catch (err) {
        // Network or unexpected error -> clear auth to be safe
        await logout().catch(() => {});
        setUserId(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);
  */

//   useEffect(() => {
//   const unsubscribe = onAuthStateChanged(auth, (user) => {
//     if (user) {
//       // Call the callBackendLogin to set cookies when user state changes
//       const firebaseToken = user.getIdToken();
//       callBackendLogin(firebaseToken);
//       setUserId(user.uid);
//     } else {
//       setUserId(null);
//     }
//     setLoading(false);
//   });
//   return unsubscribe;
// }, []);

  // Observer for Firebase session loss
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // If Firebase state becomes null externally, clear local state
        setUserId(null);
      }
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, [setUserId]);

  //  Persist userId whenever it changes
  useEffect(() => {
    console.log(userId);
    if (userId) {
      localStorage.setItem("userId", userId);
    } else {
      localStorage.removeItem("userId");
    }
  }, [userId]);

    useEffect(() => {
    //console.log("Auth check running for userId:", userId);
    //console.log("Auth object:", auth);

    console.log(userId);

    // If there's no userId, unauthenticate immediately
    if (!userId) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    // Run token checks when userId is present
    (async () => {
      try {
        const isAccessValid = await checkAccessToken();

        if (isAccessValid) {
          console.log("Access token valid");
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }

        console.log("Access token expired, trying refresh...");

        const isRefreshValid = await checkRefreshToken();

        if (isRefreshValid) {
          console.log("Access token refreshed successfully");
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }

        console.log("Refresh token invalid — logging out");
        await logout().catch(() => {});
        setUserId(null);
        setIsAuthenticated(false);
      } catch (err) {
        console.error("Auth validation error:", err);
        await logout().catch(() => {});
        setUserId(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);



  // Separate functions to check tokens — callable from components
  async function checkAccessToken() {
    try {
      const resp = await fetch(`${BACKEND_URL}/access-token`, {
        method: 'GET',
        credentials: 'include',
      });
      // return true if access token is valid
      return resp.ok;
    } catch (err) {
      console.error('checkAccessToken error:', err);
      return false;
    }
  }

  async function checkRefreshToken() {
    try {
      const resp = await fetch(`${BACKEND_URL}/refresh-token`, {
        method: 'POST',
        credentials: 'include',
      });
      // return true if refresh token successfully refreshed access token
      return resp.ok;
    } catch (err) {
      console.error('checkRefreshToken error:', err);
      return false;
    }
  }

  async function fetchWithAuth(url, options = {}) {
    options.credentials = 'include';
    let response = await fetch(url, options);

    if (response.status === 401 || response.status === 403) {
      console.log('Access token rejected. Attempting silent refresh sequence...');

      try {
        const refreshResponse = await fetch(`${BACKEND_URL}/refresh-token`, {
          method: 'POST', 
          credentials: 'include' 
        });

        if (refreshResponse.ok) {
          console.log('Silent refresh successful. Retrying original request...');
          response = await fetch(url, options);
        } else {
          console.error('Refresh token is invalid or expired. Session terminated.');
          setUserId(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Network failure during the silent refresh sequence:', error);
      }
    }
    return response;
  }

  function createAuthenticatedSocket(backendUrl) {
    const socket = io(backendUrl, {
      transports: ["websocket"],
      withCredentials: true
    });

    socket.on("connect_error", async (err) => {
      if (err.message.includes("Authentication error")) {
        console.log("Socket handshake rejected. Attempting silent refresh...");
        socket.disconnect();

        try {
          const refreshResponse = await fetch(`${backendUrl}/refresh-token`, {
            method: 'POST',
            credentials: 'include'
          });

          if (refreshResponse.ok) {
            console.log("Socket silent refresh successful. Retrying connection...");
            socket.connect();
          } else {
            console.error("Refresh token is invalid or expired. Session terminated.");
            setUserId(null);
            setIsAuthenticated(false);
          }
        } catch (refreshErr) {
          console.error("Network failure during the socket refresh sequence:", refreshErr);
        }
      }
    });

    return socket;
  }

  const value = {
    userId,
    setUserId,
    isAuthenticated,
    login,
    signup,
    logout,
    userName,
    setUserName,
    callBackendLogin,
    checkAccessToken,
    checkRefreshToken,
    setIsAuthenticated,
    createUserInBackend,
    handleLogout,
    fetchWithAuth,
    createAuthenticatedSocket
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}