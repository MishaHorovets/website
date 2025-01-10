'use client';

function TopBar({handleClosePopUp, handleOpenPopUp, handleOpenWifiPopUp, handCloseWifiPopUp}) {
    const chosenWifi = localStorage?.getItem('currWifi');
    const wifiStatus = chosenWifi ? true : false;
    const storedPico = localStorage.getItem('selectedPico');
    let selectedPico = null;
    if (storedPico) {
      selectedPico = JSON.parse(storedPico);
    }
  return (
    <div className="flex justify-between padding-4 px-2 py-2 bg-while-100">
      <button onClick={handleOpenWifiPopUp}>
        <div className="">
          {wifiStatus ? (
            <div className="text-green-500">Wifi Connected</div>
          ) : (
            <div className="text-red-500">Wifi Disconnected</div>
            )
          }
        </div>
      </button>

      <button onClick={handleOpenPopUp}>
        <div className = "flex justify-between padding-4 px-2 rounded-md bg-purple-500">
          <strong>Current Pico:</strong>{'  '}

          {selectedPico ? (
            <div
              className=""
            >
              {selectedPico.path}
            </div>
          ) : (
            <span>No Pico Selected</span>
          )}

        </div>
      </button>
      <div>My Pico App</div>
    </div>
  );
}

export default TopBar;
