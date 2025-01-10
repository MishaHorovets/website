'use client';
function CheckSelectedPico() {
  const selectedPico = JSON.parse(localStorage.getItem('selectedPico'));
  function removeSelectedPico() {
    localStorage.removeItem('selectedPico');
  }
  if (localStorage.getItem('selectedPico') === null) {
    return (
      <div>
        <h1>No Pico Selected</h1>
        <p>Please select a Pico from the list.</p>
      </div>
    );
  }
    return (
    <div>
      <h1>Selected Pico</h1>
      <p>Details about the selected Pico:</p>
      <pre>{JSON.stringify(selectedPico, null, 2)}</pre>

      <button onClick={() => removeSelectedPico()}>Go Back</button>
    </div>
  );
}


export default CheckSelectedPico;
