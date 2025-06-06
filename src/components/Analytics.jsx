import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const Analytics = () => {
  const [data, setData] = useState({
    userStats: [],
    registrationStats: [],
    genderStats: [],
    approvalStats: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return;
      }

      try {
        const response = await fetch(
          "https://backend-nm1z.onrender.com/api/admin/auth/users",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const users = await response.json();
        processUserData(users);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const processUserData = (users) => {
    const statusCounts = users.reduce((acc, user) => {
      const status = user.status || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const genderCounts = users.reduce((acc, user) => {
      const gender = user.gender || "Unknown";
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});

    const approvalCounts = users.reduce((acc, user) => {
      const approval = user.isApproved ? "Approved" : "Not Approved";
      acc[approval] = (acc[approval] || 0) + 1;
      return acc;
    }, {});

    const monthlyRegistrations = Array(12)
      .fill(0)
      .map((_, index) => ({
        name: new Date(0, index + 1, 0).toLocaleString("default", {
          month: "short",
        }),
        registrations: 0,
      }));

    users.forEach((user) => {
      const date = new Date(user.metadata.register_date);
      const month = date.getMonth();
      if (!isNaN(month)) {
        monthlyRegistrations[month].registrations++;
      }
    });

    setData({
      userStats: Object.entries(statusCounts).map(([name, value]) => ({
        name,
        value,
      })),
      registrationStats: monthlyRegistrations,
      genderStats: Object.entries(genderCounts).map(([name, value]) => ({
        name,
        value,
      })),
      approvalStats: Object.entries(approvalCounts).map(([name, value]) => ({
        name,
        value,
      })),
    });
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-blue-800 mb-4">Site Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* User Activity Pie Chart */}
        <div className="p-4 bg-gray-50 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">User Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="value"
                data={data.userStats}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {data.userStats.map((entry, index) => (
                  <Cell
                    key={`cell-status-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Registrations Bar Chart */}
        <div className="p-4 bg-gray-50 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">
            Monthly Registrations
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.registrationStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="registrations" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Distribution Pie Chart */}
        <div className="p-4 bg-gray-50 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">
            Gender Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="value"
                data={data.genderStats}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {data.genderStats.map((entry, index) => (
                  <Cell
                    key={`cell-gender-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Approval Status Pie Chart */}
        <div className="p-4 bg-gray-50 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">
            Approval Status
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="value"
                data={data.approvalStats}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {data.approvalStats.map((entry, index) => (
                  <Cell
                    key={`cell-approval-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
