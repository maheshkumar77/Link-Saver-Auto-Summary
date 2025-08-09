import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FiUser, FiMail, FiCalendar, FiKey, FiEdit2, FiSave } from 'react-icons/fi';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('/api/users/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUser(data);
        setName(data.name);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    try {
      const { data } = await axios.put(
        '/api/users/me',
        { name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setUser(data);
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 mx-auto max-w-md bg-red-100 text-red-700 rounded-lg"
      >
        {error}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white shadow-xl rounded-lg overflow-hidden"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg"
                >
                  <FiUser className="text-indigo-600 text-3xl" />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold">
                    {editMode ? (
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-white bg-opacity-20 border-b border-white text-white"
                      />
                    ) : (
                      user.name
                    )}
                  </h1>
                  <p className="text-indigo-100">{user.email}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={editMode ? handleUpdate : () => setEditMode(true)}
                className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition"
              >
                {editMode ? <FiSave /> : <FiEdit2 />}
              </motion.button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6 space-y-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center p-4 bg-gray-50 rounded-lg"
            >
              <div className="p-3 mr-4 bg-indigo-100 rounded-full text-indigo-600">
                <FiMail className="text-xl" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="text-lg font-semibold">{user.email}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center p-4 bg-gray-50 rounded-lg"
            >
              <div className="p-3 mr-4 bg-indigo-100 rounded-full text-indigo-600">
                <FiKey className="text-xl" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Login Method</h3>
                <p className="text-lg font-semibold capitalize">{user.authProvider}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center p-4 bg-gray-50 rounded-lg"
            >
              <div className="p-3 mr-4 bg-indigo-100 rounded-full text-indigo-600">
                <FiCalendar className="text-xl" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                <p className="text-lg font-semibold">{user.createdAt}</p>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-indigo-50 p-4 rounded-lg text-center"
            >
              <p className="text-sm text-indigo-600">Account Status</p>
              <p className="text-xl font-bold text-indigo-700">Active</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-purple-50 p-4 rounded-lg text-center"
            >
              <p className="text-sm text-purple-600">User ID</p>
              <p className="text-xs font-mono text-purple-700 truncate">{user.uid}</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;