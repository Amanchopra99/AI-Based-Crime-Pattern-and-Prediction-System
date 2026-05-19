import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Trash2, Shield, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/admin/users`, { withCredentials: true });
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await axios.delete(`${BACKEND_URL}/api/admin/users/${userId}`, { withCredentials: true });
        fetchUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert(error.response?.data?.detail || 'Failed to delete user');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#007AFF]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6" data-testid="admin-panel">
      {/* Header */}
      <div>
        <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white mb-2" style={{ fontFamily: 'Chivo, sans-serif' }}>
          Admin Panel
        </h1>
        <p className="text-base text-[#A1A1AA]" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
          Manage users and system settings
        </p>
      </div>

      {/* User Management */}
      <div className="bg-[#121212] border border-white/10 rounded-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-[#007AFF]" />
          <h3 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: 'Chivo, sans-serif' }}>
            User Management
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" data-testid="users-table">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">
                  Role
                </th>
                <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">
                  Joined
                </th>
                <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition-colors" data-testid="user-row">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {user.role === 'admin' && <Shield className="w-4 h-4 text-[#007AFF]" />}
                      <span className="text-white text-sm" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#71717A]" />
                      <span className="text-[#A1A1AA] text-sm">{user.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 border text-xs uppercase tracking-wider rounded ${
                        user.role === 'admin'
                          ? 'bg-[#007AFF]/20 text-[#007AFF] border-[#007AFF]/30'
                          : 'bg-white/10 text-white border-white/20'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#A1A1AA] text-sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    {user.role !== 'admin' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteUser(user._id)}
                        className="border-[#FF3B30]/30 text-[#FF3B30] hover:bg-[#FF3B30]/20"
                        data-testid="delete-user-button"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
