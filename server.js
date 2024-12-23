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
  const { birthdate, birthtime, birthplace } = req.body;

  try {
    // Step 1: Geocode the birthplace to get latitude and longitude
    const geoResponse = await axios.get(`https://geocode.xyz/${birthplace}?json=1`);
    const { latt: lat, longt: lon } = geoResponse.data;

    if (!lat || !lon) {
      return res.status(400).json({ error: 'Invalid birthplace. Unable to retrieve coordinates.' });
    }

    // Step 2: Parse the birthdate and time
    const [year, month, day] = birthdate.split('-').map(Number);
    const [hour, minute] = birthtime.split(':').map(Number);

    // Step 3: Prepare request payload for AstrologyAPI
    const data = {
      day,
      month,
      year,
      hour,
      min: minute,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      tzone: 0, // Adjust timezone dynamically if needed
    };

    // Step 4: Call the AstrologyAPI to generate natal chart
    const response = await axios.post(`${ASTROLOGY_API_BASE}/natal_chart`, data, {
      headers: { Authorization: AUTH_HEADER },
    });

    // Step 5: Send back the response
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error generating natal chart. Please try again.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
