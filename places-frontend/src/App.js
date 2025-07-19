import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Overpass QL query
  const overpassQuery = `
    [out:json];
    (
      node["amenity"="hospital"](22.28,70.77,22.33,70.83);
      node["amenity"="clinic"](22.28,70.77,22.33,70.83);
      node["amenity"="pharmacy"](22.28,70.77,22.33,70.83);
    );
    out body;
  `;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          'https://overpass-api.de/api/interpreter',
          `data=${encodeURIComponent(overpassQuery)}`,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );

        const elements = response.data.elements;
        setPlaces(elements);
      } catch (err) {
        setError('Failed to fetch data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>🩺 Hospitals, Clinics & Medicals in Rajkot (Overpass API)</h2>
      {loading && <p>Loading data...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {places.map((place) => (
          <li key={place.id} style={{ marginBottom: '15px' }}>
            <strong>{place.tags?.name || 'Unnamed Place'}</strong><br />
            🏥 Type: {place.tags?.amenity}<br />
            📍 Lat: {place.lat}, Lon: {place.lon}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
