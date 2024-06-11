import React, { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaArrowLeft, FaArrowRight, FaTrashAlt, FaCheckCircle } from "react-icons/fa";
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
        `https://calabunica-server.onrender.com/payments/all`,
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
  };

  const deleteOrder = async (item) => {
    Swal.fire({
      title: "Ești sigur?",
      text: "Nu vei putea recupera această comandă!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Da, șterge!",
      cancelButtonText: "Anulează",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/payments/${item._id}`)
          .then(res => {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Comanda a fost ștearsă!",
              showConfirmButton: false,
              timer: 1500
            });
            refetch();
          })
          .catch(error => {
            console.error('Eroare la ștergerea comenzii:', error);
          });
      }
    });
  };

  return (
    <div className="w-full md:w-[870px] mx-auto px-4">
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
                <th>Număr de Telefon</th>
                <th>Preț</th>
                <th>Status</th>
                <th>Acțiuni</th>
                <th>Ștergere</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.email}</td>
                  <td>{item.address}</td>
                  <td>{item.phoneNumber}</td> {/* Afișează numărul de telefon */}
                  <td>{item.price} Lei</td>
                  <td>{item.status}</td>
                  <td className="text-center">
                    {item.status === "Finalizată" ? (
                      <FaCheckCircle
                        style={{
                          color: "green",
                          fontSize: "24px",
                          display: "inline-flex",
                          alignItems: "center"
                        }}
                      />
                    ) : (
                      <button
                        className="btn bg-orange text-white btn-xs text-center"
                        onClick={() => confiremedOrder(item)}
                      >
                        {item.status === "În Pregătire" ? "Următorul Pas" : "Finalizare"}
                      </button>
                    )}
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-danger text-red btn-xs"
                      onClick={() => deleteOrder(item)}
                    >
                      <FaTrashAlt />
                    </button>
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
          Înainte <FaArrowRight />
        </button>
      </div>
    </div>
  );
}

export default ManageBookings;
