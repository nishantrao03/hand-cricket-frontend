import React, { useState } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function ChatPage() {
  // const [apiResponse, setApiResponse] = useState('');

  // function testApiCall() {
  //   fetch(`${BACKEND_URL}/`)
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log('API Response:', data);
  //       // Assuming API returns something like { message: "Hello from backend" }
  //       setApiResponse(data.message || JSON.stringify(data));
  //     })
  //     .catch(error => {
  //       console.error('Error fetching API:', error);
  //       setApiResponse(error.message);
  //     });
  // }

  return (
    <div>
      Hello
    </div>
  );
}

export default ChatPage;
