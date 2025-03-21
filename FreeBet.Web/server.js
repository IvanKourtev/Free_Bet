const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static(__dirname));

// Send index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 5003;
app.listen(PORT, () => {
    console.log(`Frontend server is running on http://localhost:${PORT}`);
}); 