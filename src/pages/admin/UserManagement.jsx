import { useState } from "react";
import { useUsers } from "../../hooks/useUsers";
import LoadingSpinner from "../common/LoadingSpinner";
import EditUserModal from "./EditUserModal";
import CreateEmployeeModal from "./CreateEmployeeModal";

const UserManagement = () => {
  const { users, deleteUser, fetchUsers } = useUsers();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("employees"); // "employees" or "customers"

  if (!users) return <LoadingSpinner />;

  const handleEmployeeCreated = (newEmployee) => {
    fetchUsers(); // refresh list
  };

  // Filter users based on active tab
  const filteredUsers = users.filter(user => 
    activeTab === "employees" ? user.role === "employee" : user.role === "customer"
  );

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-4 mb-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("employees")}
          className={`px-4 py-2 ${activeTab === "employees" ? "border-b-2 border-blue-600 font-bold" : ""}`}
        >
          Employees
        </button>
        <button
          onClick={() => setActiveTab("customers")}
          className={`px-4 py-2 ${activeTab === "customers" ? "border-b-2 border-blue-600 font-bold" : ""}`}
        >
          Customers
        </button>
      </div>

      {/* Add Employee Button only on Employees tab */}
      {activeTab === "employees" && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add Employee
          </button>
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{user.id}</td>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.role}</td>
                <td className="border px-4 py-2 flex gap-2">
                  <button
                    onClick={() => { setSelectedUser(user); setIsEditOpen(true); }}
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {isEditOpen && (
        <EditUserModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          user={selectedUser}
        />
      )}

      {isCreateOpen && (
        <CreateEmployeeModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onEmployeeCreated={handleEmployeeCreated}
        />
      )}
    </div>
  );
};

export default UserManagement;
