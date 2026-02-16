<?php
require_once 'config.php';

// Get all contacts from local database
$conn = getDBConnection();

if (!$conn) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Could not connect to database']);
    exit;
}

$result = $conn->query("SELECT id, email, phone, created_at FROM contacts ORDER BY created_at DESC");

if (!$result) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $conn->error]);
    $conn->close();
    exit;
}

$contacts = [];
while ($row = $result->fetch_assoc()) {
    $contacts[] = $row;
}

$conn->close();

header('Content-Type: application/json');
echo json_encode([
    'success' => true,
    'total' => count($contacts),
    'contacts' => $contacts
]);
?>
