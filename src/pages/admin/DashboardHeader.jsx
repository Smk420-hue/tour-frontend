import React from "react";

const DashboardHeader = ({ user }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="text-right">
        <p className="font-medium">{user.name}</p>
        <p className="text-sm text-gray-500">{user.role.toUpperCase()}</p>
      </div>
    </div>
  );
};

export default DashboardHeader;
