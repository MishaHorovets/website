'use client';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import React, { useState, useEffect } from 'react';
import './globals.css';
import NotFound from './not-found.js';
import PicoReader from '../pages/home-page.js';
import WiFiSetupPage from '../pages/wifi-setup.js';
import CheckSelectedPico from '../pages/check-selected-pico.js';
import TopBar from '../components/top-bar.js';
import styled from 'styled-components'; 
const ModalContainer = styled.div`
  position: flex;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
background: rgba(0, 0, 0, 0.9)
`;
function App() {
  //auto animate 
  const [parent] = useAutoAnimate();
  const [picos, setPicos] = useState(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const [showWifiPopUp, setShowWifiPopUp] = useState(false);
  //wifi connection pop up 
  const handleOpenWifiPopUp = () =>  setShowWifiPopUp(true); 
  const handleCloseWifiPopUp = () => setShowWifiPopUp(false);
  //pico selection pop up
  const handleOpenPopUp = () => setShowPopUp(true);
  const handleClosePopUp = () => setShowPopUp(false);

  const handleSelectPico = (pico) => {
    setShowPopUp(false);
    localStorage.setItem('selectedPico', JSON.stringify(pico));
  }

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (JSON.parse(localStorage.getItem("selectedPico")) !== null) {
          let flag = false;
        for (let i = 0; i < data.length; i++) {

          if (data[i].path == JSON.parse(localStorage.getItem("selectedPico")).path) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          localStorage.setItem("selectedPico", null);
        }
        }
        setPicos(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    return () => ws.close();
  }, []);
  return (
    
    //removing selectedPico will result in fast refresh
    <div ref={parent}>
    <TopBar 
      handleOpenPopUp={handleOpenPopUp}
      handleClosePopUp={handleClosePopUp}
      handleOpenWifiPopUp={handleOpenWifiPopUp}
      handleCloseWifiPopUp={handleCloseWifiPopUp}
    />
      {showWifiPopUp && (
        <div className="modal">
          <div className="modal-content">
            {// if wifi is not connected it should show an option 
            // to connect to wifi in other words enter wifi credentials
            }
            <WiFiSetupPage handleCloseWifiPopUp={handleCloseWifiPopUp}/>
            <button onClick={handleCloseWifiPopUp}>Close</button>
          </div>
        </div>
      )}

      {showPopUp && (
        <div className="modal">
          <div className="modal-content">
            <h1
              className="text-2xl text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-red-600 rounded-md">
              Select a Pico
            </h1>
            <ul>
              { (picos && picos.length > 0) && 
              (picos.map((pico) => (
                <li 
                  key={pico}
                  className="text-1xl text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-red-600 rounded-md cursor-pointer border border-white-300 hover:border-purple-500 p-3 transition-all duration-500"
                  onClick={() => handleSelectPico(pico)}>
                  {pico.path}
                </li>
              )))}
            </ul>
            <button onClick={handleClosePopUp}>Close</button>
          </div>
        </div>
      )}
      <PicoReader/>
    </div>
  );
}

export default App;
