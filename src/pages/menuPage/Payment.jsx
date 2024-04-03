import React from "react";
import CheckoutForm from "./CheckoutForm";
import useCart from "../../hooks/useCart";

const Payment = () => {
  const [cart] = useCart();

  // Calculate the cart price
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  const totalPrice = parseFloat(cartTotal.toFixed(2));

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-28">
      <CheckoutForm price={totalPrice} cart={cart} />
    </div>
  );
};

export default Payment;
