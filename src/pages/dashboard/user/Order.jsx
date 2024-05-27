import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";
import Map from "../../../components/Map"; // Assuming you have a Map component

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

  // State to track the visibility of additional content for each row
  const [showAdditionalContent, setShowAdditionalContent] = useState(
    Array(orders.length).fill(false)
  );

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
  const toggleAdditionalContent = (index) => {
    const updatedVisibility = [...showAdditionalContent];
    updatedVisibility[index] = !updatedVisibility[index];
    setShowAdditionalContent(updatedVisibility);
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
                          {item.status !== "confirmed" ? (
                            <button
                              className="btn btn-sm border-none text-orange-400 bg-transparent"
                              onClick={() => toggleAdditionalContent(index)} // Toggle visibility for the corresponding row
                            >
                              Hartă
                            </button>
                          ) : (
                            <svg
                              fill="#ff7f66"
                              className="w-6 h-6 ml-12"
                              viewBox="0 0 32 32"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g id="Group_30" data-name="Group 30" transform="translate(-310.001 -321.695)">
                                <path id="Path_364" data-name="Path 364" d="M326,321.7a16,16,0,1,0,16,16A16,16,0,0,0,326,321.7Zm0,28a12,12,0,1,1,12-12A12,12,0,0,1,326,349.7Z" />
                                <rect id="Rectangle_41" data-name="Rectangle 41" width="28.969" height="4" transform="translate(314.348 346.523) rotate(-45.001)" />
                              </g>
                            </svg>
                          )}
                        </td>
                      </tr>
                      {showAdditionalContent[index] && (
                        <tr>
                          <td colSpan="6" className="p-0">
                            {/* Render map component for the order */}
                            <Map latlong={item.latlong} />
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
