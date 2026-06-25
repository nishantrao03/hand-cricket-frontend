// src/utils/fetchWithAuth.js

/**
 * A custom wrapper around the native fetch API that automatically handles
 * silent token refreshing when an access token expires.
 * * @param {string} url - The endpoint URL to fetch.
 * @param {object} options - Standard fetch options (method, headers, body, etc.).
 * @returns {Promise<Response>} - The final fetch response.
 */

export const fetchWithAuth = async (url, options = {}) => {
    // Ensure credentials are included so the browser sends the HTTP-only cookies
    options.credentials = 'include';

    // Execute the initial request with the current access token
    let response = await fetch(url, options);

    // Intercept unauthorized or forbidden responses indicating an expired token
    if (response.status === 401 || response.status === 403) {
        console.log('Access token rejected. Attempting silent refresh sequence...');

        try {
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
            
            // Execute the refresh token request
            // Ensure this URL exactly matches your backend refresh route
            const refreshResponse = await fetch(`${BACKEND_URL}/refresh-token`, {
                method: 'POST', 
                credentials: 'include' 
            });

            if (refreshResponse.ok) {
                console.log('Silent refresh successful. Retrying original request...');
                
                // Retry the original request; the browser will automatically 
                // attach the newly issued access token cookie
                response = await fetch(url, options);
            } else {
                console.error('Refresh token is invalid or expired. Session terminated.');
                
                // Optional: Dispatch a custom event here to trigger a global UI 
                // logout or redirect the user to the /login page.
                // window.dispatchEvent(new Event('auth-expired'));
            }
        } catch (error) {
            console.error('Network failure during the silent refresh sequence:', error);
        }
    }

    // Return the response (whether it is the first success, the retry success, or a failure)
    return response;
};