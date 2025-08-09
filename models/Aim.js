const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: { type: String, required: true },
  favicon: { type: String },
  summary: { type: String },
  order: { type: Number },
  tagline: { type: String },
  createdAt: { type: Date, default: Date.now },
  email: { type: String, required: true },  // removed unique: true to allow multiple bookmarks per email
});

// Optional: ensure unique bookmarks per user + url pair
bookmarkSchema.index({ email: 1, url: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
