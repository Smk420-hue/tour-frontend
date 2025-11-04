// src/components/DebugAuth.jsx (temporary)
import { useAuth } from "../context/AuthContext";

const DebugAuth = () => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <div>Loading auth...</div>;

  return (
    <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px', border: '1px solid #ccc' }}>
      <h3>Auth Debug Info:</h3>
      <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
      <p>Admin: {isAdmin ? 'Yes' : 'No'}</p>
      <p>User: {JSON.stringify(user)}</p>
      <p>Token: {localStorage.getItem('token') ? 'Exists' : 'Missing'}</p>
      <p>UserInfo: {localStorage.getItem('userInfo') || 'Missing'}</p>
    </div>
  );
};

export default DebugAuth;