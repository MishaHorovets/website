import { useEffect, useState } from 'react';
import "../app/globals.css";
function WiFiSetupPage({handleCloseWifiPopUp}) {

    const [wifiName, setWifiName] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [response, setResponse] = useState('');
  let selectedPico = null;
  selectedPico = JSON.parse(localStorage.getItem('selectedPico'));
      const sendMessage = async () => {
    //handle errors when pico is not connected
    //close the connection to the pico which does not exist
    //as well show the different modal page 
    //which asks user to choose a pico initially
    //and then proceed to the wifi setup page
    if (!selectedPico) {
      setResponse("Please choose pico");
      return;
    }
    if (!wifiName || !wifiPassword) {
      setResponse('Please fill in both fields.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/send-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          picoPath: selectedPico?.path,
          message: `${wifiName}:${wifiPassword}`,
        }),
      });

      const data = await res.json();
      setResponse(data.success ? `Pico Received: ${data.receivedMessage}` : 'Failed to send message');
    } catch (error) {
      console.error('Error:', error);
      setResponse('An error occurred while sending the message');
    }
    handleCloseWifiPopUp();
  };

  return (
    <div>
      {(selectedPico !== null && selectedPico.path !== null) ? (
      <div className="flex justify-center bg-black-1000">
        <div className="w-full max-w-md px-1 p-8 bg-black-1000 rounded-lg shadow-lg space-y-4">
          <header className="text-center">
            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-red-600">
              Wi-Fi Setup {selectedPico.path || 'Unknown'}
              
            </h1>
          </header>
          <div className="space-y-4 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-red-600">
            <input 
              type="text"
              placeholder="Wi-Fi Name"
              value={wifiName}
              onChange={(e) => setWifiName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-pink-500 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <input
              type="password"
              placeholder="Wi-Fi Password"
              value={wifiPassword}
              onChange={(e) => setWifiPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-pink-500 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button onClick={sendMessage}>Send to Pico</button>
          </div>
          {response && <p>{response}</p>}
        </div>
      </div>
      ) : (
        <div className="w-full max-w-md p-8 bg-black-1000 rounded-lg shadow-lg space-y-4 px-10">
          <div className="space-y-4 text-2xl font-extrabold text-transparent bg-clip-text bg-red-500 ">
            <p>Please select a pico</p>
          </div>
        </div>
        )
      }
  </div>
  );
}

export default WiFiSetupPage;
