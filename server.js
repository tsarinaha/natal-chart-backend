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
            return res.status(400).json({ error: 'Missing required fields' });
        }

        console.log('Input received:', { birthdate, birthtime, birthplace });

        // Geocoding request
        const geoResponse = await axios.get(`https://geocode.xyz/${birthplace}?json=1`);
        console.log('Geocoding response:', geoResponse.data);

        const { latt: lat, longt: lon } = geoResponse.data;

        if (!lat || !lon) {
            console.error('Geocoding failed:', geoResponse.data);
            return res.status(400).json({ error: 'Invalid birthplace. Unable to retrieve coordinates.' });
        }

        // Parse date and time
        const [year, month, day] = birthdate.split('-').map(Number);
        const [hour, minute] = birthtime.split(':').map(Number);

        // Prepare AstrologyAPI payload
        const data = {
            day,
            month,
            year,
            hour,
            min: minute,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            tzone: 0, // Adjust timezone if necessary
        };

        console.log('AstrologyAPI payload:', data);

        // AstrologyAPI request
        const astroResponse = await axios.post('https://json.astrologyapi.com/v1/natal_chart', data, {
            headers: { Authorization: 'Basic NjM1ODk1OmRjZjM4MjkwYWY2OWQwNjMwMDAxODRiNWI2NTlmY2RiMjBiMTBmNTg=' },
        });

        console.log('AstrologyAPI response:', astroResponse.data);

        res.json(astroResponse.data);
    } catch (error) {
        console.error('Error generating natal chart:', error.message || error);
        res.status(500).json({ error: 'Error generating natal chart. Please try again.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
