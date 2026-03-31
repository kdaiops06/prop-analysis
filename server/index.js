const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();

const upload = multer();
const DEFAULT_PORT = 3000;

app.use(cors());
app.use(express.json());

// Root GET route for health check
app.get('/', (req, res) => {
  res.send('Express server is running.');
});

// POST /analyze endpoint
app.post('/analyze', upload.single('file'), (req, res) => {
  let riskScore = Math.floor(Math.random() * 100); // Dummy risk score
  let issues = [];
  let recommendation = 'Safe';

  try {
    if (req.file) {
      // File uploaded
      // TODO: Analyze file content
      issues.push('File analysis not implemented');
      if (riskScore > 70) recommendation = 'Risky';
      if (riskScore > 90) recommendation = 'Avoid';
    } else if (req.body.text) {
      // Text input
      // TODO: Analyze text content
      issues.push('Text analysis not implemented');
      if (riskScore > 70) recommendation = 'Risky';
      if (riskScore > 90) recommendation = 'Avoid';
    } else {
      // Bad request
      console.error('No file or text provided');
      return res.status(400).json({ error: 'No file or text provided' });
    }


    // Enhanced interactive logging
    const now = new Date().toISOString();
    console.log('\n==============================');
    console.log(`[${now}] New /analyze request`);
    if (req.file) {
      console.log(`[${now}] File uploaded:`, req.file.originalname, req.file.mimetype);
    }
    if (req.body.text) {
      console.log(`[${now}] Text input:`, req.body.text);
    }
    console.log(`[${now}] Response:`, { riskScore, issues, recommendation });
    console.log('==============================\n');

    res.json({ riskScore, issues, recommendation });
  } catch (err) {
    console.error('Error in /analyze:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is in use. Trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(Number(process.env.PORT) || DEFAULT_PORT);
    startServer(Number(process.env.PORT) || DEFAULT_PORT);
