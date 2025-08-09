import React, { useState, useEffect } from 'react';
import { FiTrash2, FiPlay, FiPause, FiExternalLink } from 'react-icons/fi';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function SavedUrlsPage() {
  const [savedUrls, setSavedUrls] = useState([]);
  const [isPlaying, setIsPlaying] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fixed email used here
      const res = await axios.get('http://localhost:5000/api/aims/bookmarks?email=m@gmail.com');

      const orderedItems = res.data.map((item, index) => ({
        ...item,
        order: item.order ?? index + 1,
      }));
      orderedItems.sort((a, b) => a.order - b.order);
      setSavedUrls(orderedItems);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const deleteUrl = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/aims/${id}`);
      setSavedUrls((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Error deleting URL:', err);
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const item = savedUrls.find((item) => item._id === id);
      if (!item) return;

      await axios.patch(`http://localhost:5000/api/aims/${id}`, {
        isFavorite: !item.isFavorite,
      });

      setSavedUrls((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isFavorite: !item.isFavorite } : item
        )
      );
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const playSummary = (summary, id) => {
    if (isPlaying === id) {
      speechSynthesis.cancel();
      setIsPlaying(null);
      return;
    }

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(summary);
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onend = () => setIsPlaying(null);
    utterance.onerror = () => setIsPlaying(null);

    setIsPlaying(id);
    speechSynthesis.speak(utterance);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(savedUrls);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSavedUrls(items);

    try {
      await axios.put('http://localhost:5000/api/aims/reorder', {
        email: 'm@gmail.com', // fixed email here also
        bookmarkId: reorderedItem._id,
        newOrder: result.destination.index + 1,
      });

      await fetchData();
    } catch (err) {
      console.error('Error reordering:', err);
      await fetchData();
    }
  };

  const filteredUrls = savedUrls.filter((item) => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      (item.title?.toLowerCase().includes(lowerSearch) ||
      item.url?.toLowerCase().includes(lowerSearch));
    const matchesFilter = filter === 'all' || (filter === 'favorites' && item.isFavorite);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved URLs</h1>
          <p className="text-lg text-gray-600">Your collection of important links and summaries</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by title or URL..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search bookmarks"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
              aria-pressed={filter === 'all'}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter('favorites')}
              className={`px-4 py-2 rounded-lg flex items-center gap-1 ${
                filter === 'favorites' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
              aria-pressed={filter === 'favorites'}
            >
              <FaBookmark className={filter === 'favorites' ? 'text-white' : 'text-indigo-600'} />
              Favorites
            </button>
          </div>
        </div>

        {/* URL Cards with Drag & Drop */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="urls">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredUrls.map((item, index) => (
                  <Draggable key={item._id} draggableId={item._id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 ${
                          snapshot.isDragging ? 'ring-2 ring-indigo-500' : ''
                        }`}
                      >
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center">
                              <img
                                src={item.favicon || 'https://www.google.com/favicon.ico'}
                                alt="favicon"
                                className="w-5 h-5 mr-2"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = 'https://www.google.com/favicon.ico';
                                }}
                              />
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-lg font-semibold text-indigo-600 hover:text-indigo-800 line-clamp-1"
                                title={item.title}
                              >
                                {item.title}
                              </a>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleFavorite(item._id)}
                              className="text-gray-400 hover:text-yellow-500 transition-colors"
                              aria-label={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            >
                              {item.isFavorite ? (
                                <FaBookmark className="text-yellow-500" />
                              ) : (
                                <FaRegBookmark />
                              )}
                            </button>
                          </div>

                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <span className="mr-3">{formatDate(item.createdAt)}</span>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-indigo-500 hover:text-indigo-700"
                            >
                              <FiExternalLink className="mr-1" />
                              Visit
                            </a>
                          </div>

                          <p className="text-gray-700 line-clamp-3 mb-4">{item.summary}</p>

                          <div className="flex justify-between items-center">
                            <button
                              type="button"
                              onClick={() => playSummary(item.summary, item._id)}
                              className={`flex items-center px-3 py-2 rounded-lg ${
                                isPlaying === item._id
                                  ? 'bg-red-100 text-red-600'
                                  : 'bg-indigo-100 text-indigo-600'
                              } hover:opacity-80 transition-opacity`}
                              aria-label={isPlaying === item._id ? 'Stop Summary' : 'Play Summary'}
                            >
                              {isPlaying === item._id ? (
                                <>
                                  <FiPause className="mr-2" />
                                  Stop
                                </>
                              ) : (
                                <>
                                  <FiPlay className="mr-2" />
                                  Listen
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteUrl(item._id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                              title="Delete"
                              aria-label="Delete URL"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {filteredUrls.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No saved URLs found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedUrlsPage;
