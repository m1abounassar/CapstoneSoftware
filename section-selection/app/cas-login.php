<?php
session_start();
require 'config.php';

// Check if CAS ticket is present
if (!isset($_GET['ticket'])) {
    $casLoginUrl = "https://login.gatech.edu/cas/login?service=" . urlencode(CAS_SERVICE);
    header("Location: $casLoginUrl");
    exit;
}

$ticket = $_GET['ticket'];
$casValidateUrl = "https://login.gatech.edu/cas/p3/serviceValidate?service=" . urlencode(CAS_SERVICE) . "&ticket=" . urlencode($ticket);

$response = file_get_contents($casValidateUrl);

if (preg_match('/<cas:user>(.*?)<\/cas:user>/', $response, $matches)) {
    $username = $matches[1];
    $_SESSION['username'] = $username;

    // Optional: Fetch attributes if GT OIT allows it
    $_SESSION['displayName'] = '';
    $_SESSION['email'] = '';
    $_SESSION['gtID'] = '';

    if (preg_match('/<cas:displayName>(.*?)<\/cas:displayName>/', $response, $matches)) {
        $_SESSION['displayName'] = $matches[1];
    }
    if (preg_match('/<cas:email>(.*?)<\/cas:email>/', $response, $matches)) {
        $_SESSION['email'] = $matches[1];
    }
    if (preg_match('/<cas:gtID>(.*?)<\/cas:gtID>/', $response, $matches)) {
        $_SESSION['gtID'] = $matches[1];
    }

    // Redirect to your frontend route
    header("Location: /admin/page.js");
    exit;
} else {
    echo "CAS authentication failed.";
    exit;
}
