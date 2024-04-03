import React, { useState, useEffect } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ price, cart }) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [locationString, setLocationString] = useState(null);

  const totalQuantity = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  useEffect(() => {
    // Get device location when component mounts
    getLocation();
  }, []);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Set location to latitude and longitude
          setLocation({ latitude, longitude });
          // Fetch address from latitude and longitude
          getAddressFromLatLng(latitude, longitude);
          // Combine latitude and longitude into a single string separated by comma
          setLocationString(`${latitude},${longitude}`);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
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
    // Check if location and address are available
    if (!location || !address) {
      console.error("Location or address not available.");
      return;
    }

    // Save order info to server
    const orderInfo = {
      email: user.email,
      price,
      quantity: cart.length,
      status: "order pending",
      itemsName: cart.map((item) => item.name),
      cartItems: cart.map((item) => item._id),
      menuItems: cart.map((item) => item.menuItemId),
      // Send both the human-readable address and the combined latitude and longitude string to the server
      address: address,
      latlong: locationString,
    };

    // Send order info
    axiosSecure
      .post("/payments", orderInfo)
      .then((res) => {
        if (res.data) {
          alert("Order submitted successfully!");
          navigate("/order");
        }
      })
      .catch((error) => {
        console.error("Error submitting order:", error);
        // Handle error if needed
      });
  };

  // Conditional rendering based on cart items
  if (cart.length === 0) {
    return <div>No items in the cart.</div>;
  }

  return (
    <div className="flex flex-col sm:flex-row justify-start items-start gap-20">
      <div className="md:w-1/2 space-y-3">
        <h4 className="text-lg font-semibold">Finalizare Comandă</h4>
        <p>Total Comandă: {price} Lei</p>
        <p>Număr produse: {totalQuantity}</p>
      </div>
      <div className={`md:w-1/3 w-full border space-y-5  card shrink-0 max-w-sm shadow-2xl bg-base-100 px-4 py-8  `}>
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
  );
};

export default CheckoutForm;
