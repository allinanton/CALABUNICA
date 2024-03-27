import React, { useContext} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";
import Swal from 'sweetalert2'
import useCart from "../hooks/useCart";
import axios from 'axios';

const Cards = ({ item }) => {
  const { name, image, price, recipe, _id } = item;

  const {user} = useContext(AuthContext);
  const [cart, refetch] = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  // console.log(item)

  // add to cart handler
  const handleAddToCart = item => {
    // console.log(item);
    if(user && user.email){
        const cartItem = {menuItemId: _id, name, quantity : 1, image, price, email: user.email}

        axios.post('http://localhost:5000/carts', cartItem)
        .then((response) => {
          console.log(response);
          if(response){
            refetch(); // refetch cart
              Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Food added on the cart.',
                  showConfirmButton: false,
                  timer: 1500
                })
          }
        })
        .catch( (error) => {
          console.log(error.response.data.message);
          const errorMessage = error.response.data.message;
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: `${errorMessage}`,
            showConfirmButton: false,
            timer: 1500
          })
        });
    }
    else{
        Swal.fire({
            title: 'Please login to order the food',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Login now!'
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/login', {state: {from: location}})
            }
          })
    }
}

  return (
    <div to={`/menu/${item._id}`} className="card shadow-xl relative mr-5 md:my-5">
      <Link to={`/menu/${item._id}`}>
        <figure>
          <img src={item.image}  className="hover:scale-105 transition-all duration-300 md:h-72" />
        </figure>
      </Link>
      <div className="card-body">
       <Link to={`/menu/${item._id}`}><h2 className="card-title">{item.name}!</h2></Link>
       <Link to={`/menu/${item._id}`}><p>{item.recipe}</p></Link>
        <div className="card-actions justify-between items-center mt-2">
          <h5 className="font-semibold">
            {item.price}  <span className="text-sm text-red">Lei </span>
          </h5>
          <button onClick={() => handleAddToCart(item)} className="btn bg-orange text-white">Adaugă în Coș </button>
        </div>
      </div>
    </div>
  );
};

export default Cards;
