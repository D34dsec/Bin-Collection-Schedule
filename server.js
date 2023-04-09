const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

app.get('/api/bin-schedule', async (req, res) => {
  const { postcode, uprn } = req.query;
  const targetUrl = `https://www.nelincs.gov.uk/?s=${encodeURIComponent(postcode)}&uprn=${encodeURIComponent(uprn)}`;

  try {
    const response = await fetch(targetUrl);
    const html = await response.text();
    res.send(html);
  } catch (error) {
    console.error('Error fetching bin schedule:', error);
    res.status(500).send('Error fetching bin schedule');
  }
});

app.use(express.static('public'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});