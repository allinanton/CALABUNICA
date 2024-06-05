import React, { useState } from "react";
import useMenu from "../../../hooks/useMenu";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaTrashAlt, FaCheckCircle } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

const ManageBookings = () => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem("access_token");
  const { refetch, data: orders = [] } = useQuery({
    queryKey: ["orders", user?.email],
    enabled: !loading,
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:5000/payments/all`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      return res.json();
    },
  });

  const axiosSecure = useAxiosSecure();
  const [currentPage, setCurrentPage] = useState(1);
  const items_Per_Page = 10;
  const indexOfLastItem = currentPage * items_Per_Page;
  const indexOfFirstItem = indexOfLastItem - items_Per_Page;
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);

  const confiremedOrder = async (item) => {
    console.log(item);

    let newStatus;
    switch (item.status) {
      case "În Pregătire":
        newStatus = "În Curs De Livrare";
        break;
      case "În Curs De Livrare":
        newStatus = "Finalizată";
        break;
      default:
        newStatus = "În Pregătire";
    }

    await axiosSecure.patch(`/payments/${item._id}`, { status: newStatus })
      .then(res => {
        console.log(res.data);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Statusul comenzii este acum: ${newStatus}!`,
          showConfirmButton: false,
          timer: 1500
        });
        refetch();
      })
      .catch(error => {
        console.error('Eroare la schimbarea statusului:', error);
      });
  }

  return (
    <div className="w-full md:w-[870px] mx-auto px-4 ">
      <h2 className="text-2xl font-semibold my-4">
        Gestionare <span className="text-orange">Comenzi</span>
      </h2>

      <div>
        <div className="overflow-x-auto lg:overflow-x-visible">
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Utilizator</th>
                <th>Adresa</th>
                <th>Preț</th>
                <th>Status</th>
                
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.email}</td>
                  <td>{item.address}</td>
                  <td>{item.price} Lei</td>
                  <td>{item.status}</td>
                  <td className="text-center">
                    {item.status === "Finalizată" ? (
                    <FaCheckCircle style={{ color: "green", fontSize: "24px", display: "inline-flex", alignItems: "center" }} /> 
                    ) : (
                      <button
                        className="btn bg-orange text-white btn-xs text-center"
                        onClick={() => confiremedOrder(item)}
                      >
                        {item.status === "În Pregătire" ? "Următorul Pas" : "Finalizare"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center my-4">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn btn-sm mr-2 btn-warning"
        >
          <FaArrowLeft /> Înapoi
        </button>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={indexOfLastItem >= orders.length}
          className="btn btn-sm bg-orange text-white"
        >
          Înainte  <FaArrowRight />
        </button>
      </div>
    </div>
  )
}

export default ManageBookings;
