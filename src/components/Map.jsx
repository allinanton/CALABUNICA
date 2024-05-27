import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ latlong }) => {
  useEffect(() => {
    // Split latlong into latitude and longitude
    const [lat, long] = latlong.split(',');

    // Create Leaflet map
    const map = L.map('map').setView([lat, long], 13); // Center the map using the provided lat and long

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add marker for the provided lat and long
    L.marker([lat, long]).addTo(map).bindPopup('Your location');

  }, [latlong]); // Re-render the map whenever latlong changes

  return (
    <div id="map" style={{ height: '400px' }}></div>
  );
};

export default Map;
