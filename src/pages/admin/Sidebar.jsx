import React from "react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = ["bookings", "tours", "users"];
  return (
    <div className="w-64 bg-white shadow-md flex flex-col">
      <h2 className="text-xl font-bold p-6 border-b">Admin Panel</h2>
      <nav className="flex-1 p-4 space-y-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`block w-full text-left px-4 py-2 rounded ${
              activeTab === tab ? "bg-blue-500 text-white" : "hover:bg-gray-200"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
