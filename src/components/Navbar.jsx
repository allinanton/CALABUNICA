import React, { useContext, useEffect, useState } from "react";
import logo from "/logo.png";
import { FaRegUser } from "react-icons/fa";
import Modal from "./Modal";
import { AuthContext } from "../contexts/AuthProvider";
import Profile from "./Profile";
import { Link } from "react-router-dom";
import useCart from "../hooks/useCart";

const Navbar = () => {
  const [isSticky, setSticky] = useState(false);
  const { user } = useContext(AuthContext);
  const [cart] = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 0) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = (
    <>
      <li>
        <a href="/" className={`text-2xl`}>
          Acasa
        </a>
      </li>
      <li>
        <a href="/menu" className={`text-2xl`}>
          Meniu
        </a>
      </li>
      <li tabIndex={0}>
        <details>
          <summary className={`text-2xl`}>Servicii</summary>
          <ul className={`p-2`}>
            <li>
              <a className={`text`}>Mâncare la Oală</a>
            </li>
            <li>
              <a className={`text`}>Organizare Evenimente</a>
            </li>
            <li>
              <a className={`text`}>Catering Evenimente</a>
            </li>
          </ul>
        </details>
      </li>
    </>
  );
  return (
    <header
      className={`bg-gradient-to-r from-orange from-10% max-w-screen-2xl container mx-auto fixed top-0 left-0 right-0 transition-all duration-1000 ease-in-out rounded-lg`}
    >
      <div
        className={`navbar xl:px-24 ${isSticky ? "shadow-md bg-orange-400 transition-all duration-1000 ease-in-out text-black rounded-lg"
          : "bg-gradient-to-r from-orange-400 to-orange-100 via-orange-400 transition-all duration-1000 ease-in-out rounded-lg"}`}
      >
        <div className="navbar-start">
          <div className="dropdown justify-between">
            <label onClick={toggleMenu} tabIndex={0} className="btn btn-ghost lg:hidden" >
            </label>
            <ul
              tabIndex={0}
              className={`menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-64 space-y-3  `}
              style={{ display: isMenuOpen ? "block" : "none" }}
            >
              {navItems}
            </ul>
          </div>
          <a href="/">
            <img src={logo} alt="" className="w-24 h-24 rounded-full" />
          </a>

        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navItems}</ul>
        </div>
        <div className="navbar-end ">


          {/* Render shopping cart button if user is logged in */}
          {user && (
            <Link to="/cart-page">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-circle  lg:flex items-center justify-center mr-3"
              >
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="badge badge-sm indicator-item">{cart.length || 0}</span>
                </div>
              </label>
            </Link>
          )}

          {/* Render login button if user is not logged in */}
          {!user && (
            <button onClick={() => document.getElementById('my_modal_5').showModal()} className="btn flex items-center gap-2 rounded-full px-6 bg-orange text-white">
              <FaRegUser /> Login
            </button>
          )}

          {/* Render profile if user is logged in */}
          {user && <Profile user={user} />}

          <Modal />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
