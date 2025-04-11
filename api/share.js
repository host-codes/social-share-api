export default async function handler(req, res) {
  const { id } = req.query;

  // Fallback if no ID is provided
  if (!id) {
    return res.status(400).send('Missing post ID');
  }

  try {
    // Fetch your JSON data from Google Apps Script API
    const apiUrl = 'https://script.google.com/macros/s/AKfycbw-HaIeROJ04q9T0_kpn6KNJfY-4Y3YBGKU2OFs8jTYmSPqGGw1qIkjuqz5-SfGT_bOmg/exec';
    const response = await fetch(apiUrl);
    const data = await response.json();
    const post = data.user[id];

    if (!post) {
      return res.status(404).send('Post not found');
    }

    const myPostUrl = `https://proquiz.a-web.online/p/detail.html?id=${id}`;
    const { Title, Description, Image } = post;

    // Send HTML with dynamic meta tags
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${Title}</title>

        <!-- Open Graph Meta Tags -->
        <meta property="og:title" content="${Title}" />
        <meta property="og:description" content="${Description}" />
        <meta property="og:image" content="${Image}" />
        <meta property="og:url" content="${myPostUrl}" />
        <meta property="og:type" content="article" />

        <!-- Twitter Card Meta Tags -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${Title}" />
        <meta name="twitter:description" content="${Description}" />
        <meta name="twitter:image" content="${Image}" />

        <!-- Redirect after meta info loaded -->
        <script>
          setTimeout(() => {
            window.location.href = "${myPostUrl}";
          }, 1000);
        </script>
      </head>
      <body>
        <p>Redirecting to post...</p>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error fetching or processing data:', error);
    res.status(500).send('Server error');
  }
}
