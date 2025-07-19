import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CITY_COORDS = {
  Rajkot: [22.28, 70.77, 22.33, 70.83],
  Morbi: [22.78, 70.82, 22.85, 70.90],
  Jamnagar: [22.44, 70.02, 22.48, 70.10],
  Ahmedabad: [23.01, 72.50, 23.09, 72.65],
  Gandhinagar: [23.20, 72.60, 23.28, 72.72],
  Surat: [21.15, 72.75, 21.25, 72.90],
  Vadodara: [22.28, 73.15, 22.33, 73.25],
  Bhavnagar: [21.75, 72.10, 21.80, 72.20],
  Junagadh: [21.51, 70.44, 21.55, 70.50],
  Mehsana: [23.59, 72.37, 23.63, 72.43],
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const Location = () => {
  const [selectedCity, setSelectedCity] = useState('Rajkot');
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClinics = async (city) => {
    const [sLat, sLon, nLat, nLon] = CITY_COORDS[city];
    const query = `
      [out:json];
      (
        node["amenity"="clinic"](${sLat},${sLon},${nLat},${nLon});
      );
      out body;
    `;

    try {
      setLoading(true);
      setError(null);
      setClinics([]);
      

      const res = await axios.post(
        'https://overpass-api.de/api/interpreter',
        `data=${encodeURIComponent(query)}`,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );

      const elements = res.data.elements;
      const enriched = [];

      for (let clinic of elements.slice(0, 10)) {
        const address = await getAddress(clinic.lat, clinic.lon);
        enriched.push({
          id: clinic.id,
          name: clinic.tags?.name || 'Unnamed Clinic',
          lat: clinic.lat,
          lon: clinic.lon,
          address,
          phone: clinic.tags?.phone || null,
        });
        await delay(1000);
      }

      setClinics(enriched);
    } catch (err) {
      console.error(err);
      setError("Couldn't load clinics. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const getAddress = async (lat, lon) => {
    try {
      const res = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          format: 'json',
          lat,
          lon,
        },
        headers: {
          'Accept-Language': 'en',
        },
      });
      return res.data.display_name || 'Unknown Address';
    } catch {
      return 'Unknown Address';
    }
  };

  useEffect(() => {
    fetchClinics(selectedCity);
  }, [selectedCity]);

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h2>🏥 Clinics in {selectedCity}</h2>

      <label htmlFor="city">Select City: </label>
      <select
        id="city"
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
        style={{ marginLeft: '10px', padding: '5px' }}
      >
        {Object.keys(CITY_COORDS).map((city) => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>

      {loading && <p>Loading clinics...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {clinics.map((clinic) => (
          <li key={clinic.id} style={{
            border: '1px solid #ddd',
            margin: '10px 0',
            padding: '10px',
            borderRadius: '8px',
          }}>
            <strong>{clinic.name}</strong><br />
            📍 {clinic.address}<br />
            📞 {clinic.phone ? (
              <a href={`tel:${clinic.phone}`}>Call</a>
            ) : (
              <span style={{ color: 'gray' }}>No phone available</span>
            )}<br />
            🗺️ <a
              href={`https://www.google.com/maps?q=${clinic.lat},${clinic.lon}`}
              target="_blank"
              rel="noreferrer"
            >
              Open in Google Maps
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Location;
