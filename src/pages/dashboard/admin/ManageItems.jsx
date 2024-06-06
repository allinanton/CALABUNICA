import React, { useState } from "react";
import useMenu from "../../../hooks/useMenu";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import {FaArrowLeft, FaArrowRight, FaEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";

const ManageItems = () => {
  const [menu, , refetch] = useMenu();
  //   console.log(menu)
  const axiosSecure = useAxiosSecure();

  //   pagination
  const [currentPage, setCurrentPage] = useState(1);
  const items_Per_Page = 10;
  const indexOfLastItem = currentPage * items_Per_Page;
  const indexOfFirstItem = indexOfLastItem - items_Per_Page;
  const currentItems = menu.slice(indexOfFirstItem, indexOfLastItem);

  // delete item
  const handleDeleteItem = (item) => {
    console.log(item._id)
    Swal.fire({
      title: "Ești sigur că vrei sa ștergi produsul?",
      text: "Nu vei putea recupera produsul șters!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Da, șterge",
      cancelButtonText: "Anulează"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosSecure.delete(`/menu/${item._id}`);
        // console.log(res.data);
        refetch();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${item.name} a fost șters`,
          showConfirmButton: false,
          timer: 1500
        });

      }
    });
  }

  return (
    <div className="w-full md:w-[870px] mx-auto px-4 ">
      <h2 className="text-2xl font-semibold my-4">
        Toate <span className="text-orange">Produsele!</span>
      </h2>

      {/* menu items table  */}
      <div>
        <div className="overflow-x-auto">
          <table className="table w-full">
            {/* head */}
            <thead>
              <tr>
                <th>#</th>
                <th>Imagine</th>
                <th>Nume Produs</th>
                <th>Preț</th>
                <th>Modifică</th>
                <th>Șterge</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img
                            src={item.image}
                            alt="Avatar Tailwind CSS Component"
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{item.name}</td>
                  <td>{item.price}Lei</td>
                  <td>
                    <Link to={`/dashboard/update-menu/${item._id}`}>
                      <button className="btn btn-ghost btn-xs ">
                        <FaEdit
                          className="text-orange 
                                        "
                        ></FaEdit>
                      </button>
                    </Link>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteItem(item)}
                      className="btn btn-ghost btn-xs"
                    >
                      <FaTrashAlt className="text-red"></FaTrashAlt>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center my-4">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn btn-sm mr-2 btn-warning"
        >
          <FaArrowLeft /> Înainte
        </button>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={indexOfLastItem >= menu.length}
          className="btn btn-sm bg-orange text-white"
        >
          Înapoi  <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default ManageItems;
