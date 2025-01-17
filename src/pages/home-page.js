'use client';
import '../app/globals.css';
import fetchPicoData from './readFromPico.js';
import { useState } from 'react';

function homePage({picos}) {
  const handleSelect = (pico) => {
      localStorage.setItem('selectedPico', JSON.stringify(pico));
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-1xl text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-red-600 rounded-md cursor-pointer border border-white-300 hover:border-purple-500 p-3 transition-all duration-300">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-purple-300 to-red-600 mb-6">Select a Pico</h1>
      <ul className="text-primary-pink from-pink-400 to-red-600 w-96 bg-white rounded-lg shadow-md p-4 space-y-2">
        {picos.length === 0 ? (
          <li className="text-1xl font-extrabold text-transparent bg-clip-text bg-red-600 text-center">No connected Picos found.</li>
        ) : (
          picos.map((pico, index) => (
            <li
              key={index}
              className="text-1xl text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-red-600 rounded-md cursor-pointer border border-white-300 hover:border-purple-500 p-3 transition-all duration-300"
              onClick={() => handleSelect(pico)}
            >
              <strong>{pico.path}</strong> - {pico.manufacturer}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default function PicoReader() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);


  const handleReadPico = async () => {
    const selectedPico = JSON.parse(localStorage.getItem('selectedPico'));

    if (!selectedPico || !selectedPico.path) {
      setError('No Pico selected.');
      return;
    }

    const result = await fetchPicoData(selectedPico);

    if (result.success) {
      setStatus(`Successfully started reading from Pico: ${result.message}`);
      setError(null); // Clear any previous errors
    } else {
      setError(result.error || 'Failed to read from Pico.');
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <button
        onClick={handleReadPico}
        className="bg-blue-500 text-white p-3 rounded transition transform hover:scale-105 hover:bg-blue-600 hover:shadow-lg"
      >
        Read from Pico
      </button>

      {status && <p className="text-green-500 mt-4">{status}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
