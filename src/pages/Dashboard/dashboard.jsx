import React from "react";
import "./dashboard.css";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  BsFillArchiveFill,
  BsPeopleFill,
  BsFillBellFill,
  BsListCheck,
} from "react-icons/bs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import SideBarPage from "../../components/Sidebar/SideBarPage";

function Home() {
  const navigate = useNavigate();

  const InfoData = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];
  return (
    <SideBarPage>
      <main>
        {" "}
        <div>
          <div className="main-title">
            <h3>DASHBOARD - BEM VINDO </h3>
          </div>

          <div className="main-cards">
            <div className="card">
              <div className="card-inner">
                <h3>ITENS DE ESTOQUE</h3>
                <BsFillArchiveFill className="card_icon" />
              </div>
              <h1>1</h1>
            </div>
            <div className="card">
              <div className="card-inner">
                <h3>PEDIDOS</h3>
                <BsListCheck className="card_icon" />
              </div>
              <h1>1</h1>
            </div>
            <div className="card">
              <div className="card-inner">
                <h3>FUNCIONÁRIOS</h3>
                <BsPeopleFill className="card_icon" />
              </div>
              <h1>1</h1>
            </div>
            <div className="card">
              <div className="card-inner">
                <h3>ALTERAÇÕES</h3>
                <BsFillBellFill className="card_icon" />
              </div>
              <h1>1</h1>
            </div>
          </div>

          <div className="charts">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={InfoData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <Tooltip />
                <Legend />
                <Bar dataKey="pv" fill="#8884d8" />
                <Bar dataKey="uv" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={500}
                height={300}
                data={InfoData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="pv"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </SideBarPage>
  );
}

export default Home;
