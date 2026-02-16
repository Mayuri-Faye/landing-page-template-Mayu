<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['email']) || !isset($input['phone'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Email and phone are required']);
    exit;
}

$email = trim($input['email']);
$phone = trim($input['phone']);

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email address']);
    exit;
}

$localSuccess = false;
$supabaseSuccess = false;
$errors = [];

// 1. Store in LOCAL MySQL Database
$conn = getDBConnection();
if ($conn) {
    $stmt = $conn->prepare("INSERT INTO contacts (email, phone, created_at) VALUES (?, ?, NOW())");
    
    if ($stmt) {
        $stmt->bind_param("ss", $email, $phone);
        
        if ($stmt->execute()) {
            $localSuccess = true;
        } else {
            $errors[] = "Local DB error: " . $stmt->error;
        }
        
        $stmt->close();
    } else {
        $errors[] = "Local DB prepare error: " . $conn->error;
    }
    
    $conn->close();
} else {
    $errors[] = "Could not connect to local database";
}

// 2. Store in Supabase (Optional - for backup)
$contactData = [
    'email' => $email,
    'phone' => $phone,
    'created_at' => date('c')
];

$response = makeSupabaseRequest('POST', 'contacts', $contactData);

if ($response['status'] === 201 || $response['status'] === 200) {
    $supabaseSuccess = true;
}

// Return response
if ($localSuccess) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Contact submitted successfully',
        'localDB' => $localSuccess,
        'supabaseDB' => $supabaseSuccess,
        'email' => $email
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to submit contact',
        'details' => $errors
    ]);
}
?>
