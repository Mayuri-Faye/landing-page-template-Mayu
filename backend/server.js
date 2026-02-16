import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env.local' });

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004', 'http://localhost:3005', 'http://localhost:3006'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// MySQL Connection Pool
let pool = null;
try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'landing_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
} catch (error) {
  console.error('Failed to create connection pool:', error);
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Landing Page Backend API',
    status: 'running',
    endpoints: {
      health: '/health',
      submitContact: 'POST /api/contacts',
      getContacts: 'GET /api/contacts'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Initialize database endpoint
app.get('/api/init-db', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Create contacts table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await connection.execute(createTableQuery);
    connection.release();
    
    res.json({
      success: true,
      message: 'Database initialized successfully'
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Submit contact endpoint
app.post('/api/contacts', async (req, res) => {
  console.log('Received POST request to /api/contacts');
  console.log('Request body:', req.body);
  
  try {
    const { email, phone } = req.body;

    if (!email || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Email and phone are required'
      });
    }

    if (!pool) {
      console.error('MySQL pool is not initialized');
      return res.status(500).json({
        success: false,
        error: 'Database connection not available. Make sure MySQL is running.'
      });
    }

    console.log('Getting database connection...');
    const connection = await pool.getConnection();
    console.log('Connection obtained, executing query...');
    
    const query = 'INSERT INTO contacts (email, phone, created_at) VALUES (?, ?, NOW())';
    const [result] = await connection.execute(query, [email, phone]);
    
    connection.release();
    console.log('Contact saved with ID:', result.insertId);

    const responseData = {
      success: true,
      message: 'Contact submitted successfully',
      data: {
        id: result.insertId,
        email,
        phone
      }
    };
    
    console.log('Sending response:', responseData);
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error submitting contact:', error.message);
    console.error('Full error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while submitting the contact'
    });
  }
});

// Get all contacts endpoint
app.get('/api/contacts', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM contacts ORDER BY created_at DESC');
    connection.release();

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
