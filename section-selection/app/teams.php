<?php
// Include the database connection file
include('db_connection.php');

// Get the raw POST data
$data = json_decode(file_get_contents('php://input'), true);

// Check if the 'action' field is set
if (isset($data['action'])) {
    $action = $data['action'];
    
    // Perform the appropriate action based on the value of 'action'
    if ($action === 'checkUser' && isset($data['username'])) {
        checkUser($data['username']);
    } elseif ($action === 'addUser' && isset($data['username'])) {
        addUser($data['username']);
    } else {
        // Invalid action
        echo json_encode(['error' => 'Invalid action']);
    }
} else {
    // No action specified
    echo json_encode(['error' => 'Action not specified']);
}

// Function to check if a user exists in the students table
function checkUser($username) {
    global $conn;  // Assuming $conn is the database connection

    // Prepare SQL to check if the username exists
    $stmt = $conn->prepare("SELECT COUNT(*) FROM students WHERE username = ?");
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    $stmt->close();

    // Return response
    if ($count > 0) {
        echo json_encode(['exists' => true]);
    } else {
        echo json_encode(['exists' => false]);
    }
}

// Function to add a new user to the students table
function addUser($username) {
    global $conn;

    // Prepare SQL to insert the new user
    $stmt = $conn->prepare("INSERT INTO students (username) VALUES (?)");
    $stmt->bind_param('s', $username);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Error adding user']);
    }
    $stmt->close();
}
?>