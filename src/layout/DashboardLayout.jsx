import React from "react";
import logo from "/logo.png";
import { Link, Outlet } from "react-router-dom";
import { MdDashboard, MdOutlineDashboardCustomize } from "react-icons/md";
import {
  FaEdit,
  FaHome,
  FaPlusCircle,
  FaRegUser,
  FaShoppingBag,
  FaUsers,
} from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import useAdmin from "../hooks/useAdmin";
import Login from "../components/Login";
import useAuth from "../hooks/useAuth";

const sharedMenu = (
  <>
    <li className="mt-3">
      <Link to="/">
        <FaHome />
        Acasă
      </Link>
    </li>
    <li>
      <Link to="/menu">
        <FaCartShopping />
        Meniu
      </Link>
    </li>
  </>
);

const DashboardLayout = () => {
  const { loading } = useAuth();
  const [isAdmin, isAdminLoading] = useAdmin();

  return (
    <div>
      {isAdminLoading || isAdmin ? (
        <div className="drawer sm:drawer-open">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col sm:items-start sm:justify-start my-2">
            <div className="flex items-center justify-between mx-4">
              <label
                htmlFor="my-drawer-2"
                className="btn btn-primary drawer-button sm:hidden"
              >
                <MdOutlineDashboardCustomize />
              </label>

              <button className="btn flex items-center gap-2 rounded-full px-6 bg-orange text-white sm:hidden">
                <FaRegUser /> Logout
              </button>
            </div>
            <div className="mt-5 md:mt-2 mx-4">
              <Outlet />
            </div>
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
              <li>
                <Link to="/dashboard" className="flex justify-start mb-3">
                  <img src={logo} alt="" className="w-20 rounded-full" />
                  <span className="indicator-item badge badge-primary">
                    administrator
                  </span>
                </Link>
              </li>
              <hr />

              <li className="mt-3">
                <Link to="/dashboard">
                  <MdDashboard /> Tablou Principal
                </Link>
              </li>
              <li>
                <Link to="/dashboard/bookings">
                  <FaShoppingBag /> Vizualizare Comenzi
                </Link>
              </li>
              <li>
                <Link to="/dashboard/add-menu">
                  <FaPlusCircle /> Adaugă Produs
                </Link>
              </li>
              <li>
                <Link to="/dashboard/manage-items">
                  <FaEdit /> Produse
                </Link>
              </li>
              <li className="mb-3">
                <Link to="/dashboard/users">
                  <FaUsers />
                  Utilizatori
                </Link>
              </li>
              <hr />
              {sharedMenu}
            </ul>
          </div>
        </div>
      ) : (loading ? <Login /> : (
        <div className="h-screen flex items-center justify-center">
          <Link to="/">Back to Home</Link>
        </div>
      ))}
    </div>
  );
};

export default DashboardLayout;
