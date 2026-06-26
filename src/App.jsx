// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import LandingPage from './views/landing_page/landing_page.jsx';
// import Login from './views/auth/login/login.jsx';
// import Signup from './views/auth/signup/signup.jsx';
// import './App.css';
// import ChatPage from "./views/chat_page.jsx";
// import { useAuth } from "./context/AuthContext";

// function App() {
//   const { isAuthenticated } = useAuth();

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route
//           path="/chat"
//           element={
//             isAuthenticated ? <ChatPage /> : <Navigate to="/"  />
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from './views/landing_page/landing_page.jsx';
import Login from './views/auth/login/login.jsx';
import Signup from './views/auth/signup/signup.jsx';
import HomePage from './views/home_page/home_page.jsx';
import './App.css';
import { useAuth } from "./context/AuthContext";
import MatchPage from './views/match_page/match_page.jsx';
import MatchHistory from './views/match_history/match_history.jsx';
import MyFriends from './views/my_friends/my_friends.jsx';
import MatchRules from './views/match_rules/match_rules.jsx';
import { useEffect } from "react";

function App() {
  const {
    isAuthenticated,
    userId,
    setUserId,
    checkAccessToken,
    checkRefreshToken,
    setIsAuthenticated,
    logout,
  } = useAuth();

  // useEffect(() => {
  //   //let mounted = true;
  //   console.log("App useEffect triggered for userId:", userId);

  //   async function validateTokens() {
  //     // If userId is null, treat as unauthenticated
  //     if (!userId) {
  //       setIsAuthenticated(false);
  //       //setIsAuthenticated && console.debug('No userId — marked unauthenticated');
  //       return;
  //     }
  //     //console.log("Reached here");

  //     try {
  //       // First check access token via AuthContext helper
  //       const accessOk = await checkAccessToken();
  //       console.log("Access token valid:", accessOk);
  //       //if (!mounted) return;
  //       if (accessOk) {
  //         setIsAuthenticated(true);
  //         return;
  //       }
  //       //console.log("Access token invalid/expired, trying refresh...");

  //       // Access token invalid/expired — try refresh
  //       const refreshOk = await checkRefreshToken();
  //       //if (!mounted) return;
  //       if (refreshOk) {
  //         setIsAuthenticated(true);
  //         return;
  //       }

  //       // Both checks failed — clear auth
  //       await logout().catch(() => {});
  //       setUserId(null);
  //       setIsAuthenticated(false);
  //     } catch (err) {
  //       // On error, clear auth to be safe
  //       await logout().catch(() => {});
  //       setUserId(null);
  //       setIsAuthenticated(false);
  //     }
  //   }

  //   validateTokens();

    
  // }, [userId]);

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> */}
        <Route
          path="/home"
          element={
            isAuthenticated ? <HomePage /> : <Navigate to="/"  />
          }
        />
        <Route
          path="/"
          element={
            (!isAuthenticated) ? <LandingPage /> : <Navigate to="/home"  />
          }
        />
        <Route
          path="/login"
          element={
            (!isAuthenticated) ? <Login /> : <Navigate to="/home"  />
          }
        />
        <Route
          path="/signup"
          element={
            (!isAuthenticated) ? <Signup /> : <Navigate to="/home"  />
          }
          
        />
        <Route
          path="/match/:matchId"
          element={
            isAuthenticated ? <MatchPage /> : <LandingPage />
          }
        />
        <Route
          path="/matchhistory"
          element={
            isAuthenticated ? <MatchHistory /> : <LandingPage />
          }
        />
        <Route
          path="/friends"
          element={
            isAuthenticated ? <MyFriends /> : <LandingPage />
          }
        />
        <Route
          path="/matchrules"
          element={
            isAuthenticated ? <MatchRules /> : <LandingPage />
          }
        />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;