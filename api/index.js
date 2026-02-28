const express = require('express');

const app = express();
app.use(express.json());

app.get('/api/get-details', async (req, res) => {
    const { number } = req.query;

    if (!number) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    // 🔐 Use environment variable for API key (set in Vercel)
    const API_KEY = process.env.API_KEY || 'lundkinger'; // fallback only for local dev
    const TARGET_API = `https://num-free-rootx-jai-shree-ram-14-day.vercel.app/?key=${API_KEY}&number=${encodeURIComponent(number)}`;

    try {
        const response = await fetch(TARGET_API);
        const responseText = await response.text();

        // Try to parse as JSON
        let data;
        try {
            data = JSON.parse(responseText);
        } catch {
            // Not JSON – likely an HTML error page from the target API
            return res.status(502).json({
                error: 'Target API returned an invalid response',
                details: responseText.substring(0, 300) // Show first 300 chars for debugging
            });
        }

        // If we got JSON but the HTTP status was not OK
        if (!response.ok) {
            return res.status(response.status).json({
                error: 'Target API returned an error',
                details: data
            });
        }

        // Success – send the JSON to frontend
        res.json(data);

    } catch (error) {
        console.error('Fetch error:', error.message);
        res.status(500).json({ error: 'Failed to connect to target API' });
    }
});

// For local development
if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
}

module.exports = app;
