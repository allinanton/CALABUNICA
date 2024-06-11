import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import app from '../firebase/firebase.config';

const Map = ({ userLatLong, courierLatLong }) => {
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);
  const courierMarkerRef = useRef(null);

  useEffect(() => {
    const [userLat, userLong] = userLatLong.split(',');
    const [courierLat, courierLong] = courierLatLong.split(',');

    // Initialize map only once
    if (mapRef.current === null) {
      mapRef.current = L.map('map').setView([userLat, userLong], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);

      userMarkerRef.current = L.marker([userLat, userLong])
        .addTo(mapRef.current)
        .bindPopup('User location');

      courierMarkerRef.current = L.marker([courierLat, courierLong])
        .addTo(mapRef.current)
        .bindPopup('Courier location');
    } else {
      userMarkerRef.current.setLatLng([userLat, userLong]);
      courierMarkerRef.current.setLatLng([courierLat, courierLong]);
    }

    // Real-time update for courier location
    const db = getFirestore(app);
    const locationDoc = doc(db, 'locations', 'alinanton294@gmail.com'); // Use your specific document ID
    const unsubscribe = onSnapshot(locationDoc, (doc) => {
      if (doc.exists()) {
        const { latitude, longitude } = doc.data().location;
        const newLatLong = [latitude, longitude];
        courierMarkerRef.current.setLatLng(newLatLong);
      } else {
        console.log("No such document!");
      }
    }, (error) => {
      console.error("Error fetching location data:", error);
    });

    return () => {
      unsubscribe();
    };
  }, [userLatLong, courierLatLong]);

  return <div id="map" style={{ height: '400px' }}></div>;
};

export default Map;
