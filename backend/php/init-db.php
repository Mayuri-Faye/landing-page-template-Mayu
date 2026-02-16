<?php
header('Content-Type: application/json');

// Database config
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'landing_db';

// Connect to MySQL without database first
$conn = new mysqli($host, $user, $pass);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Connection failed: ' . $conn->connect_error]);
    exit;
}

// Create database
$sql_create_db = "CREATE DATABASE IF NOT EXISTS $db";
if ($conn->query($sql_create_db) === TRUE) {
    echo json_encode(['success' => true, 'message' => 'Database created successfully']);
} else {
    echo json_encode(['success' => false, 'error' => 'Error creating database: ' . $conn->error]);
    exit;
}

// Select the database
if (!$conn->select_db($db)) {
    echo json_encode(['success' => false, 'error' => 'Error selecting database: ' . $conn->error]);
    exit;
}

// Create contacts table
$sql_create_table = "CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created (created_at)
)";

if ($conn->query($sql_create_table) === TRUE) {
    echo json_encode(['success' => true, 'message' => 'Table created successfully']);
} else {
    echo json_encode(['success' => false, 'error' => 'Error creating table: ' . $conn->error]);
}

$conn->close();
?>
