import express from 'express';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Endpoint to fetch all data
app.get('/data', async (req, res) => {
  try {
    // Read the existing data from the JSON file
    const data = await fs.readFile('./data.json', 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    // If there's an error (e.g., file not found), return an empty array
    res.status(500).json({ error: 'Unable to fetch data' });
  }
});

// Endpoint to add data
app.post('/data', async (req, res) => {
  const { name, link } = req.body;

  if (!name || !link) {
    return res.status(400).json({ error: 'Name and link are required' });
  }

  // Generate a new ID using UUID
  const newData = { id: uuidv4(), name, link };

  try {
    // Read existing data
    const fileData = await fs.readFile('./data.json', 'utf-8');
    const jsonData = JSON.parse(fileData);

    // Add the new record to the existing data
    jsonData.push(newData);

    // Save updated data back to the JSON file
    await fs.writeFile('./data.json', JSON.stringify(jsonData, null, 2));

    // Send the newly added data as a response
    res.status(201).json(newData);
  } catch (error) {
    res.status(500).json({ error: 'Unable to save data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
      
