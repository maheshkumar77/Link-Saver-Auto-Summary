import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLink, FiTrash2, FiPlus, FiLoader } from 'react-icons/fi';

export default function Bookmarks() {
  const [url, setUrl] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  // Fetch bookmarks on load
  useEffect(() => {
    if (token) {
      setLoading(true);
      axios.get('http://localhost:5000/api/bookmarks', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setBookmarks(res.data))
      .catch(err => setError('Failed to load bookmarks'))
      .finally(() => setLoading(false));
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setAddLoading(true);
    setError('');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/aims/',
        { url },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBookmarks(prev => [res.data, ...prev]);
      setUrl('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving bookmark');
    }
    setAddLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookmarks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookmarks(prev => prev.filter(b => b._id !== id));
    } catch (err) {
      setError('Error deleting bookmark');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <motion.h2 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-800 mb-6"
      >
        My Bookmarks
      </motion.h2>

      <motion.form 
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-3 mb-6"
      >
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiLink className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError('');
            }}
            className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={addLoading}
          className={`inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            addLoading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {addLoading ? (
            <>
              <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Adding...
            </>
          ) : (
            <>
              <FiPlus className="-ml-1 mr-2 h-4 w-4" />
              Add
            </>
          )}
        </button>
      </motion.form>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded"
        >
          <p className="text-red-700">{error}</p>
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <FiLoader className="animate-spin h-8 w-8 text-indigo-600" />
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {bookmarks.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-10 text-gray-500"
              >
                No bookmarks yet. Add your first one!
              </motion.div>
            )}

            {bookmarks.map(bookmark => (
              <motion.div
                key={bookmark._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-start p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                {bookmark.favicon && (
                  <div className="flex-shrink-0 mt-1 mr-4">
                    <img 
                      src={bookmark.favicon} 
                      alt="Favicon" 
                      className="h-5 w-5" 
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-lg font-medium text-indigo-600 hover:text-indigo-800 truncate"
                  >
                    {bookmark.title || bookmark.url}
                  </a>
                  {bookmark.summary && (
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {bookmark.summary}
                    </p>
                  )}
                  <div className="mt-2 text-xs text-gray-500">
                    {new Date(bookmark.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(bookmark._id)}
                  className="ml-4 p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                  aria-label="Delete bookmark"
                >
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}