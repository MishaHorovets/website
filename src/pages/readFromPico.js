
async function fetchPicoData(selectedPico) {
  try {
      const response = await fetch('http://localhost:3001/read-pico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: selectedPico.path,
        }),
      });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Pico data:', error);
    return { success: false, error: error.message };
  }
}

export default fetchPicoData;
