import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CITY_COORDS = {
  Rajkot: [22.28, 70.77, 22.33, 70.83],
  Morbi: [22.78, 70.82, 22.85, 70.90],
  Jamnagar: [22.44, 70.02, 22.48, 70.10],
  Ahmedabad: [23.01, 72.50, 23.09, 72.65],
  Gandhinagar: [23.20, 72.60, 23.28, 72.72],
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const App = () => {
  const [selectedCity, setSelectedCity] = useState('Rajkot');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlaces = async (city) => {
    const [sLat, sLon, nLat, nLon] = CITY_COORDS[city];
    const query = `
      [out:json];
      (
        node["amenity"~"hospital|clinic|pharmacy"](${sLat},${sLon},${nLat},${nLon});
      );
      out body;
    `;

    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        'https://overpass-api.de/api/interpreter',
        `data=${encodeURIComponent(query)}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const elements = response.data.elements;

      // Reverse geocode each one (with delay)
      const enrichedPlaces = [];
      for (const place of elements.slice(0, 10)) { // limit to 10 for demo
        const address = await getAddressFromCoords(place.lat, place.lon);
        enrichedPlaces.push({
          id: place.id,
          name: place.tags?.name || 'Unnamed Place',
          amenity: place.tags?.amenity,
          lat: place.lat,
          lon: place.lon,
          address: address,
        });
        await delay(1000); // 1 second delay
      }

      setPlaces(enrichedPlaces);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getAddressFromCoords = async (lat, lon) => {
    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
        params: {
          format: 'json',
          lat: lat,
          lon: lon,
        },
        headers: {
          'Accept-Language': 'en',
        },
      });

      return res.data.display_name || 'Address not found';
    } catch {
      return 'Address not found';
    }
  };

  useEffect(() => {
    fetchPlaces(selectedCity);
  }, [selectedCity]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>🩺 Hospitals, Clinics & Pharmacies in {selectedCity}</h2>

      <label htmlFor="city-select">Select City: </label>
      <select
        id="city-select"
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
        style={{ marginLeft: '10px', padding: '5px' }}
      >
        {Object.keys(CITY_COORDS).map((city) => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>

      {loading && <p>Loading data (may take a few seconds)...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {places.map((place) => (
          <li key={place.id} style={{ marginBottom: '15px' }}>
            <strong>{place.name}</strong><br />
            🏥 Type: {place.amenity}<br />
            📍 Address: {place.address}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

