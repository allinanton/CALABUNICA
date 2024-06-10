import React, { useContext, useEffect, useState } from "react";
import useCart from "../../hooks/useCart";
import { AuthContext } from "../../contexts/AuthProvider";
import Swal from "sweetalert2";
import { FaTrash } from "react-icons/fa";
import { Link } from 'react-router-dom';
import useAxiosSecure from "../../hooks/useAxiosSecure";
import LoadingSpinner from "../../components/LoadingSpinner";

const CartPage = () => {
  const { user } = useContext(AuthContext);
  const [cart, refetch, isLoading] = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [userData, setUserData] = useState({});
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const getUserByEmail = async () => {
      if (user && user.email) {
        try {
          const response = await axiosSecure.get(`/users/${user.email}`);
          setUserData(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    getUserByEmail();
  }, [user, axiosSecure]);

  const calculateTotalPrice = (item) => {
    return item.price * item.quantity;
  };

  const handleIncrease = async (item) => {
    try {
      const response = await axiosSecure.put(`/carts/${item._id}`, { quantity: item.quantity + 1 });

      if (response.status === 200) {
        const updatedCart = cartItems.map((cartItem) => {
          if (cartItem.id === item.id) {
            return {
              ...cartItem,
              quantity: cartItem.quantity + 1,
            };
          }
          return cartItem;
        });
        await refetch();
        setCartItems(updatedCart);
      } else {
        console.error("Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleDecrease = async (item) => {
    if (item.quantity > 1) {
      try {
        const response = await axiosSecure.put(`/carts/${item._id}`, { quantity: item.quantity - 1 });

        if (response.status === 200) {
          const updatedCart = cartItems.map((cartItem) => {
            if (cartItem.id === item.id) {
              return {
                ...cartItem,
                quantity: cartItem.quantity - 1,
              };
            }
            return cartItem;
          });
          await refetch();
          setCartItems(updatedCart);
        } else {
          console.error("Failed to update quantity");
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    }
  };

  const handleDelete = (item) => {
    Swal.fire({
      title: "Sunteți sigur?",
      text: "Produsul va fi eliminat din coș",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Da, elimină!",
      cancelButtonText: "Anulează",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/carts/${item._id}`)
          .then(response => {
            if (response.status === 200) {
              refetch();
              Swal.fire("Eliminat!", "Produsul a fost eliminat din coș.", "success");
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const totalQuantity = Array.isArray(cart) ? cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0) : 0;

  const cartSubtotal = Array.isArray(cart) ? cart.reduce((total, item) => {
    return total + calculateTotalPrice(item);
  }, 0) : 0;

  const orderTotal = cartSubtotal;

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <div className={`bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%`}>
        <div className="py-28 flex flex-col items-center justify-center">
          <div className=" text-center px-4 space-y-7">
            <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
              Produse Adăugate în<span className="text-orange"> Coșul de Cumpărături</span>
            </h2>
          </div>
        </div>
      </div>

      {Array.isArray(cart) && cart.length > 0 ? (
        <div>
          <div>
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="bg-orange text-white rounded-sm">
                  <tr>
                    <th>#</th>
                    <th>Imagine</th>
                    <th>Numele produsului</th>
                    <th>Cantitate</th>
                    <th>Preț</th>
                    <th>Eliminare</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img
                              src={item.image}
                              alt="Avatar Tailwind CSS Component"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="font-medium font-size">{item.name}</td>
                      <td className="flex">
                        <button
                          className="btn btn-xs"
                          onClick={() => handleDecrease(item)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={() => console.log(item.quantity)}
                          className={`w-10 mx-2 text-center overflow-hidden appearance-none `}
                        />
                        <button
                          className="btn btn-xs"
                          onClick={() => handleIncrease(item)}
                        >
                          +
                        </button>
                      </td>
                      <td>{calculateTotalPrice(item).toFixed(2)} Lei</td>
                      <td>
                        <button
                          className="btn btn-sm border-none text-red bg-transparent"
                          onClick={() => handleDelete(item)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <hr />
          <div className="flex flex-col md:flex-row justify-between items-start my-12 gap-8">
            <div className="md:w-1/2 space-y-3">
              <h3 className="text-lg font-semibold">Detalii</h3>
              <p>Nume: {user?.displayName || "User"}</p>
              <p>Email: {user?.email}</p>
              <p>Număr de telefon: {userData?.phoneNumber || "Număr lipsă"}</p> {/* Afișează numărul de telefon */}
            </div>
            <div className="md:w-1/2 space-y-3">
              <h3 className="text-lg font-semibold">Detalii Coș</h3>
              <p>Număr Total Produse: {totalQuantity}</p>
              <p>
                Preț Total:{" "}
                <span id="total-price">{orderTotal.toFixed(2)} Lei</span>
              </p>
              <Link to="/process-checkout" className="btn btn-md bg-orange text-white px-8 py-1">
                Continuă către finalizarea comenzii
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-20">
          <p>Coșul este gol. Te rog adaugă produse.</p>
          <Link to="/menu"><button className="btn bg-orange text-white mt-3">Înapoi la Meniu</button></Link>
        </div>
      )}
    </div>
  );
};

export default CartPage;
