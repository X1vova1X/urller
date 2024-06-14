const express = require('express');
const crypto = require('crypto');
const app = express();
const port = 3000;

// In-memory storage for short URLs
const shortURLs = new Map();

// Middleware to parse JSON request bodies
app.use(express.json());

// Endpoint to create a new short URL
app.post('/shorten', (req, res) => {
  const { longUrl } = req.body;
  const shortId = generateShortId();
  shortURLs.set(shortId, longUrl);
  const shortUrl = `${req.protocol}://${req.get('host')}/${shortId}`;
  res.json({ shortUrl });
});

// Endpoint to redirect from short URL to long URL
app.get('/:shortId', (req, res) => {
  const { shortId } = req.params;
  const longUrl = shortURLs.get(shortId);
  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.status(404).send('Short URL not found');
  }
});

// Endpoint to redirect the home page
app.get('/', (req, res) => {
  res.redirect('/shorten');
});

// Helper function to generate a unique short ID
function generateShortId() {
  return crypto.randomBytes(3).toString('hex');
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
