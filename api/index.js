// api/index.js
const express = require('express');

const app = express();

// ✅ Allow JSON requests
app.use(express.json());

// 📞 Endpoint that your frontend will call
app.get('/api/get-details', async (req, res) => {
    // 1. Get the phone number from the frontend request
    const { number } = req.query;

    if (!number) {
        return res.status(400).json({ error: 'Phone number is required!' });
    }

    // 2. Your actual API details (🔐 IMPORTANT: Use environment variables!)
    const YOUR_API_KEY = process.env.API_KEY || 'lundkinger'; // Store key in Vercel env vars
    const YOUR_API_URL = `https://num-free-rootx-jai-shree-ram-14-day.vercel.app/?key=${YOUR_API_KEY}&number=${encodeURIComponent(number)}`;

    try {
        // 3. Fetch data from your real API
        console.log(`Fetching from your API for number: ${number}`);
        const apiResponse = await fetch(YOUR_API_URL);

        if (!apiResponse.ok) {
            // Handle your API's errors (like the 400 you're seeing)
            const errorText = await apiResponse.text();
            throw new Error(`Your API responded with status ${apiResponse.status}: ${errorText}`);
        }

        const data = await apiResponse.json();

        // 4. Send the successful data back to your frontend
        res.status(200).json(data);

    } catch (error) {
        console.error('Error calling your API:', error.message);
        res.status(500).json({
            error: 'Failed to fetch details from the main API.',
            details: error.message
        });
    }
});

// For local development
if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`🚀 Server running on http://localhost:${port}`);
    });
}

// Export for Vercel
module.exports = app;
