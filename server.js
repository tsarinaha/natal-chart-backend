const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// AstrologyAPI configuration
const ASTROLOGY_API_BASE = 'https://json.astrologyapi.com/v1';
const AUTH_HEADER = 'Basic NjM1ODk1OmRjZjM4MjkwYWY2OWQwNjMwMDAxODRiNWI2NTlmY2RiMjBiMTBmNTg=';

// Natal Chart Endpoint
app.post('/natal_chart', async (req, res) => {
    try {
        const { birthdate, birthtime, birthplace } = req.body;

        // Validate inputs
        if (!birthdate || !birthtime || !birthplace) {
            return res.status(400).json({ error: 'Missing required fields. Please provide birthdate, birthtime, and birthplace.' });
        }

        console.log('Input received:', { birthdate, birthtime, birthplace });

        // Geocode the birthplace
        const geoResponse = await axios.get(`https://geocode.xyz/${encodeURIComponent(birthplace)}?json=1`);
        const { latt: lat, longt: lon } = geoResponse.data;

        if (!lat || !lon) {
            return res.status(400).json({ error: 'Invalid birthplace. Unable to retrieve coordinates.' });
        }

        console.log('Geocoding response:', { lat, lon });

        // Parse birthdate and time
        const [year, month, day] = birthdate.split('-').map(Number);
        const [hour, minute] = birthtime.split(':').map(Number);

        // Prepare the payload for AstrologyAPI
        const data = {
            day,
            month,
            year,
            hour,
            min: minute,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            tzone: 0, // Adjust timezone as necessary
        };

    
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
