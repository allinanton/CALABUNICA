import { useQuery } from "@tanstack/react-query";
import axios from "axios";
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
    })

    const handleMakeAdmin = user =>{
      axiosSecure.patch(`/users/admin/${user._id}`)
      .then(res =>{
          console.log(res.data)
          Swal.fire({
              position: "top-end",
              icon: "success",
              title: `${user.name} is an Admin Now!`,
              showConfirmButton: false,
              timer: 1500
            });
            refetch();
      })
  };

  const handleDeleteUser = user => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {

            axiosSecure.delete(`/users/${user._id}`)
                .then(res => {
                  console.log(res)
                  Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
                })
                refetch();
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
                  <td>
                    {user.role === "admin" ? (
                      "Admin"
                    ) : (
                      <button
                        onClick={() => handleMakeAdmin(user)}
                        className="btn btn-xs btn-circle bg-indigo-500"
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
                      <FaTrashAlt className="text-orange" />
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
