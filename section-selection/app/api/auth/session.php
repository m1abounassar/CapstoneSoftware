<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['username'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not logged in']);
    exit;
}

echo json_encode([
    'username' => $_SESSION['username'],
    'displayName' => $_SESSION['displayName'] ?? null,
    'email' => $_SESSION['email'] ?? null,
    'gtID' => $_SESSION['gtID'] ?? null
]);
