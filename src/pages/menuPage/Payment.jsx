import React, { useState, useEffect } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Payment = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [locationString, setLocationString] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(""); // State pentru numărul de telefon
  const [locationError, setLocationError] = useState(false); // State pentru eroare de locație
  const [cart] = useCart();

  const totalQuantity = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  // Calculate the cart price
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  const totalPrice = parseFloat(cartTotal.toFixed(2));

  useEffect(() => {
    getLocation();
    fetchPhoneNumber(); // Preia numărul de telefon din MongoDB
  }, []);

  const fetchPhoneNumber = async () => {
    try {
      const response = await axiosSecure.get(`/users/${user.email}`);
      if (response.data) {
        setPhoneNumber(response.data.phoneNumber);
      }
    } catch (error) {
      console.error("Error fetching phone number:", error);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          getAddressFromLatLng(latitude, longitude);
          setLocationString(`${latitude},${longitude}`);
          setLocationError(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          if (error.code === error.PERMISSION_DENIED) {
            Swal.fire({
              icon: 'error',
              title: 'Permisiune locație refuzată',
              text: 'Permisiunea pentru locație a fost refuzată. Vă rugăm să permiteți accesul la locație în setările browserului pentru a continua.',
              showCancelButton: true,
              confirmButtonText: 'Reîncercați locația',
              cancelButtonText: 'Închide'
            });
          } else {
            setLocationError(true);
          }
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLocationError(true);
    }
  };

  const getAddressFromLatLng = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=0`
      );
      const data = await response.json();
      if (data.display_name) {
        setAddress(data.display_name);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const handleSubmitOrder = async () => {
    if (!phoneNumber) {
      Swal.fire({
        icon: 'error',
        title: 'Lipsă informații',
        text: 'Numărul de telefon lipsește. Vă rugăm să-l completați pentru a continua',
        showCancelButton: true,
        confirmButtonText: 'Mergi la profil',
        cancelButtonText: 'Închide',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/update-profile'); // Redirecționează către pagina de profil
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          getLocation(); // Reîncearcă obținerea locației
        }
      });
      return;
    }
    const orderInfo = {
      email: user.email,
      price: totalPrice,
      quantity: cart.length,
      status: "În Pregătire",
      itemsName: cart.map((item) => item.name),
      cartItems: cart.map((item) => item._id),
      menuItems: cart.map((item) => item.menuItemId),
      address: address,
      latlong: locationString,
      phoneNumber: phoneNumber // Include numărul de telefon
    };

    axiosSecure
      .post("/payments", orderInfo)
      .then((res) => {
        if (res.data) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: `Comanda a fost plasată cu success`,
            text: `Veți fi redirecționat la lista de comenzi`,
            showConfirmButton: false,
            timer: 1500
          });
          navigate("/order");
        }
      })
      .catch((error) => {
        console.error("Eroare la plasarea comenzii:", error);
      });
  };

  if (cart.length === 0) {
    return <div>No items in the cart.</div>;
  }

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-28">
      <div className="flex flex-col sm:flex-row justify-start items-start gap-20">
        <div className="md:w-1/2 space-y-3">
          <h4 className="text-lg font-semibold">Finalizare Comandă</h4>
          <p>Total Comandă: {totalPrice} Lei</p>
          <p>Număr produse: {totalQuantity}</p>
        </div>
        <div className={`md:w-1/3 w-full border space-y-5 card shrink-0 max-w-sm shadow-2xl bg-base-100 px-4 py-8`}>
          <h4 className="text-lg font-semibold">Adresa de Livrare</h4>
          {address ? (
            <p>Adresa: {address}</p>
          ) : (
            <p>Preluare Locație...</p>
          )}
          <button
            onClick={handleSubmitOrder}
            className="btn btn-primary btn-sm mt-5 w-full"
          >
            Comandă
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
