const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use('/:encodedUrl(*)', async (req, res) => {
  const targetUrl = req.params.encodedUrl;

  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    return res.status(400).send('Invalid target URL');
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Accept': req.headers.accept || '*/*'
      }
    });

    const contentType = response.headers.get('content-type');
    if (contentType) res.set('Content-Type', contentType);

    const buffer = await response.arrayBuffer();
    res.status(response.status).send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).send('Proxy error: ' + err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
