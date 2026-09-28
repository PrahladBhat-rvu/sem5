const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Express server is running!',
    port: PORT
  });
});

app.get('/api/message', (req, res) => {
  res.json({
    success: true,
    message: 'Hello from the Express server!',
    serverPort: PORT,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
