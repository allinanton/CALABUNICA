import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import Map from "../../../components/Map";
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import app from '../../../firebase/firebase.config';

const Order = () => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem("access_token");
  const { refetch, data: orders = [] } = useQuery({
    queryKey: ["orders", user?.email],
    enabled: !loading,
    queryFn: async () => {
      const res = await fetch(
        `https://calabunica-server.onrender.com/payments?email=${user?.email}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return res.json();
    },
  });

  // State to track the index of the currently visible map
  const [visibleMapIndex, setVisibleMapIndex] = useState(null);
  const [courierLocation, setCourierLocation] = useState(null);
  const db = getFirestore(app);

  useEffect(() => {
    const locationDoc = doc(db, 'locations', 'alinanton294@gmail.com'); // Use your specific document ID
    const unsubscribe = onSnapshot(locationDoc, (doc) => {
      if (doc.exists()) {
        setCourierLocation(doc.data().location); // Adjusted to access location field
        console.log("Courier location data:", doc.data().location);
      } else {
        console.log("No such document!");
      }
    }, (error) => {
      console.error("Error fetching location data:", error);
    });

    return () => {
      unsubscribe();
    };
  }, [db]);

  // date format
  const formatDate = (createdAt) => {
    const createdAtDate = new Date(createdAt);
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };
    return createdAtDate.toLocaleDateString('en-GB', options);
  };

  // Function to toggle visibility for a specific row
  const toggleMapVisibility = (index) => {
    if (visibleMapIndex === index) {
      setVisibleMapIndex(null); // Close the map if the same button is clicked again
    } else {
      setVisibleMapIndex(index); // Open the map for the clicked button
    }
  };

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      {/* banner */}
      <div className=" bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
        <div className="py-28 flex flex-col items-center justify-center">
          {/* content */}
          <div className=" text-center px-4 space-y-7">
            <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
              Urmăriți-vă toate<span className="text-orange"> Comenzile</span>
            </h2>
          </div>
        </div>
      </div>

      {/* table content */}
      <div>
        <div>
          <div>
            <div className="overflow-x-auto">
              <table className="table text-center">
                {/* head */}
                <thead className="bg-orange text-white rounded-sm">
                  <tr>
                    <th>#</th>
                    <th>Data Comenzii</th>
                    <th>Adresa</th>
                    <th>Preț</th>
                    <th>Status</th>
                    <th>Urmărire Comandă</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((item, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td>{index + 1}</td>
                        <td>{formatDate(item.createdAt)}</td>
                        <td className="font-medium">{item.address}</td>
                        <td>{item.price} Lei</td>
                        <td>{item.status}</td>
                        <td>
                          {item.status === "În Curs De Livrare" && (
                            <button
                              className="btn btn-sm border-none text-orange-400 bg-transparent"
                              onClick={() => toggleMapVisibility(index)} // Toggle visibility for the corresponding row
                            >
                              Hartă
                            </button>
                          )}
                        </td>
                      </tr>
                      {visibleMapIndex === index && (
                        <tr>
                          <td colSpan="6" className="p-0">
                            {/* Render map component for the order */}
                            {courierLocation ? (
                              <Map
                                userLatLong={item.latlong}
                                courierLatLong={`${courierLocation.latitude},${courierLocation.longitude}`}
                              />
                            ) : (
                              <p>Loading courier location...</p>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
                {/* foot */}
              </table>
            </div>
          </div>
          <hr />
        </div>
      </div>
    </div>
  );
};

export default Order;
