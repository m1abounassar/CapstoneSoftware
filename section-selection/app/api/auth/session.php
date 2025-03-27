<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['username'])) {
    http_response_code(401);
    echo json_encode(['loggedIn' => 'false']);
    exit;
}

echo json_encode([
    'loggedIn' => 'true',
    'username' => $_SESSION['username'],
    'displayName' => $_SESSION['displayName'] ?? null,
    'email' => $_SESSION['email'] ?? null,
]);
