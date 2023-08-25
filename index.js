require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

const originalUrls = [];
const shortUrls = [];

app.post('/api/shorturl', function (req, res) {
  const { url } = req.body;
  const urlRegex =
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;

  if (!urlRegex.test(url)) {
    res.json({ error: 'invalid url' });
  }
  if (originalUrls.includes(url)) {
    res.json({
      original_url: url,
      short_url: originalUrls.indexOf(url),
    });
  }
  originalUrls.push(url);
  shortUrls.push(shortUrls.length);

  res.json({ original_url: url, short_url: shortUrls.length - 1 });
});

app.get('/api/shorturl/:index?', function (req, res) {
  const { index } = req.params;

  res.status(301).redirect(originalUrls[index]);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
