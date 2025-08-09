import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './contextapi/UserContext'; // Adjust the path as needed

const SaveLink = () => {
  // Get the email from your UserContext (assuming email is stored as 'email')
  const { email: gmail } = useUser();

  const [url, setUrl] = useState('');
  const [tag, setTag] = useState('');
  const [savedLinks, setSavedLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!url) {
      setError('URL is required');
      setLoading(false);
      return;
    }

    try {
      // Validate URL format
      try {
        new URL(url);
      } catch {
        throw new Error('Please enter a valid URL (include http:// or https://)');
      }

      if (!gmail) {
        throw new Error('User email not found. Please login first.');
      }

      const payload = {
        email: gmail,
        url,
        ...(tag && { tag }),
      };

      await axios.post('http://localhost:5000/api/auth/aims/', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setSuccess('Link saved successfully!');
      setUrl('');
      setTag('');

      // Refresh list after saving
      await fetchLinks();
    } catch (err) {
      console.error('Error saving link:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save link');
    } finally {
      setLoading(false);
    }
  };

  const fetchLinks = async () => {
    if (!gmail) return;

    try {
      const response = await axios.get(`http://localhost:5000/api/auth/aims/?email=${encodeURIComponent(gmail)}`);
      setSavedLinks(response.data || []);
    } catch (err) {
      console.error('Error fetching links:', err);
      setError('Failed to load saved links');
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [gmail]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Save Your Links</h1>
          <p className="mt-2 text-sm text-gray-600">Store and organize your favorite web links</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
            <p>{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700">
              URL *
            </label>
            <div className="mt-1">
              <input
                type="url"
                id="url"
                name="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="tag" className="block text-sm font-medium text-gray-700">
              Tag (optional)
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="tag"
                name="tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. work, research, fun"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Link'
              )}
            </button>
          </div>
        </form>

        {savedLinks.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Your Saved Links</h2>
            <div className="space-y-4">
              {savedLinks.map((link, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 break-words"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        {link.url}
                      </a>
                      {link.tag && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {link.tag}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SaveLink;
