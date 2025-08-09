const express = require('express');
const fetch = require('node-fetch');
const Bookmark = require('../models/Aim'); // make sure this schema has `user` field
const auth = require('../middleware/authMiddleware'); // ✅ Auth middleware
const req = require('express/lib/request');
const { JSDOM } =  import('jsdom'); // dynamic import

const router = express.Router();

// 📌 Helper: Fetch title & favicon from URL
async function getMetaData(url) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const dom = new JSDOM(html);
    const title = dom.window.document.querySelector('title')?.textContent || 'No Title';
    const favicon =
      dom.window.document.querySelector("link[rel='icon']")?.href ||
      dom.window.document.querySelector("link[rel='shortcut icon']")?.href ||
      '';
    return { title, favicon };
  } catch (err) {
    console.error('Metadata fetch error:', err);
    return { title: 'Unknown', favicon: '' };
  }
}

// 📌 Helper: Get summary from Jina AI
async function getSummary(url) {
  try {
    const target = encodeURIComponent('url');
const res = await fetch(`https://r.jina.ai/http://${target}`);
return await res.text();
  } catch (err) {
    console.error('Summary fetch error:', err);
    return 'Summary not available.';
  }
}

// ➕ Create Bookmark (Protected & linked to logged-in user)
// router.post('/', auth, async (req, res) => {
//   try {
    
//     const { email,url } = req.body;
//     if (!url) return res.status(400).json({ error: 'URL is required' });
      
//     const { title, favicon } = await getMetaData(url);
//     const summary = await getSummary(url);

//     const bookmark = new Bookmark({
//       url,
//       title,
//       favicon,
//       summary,
//       user: req.userId // ✅ Store user ID from token
//     });

//     await bookmark.save();
//     res.status(201).json(bookmark);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });
router.post('/', async (req, res) => {
  try {
    const { email, url, tagline } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!email) {
      return res.status(401).json({ error: 'Unauthorized: User email missing' });
    }

    // Check if bookmark already exists
    const existingBookmark = await Bookmark.findOne({ email, url });
    if (existingBookmark) {
      return res.status(409).json({ error: 'Bookmark already exists for this URL' });
    }

    // Find max order for user's bookmarks
    const maxOrderBookmark = await Bookmark.findOne({ email }).sort({ order: -1 }).limit(1);
    const nextOrder = maxOrderBookmark ? maxOrderBookmark.order + 1 : 1;

    // Fetch metadata & summary
    const { title, favicon } = await getMetaData(url);
    const summary = await getSummary(url);

    // Create bookmark with calculated order
    const bookmark = new Bookmark({
      url,
      title,
      favicon,
      summary,
      tagline: tagline || "No tagline provided",
      order: nextOrder,
      email,
      createdAt: new Date(),
    });

    await bookmark.save();

    res.status(201).json(bookmark);
  } catch (err) {
    console.error('Error saving bookmark:', err);

    if (err.code === 11000) {
      return res.status(409).json({ error: 'Duplicate bookmark detected' });
    }

    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/nn',  async (req, res) => {
  try {
    const target = encodeURIComponent("https://en.wikipedia.org/wiki/Artificial_intelligence");

    // Fetch summary from external API
    const response = await fetch(`https://r.jina.ai/${target}`);

    if (!response.ok) {
      return res.status(502).json({ error: 'Failed to fetch summary from external API' });
    }

    const text = await response.text();

    // Send the summary text as response
    res.status(200).send(text);

  } catch (err) {
    console.error('Summary fetch error:', err);
    res.status(500).json({ error: 'Summary not available.' });
  }
});

// 📋 Get logged-in user's bookmarks
router.get('/bookmarks', async (req, res) => {
  try {
    const email = req.query.email;  // email sent as ?email=abc@example.com

    if (!email) {
      return res.status(400).json({ error: 'Email query parameter is required' });
    }

    const bookmarks = await Bookmark.find({ email }).sort({ createdAt: -1 });

    res.json(bookmarks);
  } catch (err) {
    console.error('Error fetching bookmarks:', err);
    res.status(500).json({ error: 'Server error' });
  }
});



//❌ Delete a bookmark (must belong to user)
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Bookmark.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!deleted) return res.status(404).json({ error: 'Bookmark not found' });
    res.json({ msg: 'Bookmark deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
router.put('/reorder', async (req, res) => {
  try {
    const { email, bookmarkId, newOrder } = req.body;

    if (!email || !bookmarkId || !newOrder) {
      return res.status(400).json({ error: 'email, bookmarkId, and newOrder are required' });
    }

    // Get all bookmarks for this email sorted by order ascending
    const bookmarks = await Bookmark.find({ email }).sort({ order: 1 });

    if (!bookmarks.length) {
      return res.status(404).json({ error: 'No bookmarks found for this user' });
    }

    // Find the bookmark to move
    const movingBookmark = bookmarks.find(b => b._id.toString() === bookmarkId);
    if (!movingBookmark) {
      return res.status(404).json({ error: 'Bookmark to move not found' });
    }

    // Remove the moving bookmark from array
    const filtered = bookmarks.filter(b => b._id.toString() !== bookmarkId);

    // Insert movingBookmark at (newOrder - 1) position (array is 0-indexed)
    const insertIndex = Math.max(0, Math.min(newOrder - 1, filtered.length));

    filtered.splice(insertIndex, 0, movingBookmark);

    // Re-assign order from 1 to n
    const bulkOps = filtered.map((b, index) => ({
      updateOne: {
        filter: { _id: b._id },
        update: { order: index + 1 }
      }
    }));

    await Bookmark.bulkWrite(bulkOps);

    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// router.post("/bookmark",auth, async (req, res)=>{
//   try{
//    const {url,tagline,email}=req.body;
//    if(!url || !email){
//     return res.status(400).json({error:"url and email required"});
//     get
//    }
//   }catch(err){

//   }
// })

module.exports = router;
