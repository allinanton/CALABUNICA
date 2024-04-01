import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import { FaBook, FaUsers } from "react-icons/fa";

const Dashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: stats = {} } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-stats");
      return res.data;
    },
  });

  return (
    <div className="w-full md:w-[1080px] mx-auto px-4 ">
      <h2 className="text-3xl font-semibold my-4">
        Salut, {user.displayName}
      </h2>
      {/* stats */}
      <div className="stats shadow flex flex-col md:flex-row">


        <div className="stat bg-[#ff7f66]">
          <div className="stat-figure text-secondary">
            <FaUsers className="text-3xl"></FaUsers>
          </div>
          <div className="stat-title">Utilizatori</div>
          <div className="stat-value">{stats.users}</div>
        </div>

        <div className="stat bg-indigo-400">
          <div className="stat-figure text-secondary">
            <FaBook className="text-3xl"></FaBook>
          </div>
          <div className="stat-title">Produse</div>
          <div className="stat-value">{stats.menuItems}</div>
        </div>

        <div className="stat bg-purple-300">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Comenzi</div>
          <div className="stat-value">{stats.orders}</div>
        </div>
      </div>
      
    </div>
  );
};

export default Dashboard;
