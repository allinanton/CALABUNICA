import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FaTrashAlt, FaUsers } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Users = () => {
  const axiosSecure = useAxiosSecure();
  const { data: users = [], refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    }
  });

  const handleMakeAdmin = user => {
    axiosSecure.patch(`/users/admin/${user._id}`)
      .then(res => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${user.name} este Admin acum!`,
          showConfirmButton: false,
          timer: 1500
        });
        refetch();
      });
  };

  const handleDeleteUser = user => {
    Swal.fire({
      title: "Ești sigur?",
      text: "Nu vei putea recupera utilizatorul!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Da, șterge!",
      cancelButtonText: "Anulează!"
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/users/${user._id}`)
          .then(res => {
            Swal.fire({
              title: "Utilizator șters!",
              text: "Acest utilizator nu mai există în baza de date",
              icon: "success"
            });
            refetch();
          });
      }
    });
  }

  return (
    <div>
      <div className="flex justify-center mx-4 my-4">
        <h2 className="text-2xl">Număr de Utilizatori: {users.length}</h2>
      </div>

      {/* table */}
      <div>
        <div className="overflow-x-auto">
          <table className="table table-zebra md:w-[870px]">
            {/* head */}
            <thead className="bg-orange text-white">
              <tr>
                <th>#</th>
                <th>Nume</th>
                <th>Email</th>
                <th>Telefon</th>
                <th>Rol</th>
                <th>Șterge</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <th>{index + 1}</th>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td> {/* Display phone number */}
                  <td>
                    {user.role === "admin" ? (
                      "Admin"
                    ) : (
                      <button
                        onClick={() => handleMakeAdmin(user)}
                        className="btn btn-xs btn-circle bg-black"
                      >
                        <FaUsers className="text-white"></FaUsers>
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="btn bg-orange-500 btn-xs"
                    >
                      <FaTrashAlt className="text-red" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
