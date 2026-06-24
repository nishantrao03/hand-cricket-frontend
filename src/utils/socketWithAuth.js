// src/utils/socketWithAuth.js
import { io } from "socket.io-client";

/**
 * Creates a Socket.io instance equipped with an automatic silent-refresh interceptor.
 * If the initial handshake fails due to an expired access token, it suspends connection
 * attempts, refreshes the token via HTTP, and automatically retries the handshake.
 * * @param {string} backendUrl - The base URL of the backend server.
 * @returns {Socket} - The configured Socket.io instance.
 */
export const createAuthenticatedSocket = (backendUrl) => {
    // Initialize the socket with cross-origin credentials enabled
    const socket = io(backendUrl, {
        transports: ["websocket"],
        withCredentials: true
    });

    // Intercept connection errors specifically for authentication failures
    socket.on("connect_error", async (err) => {
        if (err.message.includes("Authentication error")) {
            console.log("Socket handshake rejected. Attempting silent refresh...");

            // Disconnect immediately to prevent Socket.io from aggressively 
            // spamming the backend with failing reconnection attempts
            socket.disconnect();

            try {
                // Execute the refresh token request via standard HTTP
                const refreshResponse = await fetch(`${backendUrl}/refresh-token`, {
                    method: 'POST',
                    credentials: 'include'
                });

                if (refreshResponse.ok) {
                    console.log("Socket silent refresh successful. Retrying connection...");
                    
                    // The browser now holds the new access token cookie.
                    // Calling connect() triggers a fresh handshake with the new credentials.
                    socket.connect();
                } else {
                    console.error("Refresh token is invalid or expired. Session terminated.");
                }
            } catch (refreshErr) {
                console.error("Network failure during the socket refresh sequence:", refreshErr);
            }
        }
    });

    return socket;
};